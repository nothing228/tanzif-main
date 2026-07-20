import type { LocaleKey } from "../i18n/translations";
import { PRICELIST } from "./pricelist";
import type { PriceGroup, PriceItem } from "./pricelist";

/**
 * Display names for the price list. The Russian name stays canonical — icon
 * matching (itemIcons) and the AI concierge search (priceSearch) both key off
 * it — so these helpers only affect what the customer reads. Items the Uzbek
 * sheet does not cover fall back to Russian rather than showing a blank.
 */

export function itemName(item: PriceItem, lang: LocaleKey): string {
  if (lang === "oz") return item.nameOz ?? item.name;
  if (lang === "uz") return item.nameUz ?? item.name;
  return item.name;
}

export function groupName(group: PriceGroup, lang: LocaleKey): string {
  if (lang === "oz") return group.groupOz;
  if (lang === "uz") return group.groupUz;
  return group.group;
}

export function topName(group: PriceGroup, lang: LocaleKey): string {
  if (lang === "oz") return group.topOz;
  if (lang === "uz") return group.topUz;
  return group.top;
}

/**
 * Departments in price-list order. `key` is the Russian heading and is what the
 * filter state stores, so switching language never drops the current tab.
 */
export const DEPARTMENTS: { key: string; ru: string; oz: string; uz: string }[] = [];
for (const g of PRICELIST) {
  if (!DEPARTMENTS.some((d) => d.key === g.top)) {
    DEPARTMENTS.push({ key: g.top, ru: g.top, oz: g.topOz, uz: g.topUz });
  }
}

export function deptLabel(dept: { ru: string; oz: string; uz: string }, lang: LocaleKey): string {
  const raw = lang === "oz" ? dept.oz : lang === "uz" ? dept.uz : dept.ru;
  /* the Russian headings all start with "ОТДЕЛ …"; the Uzbek ones do not */
  return raw.replace(/^ОТДЕЛ\s+/i, "");
}

/**
 * Both source sheets write the unit column in Russian abbreviations, which
 * reads wrong next to an Uzbek item name. Six values cover the whole list.
 */
const UNITS: Record<string, { oz: string; uz: string }> = {
  "шт.": { oz: "дона", uz: "dona" },
  "пара": { oz: "жуфт", uz: "juft" },
  "кг": { oz: "кг", uz: "kg" },
  "метр": { oz: "метр", uz: "metr" },
  "метр кв.": { oz: "кв.м", uz: "kv.m" },
  "посад.место": { oz: "ўрин", uz: "oʻrin" },
};

export function unitName(unit: string, lang: LocaleKey): string {
  if (lang === "ru") return unit;
  const found = UNITS[unit];
  if (!found) return unit;
  return lang === "oz" ? found.oz : found.uz;
}
