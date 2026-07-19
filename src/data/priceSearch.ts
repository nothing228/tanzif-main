import { PRICELIST } from "./pricelist";

/**
 * Full-text search over the official price list, used as a tool by the AI
 * concierge. The price list is written in Russian; the model is instructed to
 * translate the customer's term before searching. Two things still need help:
 * uz spellings, and Russian words whose stem shifts between singular and the
 * plural used in the group headings ("ковёр" vs the "КОВРЫ" section) — both
 * are covered by the alias table below.
 */

export interface PriceHit {
  code: string;
  name: string;
  unit: string;
  /** UZS; 0 means the item is quoted individually */
  price: number;
  group: string;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/['ʻ’`]/g, "'")
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ")
    .trim();

/**
 * term → extra strings to search for. Values are matched as substrings against
 * the normalized price list, so they are written as stems where the ending
 * varies ("ковр" matches both "КОВРЫ" and "ковровый").
 */
const ALIASES: Record<string, string[]> = {
  // carpets — the items are named by material, not by the word "ковёр"
  ковер: ["ковр", "палас", "ковролин", "турецк"],
  гилам: ["ковр", "палас", "ковролин", "турецк"],
  gilam: ["ковр", "палас", "ковролин", "турецк"],
  kovyor: ["ковр", "палас", "ковролин", "турецк"],
  // footwear
  ботинки: ["сапож", "сапог", "угги"],
  сапоги: ["сапож", "сапог", "угги"],
  poyabzal: ["обувь"],
  obuv: ["обувь"],
  krossovka: ["кроссовк"],
  tufli: ["туфли"],
  // outerwear and clothing
  palto: ["пальто"],
  kurtka: ["куртка"],
  kostyum: ["костюм"],
  koylak: ["платье"],
  "ko'ylak": ["платье"],
  "кўйлак": ["платье"],
  plate: ["платье"],
  shim: ["брюки"],
  bryuki: ["брюки"],
  jinsi: ["джинс"],
  shlyapa: ["шляпа"],
  kepka: ["кепка"],
  shapka: ["шапка"],
  // words customers use that the price list spells differently
  занавески: ["штор", "тюль"],
  занавеска: ["штор", "тюль"],
  пуховик: ["куртка", "синтепон"],
  кофта: ["пуловер", "свитер", "кардиган"],
  // home textiles and furniture
  korpa: ["одеял"],
  "ko'rpa": ["одеял"],
  "кўрпа": ["одеял"],
  adyol: ["одеял"],
  kurpacha: ["курпача"],
  yostiq: ["подушк"],
  "ёстиқ": ["подушк"],
  matras: ["матрас"],
  parda: ["штор"],
  shtor: ["штор"],
  парда: ["штор"],
  divan: ["диван"],
  sumka: ["сумка"],
  ryukzak: ["рюкзак"],
  kolyaska: ["коляск"],
  коляск: ["коляск"],
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The term itself and its aliases match anywhere (they are whole words or
 * hand-picked stems, so they are already precise). Auto-truncated stems must
 * match at the start of a word — otherwise "пальто" → "паль" would happily
 * match "куПАЛЬник".
 */
function matches(term: string, haystack: string): boolean {
  const exact = [term, ...(ALIASES[term] ?? [])];
  if (exact.some((v) => v.length >= 3 && haystack.includes(v))) return true;

  const stems: string[] = [];
  if (term.length >= 6) stems.push(term.slice(0, -1), term.slice(0, -2));
  else if (term.length >= 5) stems.push(term.slice(0, -1));

  return stems
    .filter((v) => v.length >= 4)
    .some((v) => new RegExp(`(^|[^0-9a-zа-я])${escapeRe(v)}`).test(haystack));
}

/**
 * Scores every item against the query terms and returns the best matches.
 * A hit in the item name outweighs a hit in the group heading, so searching
 * "ковер" surfaces the carpet entries rather than everything in that section.
 */
export function searchPricelist(query: string, limit = 8): PriceHit[] {
  const terms = normalize(query)
    .split(" ")
    .filter((w) => w.length >= 3);

  if (terms.length === 0) return [];

  const scored: { hit: PriceHit; score: number }[] = [];

  for (const group of PRICELIST) {
    const heading = normalize(`${group.top} ${group.group}`);
    for (const item of group.items) {
      const name = normalize(item.name);
      let score = 0;
      for (const term of terms) {
        if (matches(term, name)) score += 10;
        else if (matches(term, heading)) score += 3;
      }
      if (score === 0) continue;
      // prefer concrete priced entries and shorter, more general names
      if (item.price > 0) score += 1;
      score -= name.length / 500;
      scored.push({
        hit: {
          code: item.code,
          name: item.name,
          unit: item.unit,
          price: item.price,
          group: group.group,
        },
        score,
      });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.hit);
}
