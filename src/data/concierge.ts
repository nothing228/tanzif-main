import { PRICELIST } from "./pricelist";
import type { PriceItem } from "./pricelist";
import type { LocaleKey } from "../i18n/translations";

/**
 * Rule-based concierge engine: understands item-price questions and stain
 * questions in uz-Latin, uz-Cyrillic and Russian, and answers from the real
 * price list. To plug in a real LLM later, swap findStain/findItems for an
 * API call — the chat UI only depends on these small functions.
 */

interface StainInfo {
  keywords: string[];
  chance: number;
  advice: Record<LocaleKey, string>;
  name: Record<LocaleKey, string>;
}

const STAINS: StainInfo[] = [
  {
    keywords: ["qahva", "kofe", "қаҳва", "кофе", "coffee", "чой", "choy", "чай"],
    chance: 90,
    name: { uz: "Qahva / choy", oz: "Қаҳва / чой", ru: "Кофе / чай" },
    advice: {
      uz: "Uyda ishqalamang — dogʻ tolaga singib ketadi. Bizga tezroq olib keling.",
      oz: "Уйда ишқаламанг — доғ толага сингиб кетади. Бизга тезроқ олиб келинг.",
      ru: "Не трите дома — пятно въестся в волокна. Привезите нам как можно быстрее.",
    },
  },
  {
    keywords: ["vino", "вино", "sharob", "шароб"],
    chance: 80,
    name: { uz: "Vino", oz: "Вино", ru: "Вино" },
    advice: {
      uz: "Tuz sepmang! Quruq salfetka bilan yengil bosing va 24 soat ichida olib keling.",
      oz: "Туз сепманг! Қуруқ салфетка билан енгил босинг ва 24 соат ичида олиб келинг.",
      ru: "Не посыпайте солью! Слегка промокните сухой салфеткой и привезите в течение 24 часов.",
    },
  },
  {
    keywords: ["yog", "yogʻ", "ёғ", "жир", "moy", "мой", "масло", "yog'"],
    chance: 92,
    name: { uz: "Yogʻ / moy", oz: "Ёғ / мой", ru: "Жир / масло" },
    advice: {
      uz: "Suv bilan yuvmang — yogʻ suvda erimaydi. Professional quruq tozalash kerak.",
      oz: "Сув билан ювманг — ёғ сувда эримайди. Профессионал қуруқ тозалаш керак.",
      ru: "Не застирывайте водой — жир в воде не растворяется. Нужна профессиональная сухая чистка.",
    },
  },
  {
    keywords: ["siyoh", "сиёҳ", "чернил", "ruchka", "ручка", "qalam"],
    chance: 65,
    name: { uz: "Siyoh", oz: "Сиёҳ", ru: "Чернила" },
    advice: {
      uz: "Spirt yoki atsetondan foydalanmang — rang ketishi mumkin. Mutaxassisga ishoning.",
      oz: "Спирт ёки ацетондан фойдаланманг — ранг кетиши мумкин. Мутахассисга ишонинг.",
      ru: "Не используйте спирт или ацетон — может сойти краска ткани. Доверьте специалисту.",
    },
  },
  {
    keywords: ["qon", "қон", "кров"],
    chance: 75,
    name: { uz: "Qon", oz: "Қон", ru: "Кровь" },
    advice: {
      uz: "Faqat sovuq suv! Issiq suv oqsilni tolaga «pishirib» qoʻyadi.",
      oz: "Фақат совуқ сув! Иссиқ сув оқсилни толага «пишириб» қўяди.",
      ru: "Только холодная вода! Горячая «заваривает» белок в волокнах.",
    },
  },
  {
    keywords: ["boʻyoq", "bo'yoq", "бўёқ", "краск", "kraska"],
    chance: 55,
    name: { uz: "Boʻyoq", oz: "Бўёқ", ru: "Краска" },
    advice: {
      uz: "Qotib qolgan boʻyoq eng qiyin dogʻlardan. Qanchalik tez kelsangiz, shuncha yaxshi.",
      oz: "Қотиб қолган бўёқ энг қийин доғлардан. Қанчалик тез келсангиз, шунча яхши.",
      ru: "Засохшая краска — одно из сложнейших пятен. Чем быстрее привезёте, тем лучше.",
    },
  },
  {
    keywords: ["ter", "тер", "пот"],
    chance: 85,
    name: { uz: "Ter dogʻi", oz: "Тер доғи", ru: "Пятна пота" },
    advice: {
      uz: "Dezodorant izlari bilan birga professional ishlov talab qiladi.",
      oz: "Дезодорант излари билан бирга профессионал ишлов талаб қилади.",
      ru: "Вместе со следами дезодоранта требует профессиональной обработки.",
    },
  },
  {
    keywords: ["kosmetika", "косметик", "pomada", "помада", "tush", "тушь"],
    chance: 82,
    name: { uz: "Kosmetika", oz: "Косметика", ru: "Косметика" },
    advice: {
      uz: "Yogʻli asosli — uyda yuvish dogʻni kengaytiradi. Bizga olib keling.",
      oz: "Ёғли асосли — уйда ювиш доғни кенгайтиради. Бизга олиб келинг.",
      ru: "Жировая основа — домашняя стирка растянет пятно. Привезите нам.",
    },
  },
];

