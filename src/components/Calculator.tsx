import { useMemo, useState } from "react";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { useAuthGate } from "./AuthGate";
import { AnimatedList } from "./AnimatedList";
import { PRICELIST } from "../data/pricelist";
import { DEPARTMENTS, deptLabel, groupName, itemName, unitName } from "../data/priceLocale";
import { iconFor } from "../data/itemIcons";
import { SectionTag } from "./SectionTag";
import { CareWash, IconCheck, IconSearch } from "./icons";
import "./Calculator.scss";

const FREE_COURIER_FROM = 100_000;
const READY_DAYS = 3;
const ALL = "__all__";

interface Row {
  code: string;
  /** Russian — what iconFor matches on */
  name: string;
  /** what the customer reads, in the active language */
  label: string;
  unit: string;
  price: number;
  /** Russian subgroup — the stable key */
  group: string;
  groupLabel: string;
  dept: string;
}

const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/,/g, " ");

export function Calculator() {
  const { t, lang } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const { guard, gate } = useAuthGate();

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>(DEPARTMENTS[0].key);
  const [sent, setSent] = useState(false);

  /* rebuilt on language change — the labels are localised, the keys are not */
  const rows = useMemo<Row[]>(
    () =>
      PRICELIST.flatMap((g) =>
        g.items.map((i) => ({
          code: i.code,
          name: i.name,
          label: itemName(i, lang),
          unit: unitName(i.unit, lang),
          price: i.price,
          group: g.group,
          groupLabel: groupName(g, lang),
          dept: g.top,
        })),
      ),
    [lang],
  );

  const change = (code: string, delta: number) =>
    setCounts((c) => {
      const next = Math.max(0, Math.min(99, (c[code] ?? 0) + delta));
      const copy = { ...c };
      if (next === 0) delete copy[code];
      else copy[code] = next;
      return copy;
    });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      /* the Russian name is searched alongside the localised one, so a term
         typed in either language still finds the item */
      return rows.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.code.includes(q) ||
          r.groupLabel.toLowerCase().includes(q) ||
          r.group.toLowerCase().includes(q),
      );
    }
    return dept === ALL ? rows : rows.filter((r) => r.dept === dept);
  }, [query, dept, rows]);

  const rowByCode = useMemo(() => new Map(rows.map((r) => [r.code, r])), [rows]);

  const { total, picked } = useMemo(() => {
    let total = 0;
    const picked: { code: string; name: string; count: number; sum: number; quote: boolean }[] = [];
    for (const [code, count] of Object.entries(counts)) {
      const row = rowByCode.get(code);
      if (!row) continue;
      const sum = row.price * count;
      total += sum;
      picked.push({ code, name: row.label, count, sum, quote: row.price === 0 });
    }
    return { total, picked };
  }, [counts, rowByCode]);

  const hasItems = picked.length > 0;
  const courierFree = total >= FREE_COURIER_FROM;

  const renderRow = (row: Row) => {
    const n = counts[row.code] ?? 0;
    const Icon = iconFor(row.name, row.group);
    return (
      <div className={`price-row ${n > 0 ? "is-picked" : ""}`}>
        <span className="price-row__icon" aria-hidden>
          <Icon size={24} />
        </span>
        <div className="price-row__main">
          <span className="price-row__name">{row.label}</span>
          <span className="price-row__group mono">
            {row.code} · {row.groupLabel}
          </span>
        </div>
        <span className="price-row__price mono">
          {row.price > 0 ? `${fmt(row.price)} ${t.calc.sum} / ${row.unit}` : t.price.individual}
        </span>
        <div
          className="price-row__stepper"
          onClick={(e) => e.stopPropagation()} /* keep row-select out of the stepper */
        >
          <button onClick={() => change(row.code, -1)} aria-label={`− ${row.label}`} disabled={n === 0}>
            −
          </button>
          <span className="mono">{n}</span>
          <button onClick={() => change(row.code, 1)} aria-label={`+ ${row.label}`}>
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="section section--white" id="calc">
      <div className="container">
        <div className="section-head">
          <SectionTag num="02" label={t.module} icon={<CareWash size={18} />} />
          <h2>{t.price.title}</h2>
          <p>{t.price.lead}</p>
        </div>

        <div className="calc reveal" ref={ref}>
          <div className="calc__catalog">
            <div className="calc__search">
              <IconSearch size={18} />
              <input
                type="search"
                placeholder={t.price.searchPh}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {!query && (
              <div className="calc__depts" role="tablist">
                {DEPARTMENTS.map((d) => (
                  <button
                    key={d.key}
                    role="tab"
                    aria-selected={dept === d.key}
                    className={`calc__dept ${dept === d.key ? "is-active" : ""}`}
                    onClick={() => setDept(d.key)}
                  >
                    {deptLabel(d, lang)}
                  </button>
                ))}
                <button
                  role="tab"
                  aria-selected={dept === ALL}
                  className={`calc__dept ${dept === ALL ? "is-active" : ""}`}
                  onClick={() => setDept(ALL)}
                >
                  {t.price.all}
                </button>
              </div>
            )}

            <p className="calc__count mono">
              {visible.length} {t.price.found} · {t.price.tapToAdd}
            </p>

            {visible.length ? (
              <AnimatedList
                items={visible}
                renderItem={renderRow}
                onItemSelect={(row) => change(row.code, 1)}
                showGradients
                enableArrowNavigation
                displayScrollbar
              />
            ) : (
              <p className="calc__empty calc__empty--search">{t.price.empty}</p>
            )}
          </div>

          <aside className="calc__receipt">
            <div className="calc__receipt-hole" aria-hidden />
            <h3 className="mono">TANZIF</h3>
            <p className="calc__receipt-title">{t.calc.receiptTitle}</p>

            {hasItems ? (
              <>
                <ul className="calc__receipt-lines">
                  {picked.map((p) => (
                    <li key={p.code}>
                      <span>
                        {p.name} × {p.count}
                      </span>
                      <span className="mono">{p.quote ? "—" : fmt(p.sum)}</span>
                    </li>
                  ))}
                </ul>
                <div className="calc__receipt-row calc__receipt-row--total">
                  <span>{t.calc.total}</span>
                  <span className="mono">
                    {fmt(total)} {t.calc.sum}
                  </span>
                </div>
                <div className="calc__receipt-row">
                  <span>{t.calc.courier}</span>
                  <span className={courierFree ? "calc__free" : "mono"}>
                    {courierFree ? t.calc.free : `20 000 ${t.calc.sum}`}
                  </span>
                </div>
                <div className="calc__receipt-row">
                  <span>{t.calc.time}</span>
                  <span className="mono">
                    {READY_DAYS} {t.calc.days}
                  </span>
                </div>

                {sent ? (
                  <p className="calc__sent">
                    <IconCheck size={16} />
                    {t.pickup.success}
                  </p>
                ) : (
                  <button
                    className="btn btn--primary calc__order"
                    onClick={() => guard(() => setSent(true))}
                  >
                    {t.calc.order}
                  </button>
                )}
                <p className="calc__note">{t.calc.courierNote}</p>
              </>
            ) : (
              <p className="calc__empty">{t.calc.empty}</p>
            )}
          </aside>
        </div>
      </div>
      {gate}
    </section>
  );
}
