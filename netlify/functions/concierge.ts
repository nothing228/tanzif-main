import Anthropic from "@anthropic-ai/sdk";
import { searchPricelist } from "../../src/data/priceSearch";

/**
 * Server-side proxy for the AI concierge.
 *
 * The API key lives here and never reaches the browser. The model cannot quote
 * a price from memory — every number it shows has to come back from the
 * search_pricelist tool, which reads the real price list.
 */

const MODEL = "claude-opus-4-8";

/** guards against a single visitor running up the bill */
const MAX_MESSAGES = 24;
const MAX_CHARS = 1000;
/** one user turn can trigger at most this many tool round-trips */
const MAX_TOOL_ROUNDS = 5;

const LANGUAGE_NAMES = {
  uz: "uzbek (latin script)",
  oz: "uzbek (cyrillic script)",
  ru: "russian",
} as const;

type LangKey = keyof typeof LANGUAGE_NAMES;

const systemPrompt = (lang: LangKey) => `
You are the AI concierge for TANZIF, a technology-driven dry cleaning service in Uzbekistan.
You help customers estimate prices, understand what can be cleaned, and get stain advice.

LANGUAGE
Reply in ${LANGUAGE_NAMES[lang]}. Match the customer's script exactly — never reply in
cyrillic to a latin-script message or vice versa. Customers often mix uzbek and russian in
one sentence; that is normal, just answer in the language named above.

PRICES — THE ONE HARD RULE
Never state a price from memory. To quote any price you MUST call search_pricelist first and
use only the numbers it returns. The price list is written in russian, so translate the
customer's word before searching: "palto" and "пальто" both search as "пальто". If the search
comes back empty, try one different russian word for the same thing before giving up.
If a returned item has price 0, it is quoted individually — say the manager will confirm the
price, do not invent a number.
Prices are in Uzbek soʻm. Format them with spaces: 270 000 soʻm.
When several items match, do not dump the whole list — name the two or three most likely ones
with their prices, and ask which one the customer means.

STAIN ADVICE
Coffee, tea, wine, grease, ink, blood, grass: give one short practical tip. The core rule is
always the same — do not rub it at home, do not apply heat, bring it in quickly. Fresh stains
come out far more often than old ones. Never promise a stain will definitely come out; say it
is likely or that the technologist will assess it.

SERVICE FACTS
Standard turnaround is 2-3 days. Courier pickup and delivery is available across Tashkent.
Orders are tracked live in the app. For anything you do not know — exact timing for a specific
order, complaints, refunds, an order's status — say you will connect them to an operator
rather than guessing.

STYLE
You are a chat widget on a phone: two or three sentences, no markdown, no bullet lists, no
headings. Warm and direct. Give the answer first, details after. Do not describe your own
reasoning or mention tools, searching, or the price list as a system — just answer.
`.trim();

const tools: Anthropic.Tool[] = [
  {
    name: "search_pricelist",
    description:
      "Search TANZIF's official price list. Call this before quoting any price. " +
      "The query must be in russian (the price list is written in russian), so translate " +
      "the customer's word first — for example a customer writing 'palto' or 'пальто' " +
      "should be searched as 'пальто'. Returns matching items with their price in Uzbek " +
      "soʻm; a price of 0 means the item is quoted individually by a manager.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The item to look up, in russian. For example: пальто, ковер, одеяло.",
        },
      },
      required: ["query"],
    },
  },
];

function runTool(name: string, input: unknown): string {
  if (name !== "search_pricelist") return `Unknown tool: ${name}`;

  const query = (input as { query?: unknown } | null)?.query;
  if (typeof query !== "string" || !query.trim()) {
    return "Error: query must be a non-empty string.";
  }

  const hits = searchPricelist(query);
  if (hits.length === 0) {
    return `No price list entries match "${query}". Try a different russian word for the same item.`;
  }

  return JSON.stringify(
    hits.map((h) => ({
      code: h.code,
      name: h.name,
      unit: h.unit,
      price_uzs: h.price,
      individual_quote: h.price === 0,
      section: h.group,
    })),
  );
}

interface ClientMessage {
  role: "user" | "assistant";
  content: string;
}

/** rejects anything that isn't a well-formed, reasonably sized conversation */
function parseBody(body: unknown): { messages: ClientMessage[]; lang: LangKey } | string {
  if (typeof body !== "object" || body === null) return "Malformed request body.";
  const { messages, lang } = body as { messages?: unknown; lang?: unknown };

  if (!Array.isArray(messages) || messages.length === 0) return "messages must be a non-empty array.";
  if (messages.length > MAX_MESSAGES) return "Conversation too long.";

  const parsed: ClientMessage[] = [];
  for (const m of messages) {
    const { role, content } = (m ?? {}) as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return "Invalid message role.";
    if (typeof content !== "string" || !content.trim()) return "Invalid message content.";
    if (content.length > MAX_CHARS) return "Message too long.";
    parsed.push({ role, content });
  }
  if (parsed[parsed.length - 1].role !== "user") return "Last message must be from the user.";

  const key: LangKey = lang === "uz" || lang === "oz" || lang === "ru" ? lang : "ru";
  return { messages: parsed, lang: key };
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set");
    return Response.json({ error: "Concierge is not configured." }, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = parseBody(raw);
  if (typeof parsed === "string") {
    return Response.json({ error: parsed }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });
  const messages: Anthropic.MessageParam[] = parsed.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt(parsed.lang),
        // a chat widget is latency-sensitive and this task is lookup-and-summarise,
        // so we skip thinking and keep effort low
        thinking: { type: "disabled" },
        output_config: { effort: "low" },
        tools,
        messages,
      });

      if (response.stop_reason === "tool_use") {
        // the last round is reserved for the model's final answer
        if (round === MAX_TOOL_ROUNDS) break;

        messages.push({ role: "assistant", content: response.content });
        messages.push({
          role: "user",
          content: response.content
            .filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use")
            .map((b) => ({
              type: "tool_result" as const,
              tool_use_id: b.id,
              content: runTool(b.name, b.input),
            })),
        });
        continue;
      }

      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();

      if (!text) break;
      return Response.json({ reply: text });
    }

    // ran out of tool rounds, or the model returned nothing usable
    return Response.json({ error: "No answer produced." }, { status: 502 });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "Busy, try again shortly." }, { status: 429 });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error("Anthropic rejected the API key");
      return Response.json({ error: "Concierge is not configured." }, { status: 503 });
    }
    console.error("Concierge request failed:", err);
    return Response.json({ error: "Concierge is unavailable." }, { status: 502 });
  }
};