/** keyword → search terms inside the real price list */
const ITEM_KEYWORDS: { keywords: string[]; search: string[] }[] = [
  { keywords: ["palto", "пальто"], search: ["Пальто демисезонное", "Пальто зимнее"] },
  { keywords: ["kostyum", "костюм"], search: ["Костюм (2ка)", "Костюм (3ка)"] },
  { keywords: ["gilam", "гилам", "ковер", "ковёр", "kovyor"], search: ["Классич./палас", "Импортн./турецкий"] },
  { keywords: ["divan", "диван"], search: ["Диван"] },
  { keywords: ["parda", "парда", "штор", "shtor"], search: ["Шторы тюль"] },
  { keywords: ["poyabzal", "пойабзал", "обувь", "obuv", "krossovka", "кроссовк", "tufli", "туфли"], search: ["Взрослая обувь: босоножки, туфли, мокасины, кроссовки"] },
  { keywords: ["sumka", "сумка", "ryukzak", "рюкзак"], search: ["Сумка, рюкзак, шоппер"] },
  { keywords: ["kurtka", "куртка"], search: ["Куртка длинная (синтепон", "Куртка короткая до бедра (синтепон"] },
  { keywords: ["koylak", "koʻylak", "кўйлак", "платье", "plate"], search: ["Платье", "Платье вечернее"] },
  { keywords: ["kurpacha", "курпача"], search: ["Курпача короткая", "Курпача длинная"] },
  { keywords: ["korpa", "koʻrpa", "кўрпа", "одеял", "adyol"], search: ["Одеяло"] },
  { keywords: ["matras", "матрас"], search: ["Матрас 2х спальный", "Матрас 1но спальный"] },
  { keywords: ["yostiq", "ёстиқ", "подушк"], search: ["Подушка"] },
  { keywords: ["shim", "шим", "брюки", "bryuki", "jinsi", "джинс"], search: ["Брюки, джинсы"] },
  { keywords: ["kolyaska", "коляск"], search: ["Коляска-люлька", "Коляска прогулочная"] },
  { keywords: ["shlyapa", "шляпа", "kepka", "кепка", "shapka", "шапка"], search: ["Кепка/панамка", "Шапка"] },
];

function findPriceItems(searches: string[]): PriceItem[] {
  const found: PriceItem[] = [];
  for (const s of searches) {
    for (const group of PRICELIST) {
      for (const item of group.items) {
        if (item.name.toLowerCase().startsWith(s.toLowerCase()) && item.price > 0) {
          found.push(item);
          if (found.length >= 3) return found;
        }
      }
    }
  }
  return found;
}

const GREETINGS = ["salom", "салом", "привет", "здравств", "assalomu", "ассалому", "hello", "hi"];

/** locale-aware stain lookup used by the chat UI */
export function findStain(query: string, lang: LocaleKey): { name: string; chance: number; advice: string } | null {
  const q = query.toLowerCase();
  for (const stain of STAINS) {
    if (stain.keywords.some((k) => q.includes(k))) {
      return { name: stain.name[lang], chance: stain.chance, advice: stain.advice[lang] };
    }
  }
  return null;
}

export function findItems(query: string): PriceItem[] {
  const q = query.toLowerCase().replace(/['ʻ’`]/g, "'");
  for (const entry of ITEM_KEYWORDS) {
    if (entry.keywords.some((k) => q.includes(k))) {
      return findPriceItems(entry.search);
    }
  }
  return [];
}

export function isGreeting(query: string): boolean {
  const q = query.toLowerCase();
  return GREETINGS.some((g) => q.includes(g)) && q.length < 40;
}
