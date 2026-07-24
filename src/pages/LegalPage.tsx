import { Link, useLocation, Navigate } from "react-router-dom";
import { useLang } from "../i18n/LangContext";
import "./LegalPage.scss";

const LEGAL_KEYS = ["offer", "privacy", "terms"] as const;
type LegalKey = (typeof LEGAL_KEYS)[number];

function isLegalKey(v: string): v is LegalKey {
  return (LEGAL_KEYS as readonly string[]).includes(v);
}

export function LegalPage() {
  const { pathname } = useLocation();
  const { t } = useLang();
  const doc = pathname.replace(/^\//, "");

  if (!isLegalKey(doc)) return <Navigate to="/" replace />;

  const page = t.legal[doc];

  return (
    <section className="legal">
      <div className="container legal__inner">
        <p className="legal__crumb">
          <Link to="/">{t.nav.home}</Link>
          <span aria-hidden>/</span>
          <span>{page.title}</span>
        </p>
        <h1>{page.title}</h1>
        <p className="legal__updated">{page.updated}</p>
        <div className="legal__body">
          {page.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
        </div>
        <nav className="legal__links" aria-label={t.footer.legalTitle}>
          {LEGAL_KEYS.map((key) => (
            <Link key={key} to={`/${key}`} className={key === doc ? "is-active" : undefined}>
              {t.legal[key].title}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
