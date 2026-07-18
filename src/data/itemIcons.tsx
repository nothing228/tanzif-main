import type { ReactNode } from "react";
import {
  IconBag,
  IconBed,
  IconCarpet,
  IconCoat,
  IconCurtain,
  IconDress,
  IconHat,
  IconShirt,
  IconShoe,
  IconSofa,
  IconSpray,
  IconStroller,
  IconSuit,
  IconSuitcase,
  IconTie,
} from "../components/icons";

type IconFn = (p: { size?: number; className?: string }) => ReactNode;

/** name keywords win over the group — they are more specific */
const BY_NAME: [RegExp, IconFn][] = [
  [/ковер|ковёр|палас|ковролин|курпача|коврик/i, IconCarpet],
  [/чемодан/i, IconSuitcase],
  [/сумка|рюкзак|шоппер|дипломат|портфель/i, IconBag],
  [/обувь|кроссовк|туфл|сапож|ботин|тапоч|угг|мокасин|босонож/i, IconShoe],
  [/коляск|люльк|автокресл|стульчик/i, IconStroller],
  [/диван|кресл|стул|пуфик|бинбег|подножка|банкетк/i, IconSofa],
  [/штор|портьер|тюль|ламбрекен/i, IconCurtain],
  [/платье|сарафан|юбка/i, IconDress],
  [/костюм/i, IconSuit],
  [/пальто|куртка|шуба|дублёнк|дубленк|плащ|пуховик|жилет|полупальто/i, IconCoat],
  [/шапка|кепка|шляпа|берет|панамк|тюбетейк|бандан|пилотк|капюшон/i, IconHat],
  [/галстук|бабочка|перчатк|шарф|платок|ремень|подтяжк|варежк/i, IconTie],
  [/одеял|подушк|матрас|покрывал|наматрасник|постельное|плед|простын/i, IconBed],
  [/покраск|краска|окраш/i, IconSpray],
  [/футболк|рубашк|свитер|толстовк|худи|кофта|блуз|водолазк|поло/i, IconShirt],
];

/** fallback: the item's group, then its department */
const BY_GROUP: Record<string, IconFn> = {
  "ГОЛОВНЫЕ УБОРЫ": IconHat,
  АКСЕССУАРЫ: IconTie,
  "ВЕРХНЯЯ И ЗИМНЯЯ ОДЕЖДА": IconCoat,
  КОСТЮМЫ: IconSuit,
  "СПОРТИВНАЯ ОДЕЖДА": IconShirt,
  "ПЛАТЬЯ И НАРЯДЫ": IconDress,
  "ПРОЧИЕ ИЗДЕЛИЯ": IconShirt,
  "ДЕТСКАЯ ОДЕЖДА": IconShirt,
  "ВЗРОСЛАЯ ОБУВЬ": IconShoe,
  "ДЕТСКАЯ ОБУВЬ": IconShoe,
  ПОЛУСАПОЖКИ: IconShoe,
  ТАПОЧКИ: IconShoe,
  ОДЕЯЛА: IconBed,
  ПОКРЫВАЛА: IconBed,
  ПОДУШКИ: IconBed,
  НАМАТРАСНИКИ: IconBed,
  МАТРАСЫ: IconBed,
  "ПОСТЕЛЬНОЕ БЕЛЬЕ": IconBed,
  ШТОРЫ: IconCurtain,
  ИГРУШКИ: IconStroller,
  СТУЛЬЧИКИ: IconStroller,
  ЛЮЛЬКИ: IconStroller,
  КОЛЯСКИ: IconStroller,
  СТУЛЬЯ: IconSofa,
  ПУФИКИ: IconSofa,
  ДИВАНЫ: IconSofa,
  КРЕСЛА: IconSofa,
  БИНБЕГ: IconSofa,
  "МЕБЕЛЬНЫЕ ПОДУШКИ": IconSofa,
  "ПОДНОЖКА МЕБЕЛЬНАЯ": IconSofa,
  "ЧЕХОЛ МЯГКОЙ МЕБЕЛИ": IconSofa,
  АВТОЧЕХОЛ: IconSofa,
  "МЕБЕЛЬНЫЕ УСЛУГИ": IconSofa,
  СУМКИ: IconBag,
  ЧЕМОДАНЫ: IconSuitcase,
  ФЛАГИ: IconCurtain,
  КОВРЫ: IconCarpet,
  ПОКРАСКА: IconSpray,
};

/** Icon for a price-list row. Never returns nothing. */
export function iconFor(name: string, group: string): IconFn {
  for (const [re, icon] of BY_NAME) if (re.test(name)) return icon;
  return BY_GROUP[group] ?? IconShirt;
}
