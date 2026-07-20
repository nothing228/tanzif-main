import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../i18n/LangContext";
import { useTheme } from "../hooks/ThemeContext";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useAuth } from "../auth/AuthContext";
import { CONTACTS } from "../data/contacts";
import type { LocaleKey } from "../i18n/translations";
import { AnchorLink } from "./AnchorLink";
import { StaggeredMenu } from "./StaggeredMenu";
import { IconMoon, IconSun } from "./icons";
import { Logo, LogoWord } from "./Logo";
import "./Header.scss";

const LANGS: { key: LocaleKey; label: string }[] = [
  { key: "uz", label: "Oʻz" },
  { key: "oz", label: "Ўз" },
  { key: "ru", label: "Ру" },
];

/** below this width the nav collapses into the staggered menu — eight links
    need more room than the six this used to carry */
const MOBILE_QUERY = "(max-width: 1300px)";

export function Header() {
  const { t, lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = useMemo(
    () => [
      { id: "services", label: t.nav.services },
      /* "Buyurtma" points at the pickup flow — that's where an order is actually
         placed; the calculator section below is the price list itself. */
      { id: "pickup", label: t.nav.calc },
      { id: "tracking", label: t.nav.process },
      { id: "calc", label: t.nav.prices },
      { id: "business", label: t.nav.business },
      { id: "club", label: t.nav.club },
      { id: "concierge", label: t.nav.ai },
      { id: "knowledge", label: t.nav.knowledge },
    ],
    [t],
  );

  const spyIds = useMemo(() => links.map((l) => l.id), [links]);
  const activeId = useScrollSpy(spyIds);
  const onHome = pathname === "/";

  const menuItems = [
    { label: t.nav.home, link: "top" },
    ...links.map((l) => ({ label: l.label, link: l.id })),
  ];

  const initials = user
    ? user.name
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <header
      className={`header ${scrolled ? "header--scrolled" : ""} ${
        onHome && !scrolled ? "header--hero" : ""
      }`}
    >
      <div className="container header__inner">
        <Link to="/" className="header__brand" aria-label="TANZIF">
          <Logo size={34} className="header__mark" />
          <LogoWord size={19} className="header__name" />
        </Link>

        {!isMobile && (
          <nav className="header__nav">
            {links.map((l) => (
              <AnchorLink
                key={l.id}
                id={l.id}
                className={onHome && activeId === l.id ? "active" : undefined}
              >
                {l.label}
              </AnchorLink>
            ))}
          </nav>
        )}

        <div className="header__actions">
          <button
            className="header__theme"
            onClick={toggle}
            aria-label={t.nav.theme}
            title={t.nav.theme}
          >
            {theme === "dark" ? <IconSun size={17} /> : <IconMoon size={17} />}
          </button>
          <div className="header__langs" role="group" aria-label="Til / Язык">
            {LANGS.map((l) => (
              <button
                key={l.key}
                className={lang === l.key ? "is-active" : ""}
                onClick={() => setLang(l.key)}
              >
                {l.label}
              </button>
            ))}
          </div>
          {/* sits at the far right edge of the header */}
          {!user && !isMobile && (
            <Link to="/auth" className="header__login">
              <span className="header__login-full">{t.nav.login}</span>
              <span className="header__login-short">{t.nav.loginShort}</span>
            </Link>
          )}
          {user && (
            <Link
              to="/profile"
              className="header__profile"
              aria-label={t.nav.profile}
              title={t.nav.profile}
            >
              {initials}
            </Link>
          )}
          {isMobile && (
            <StaggeredMenu
              items={menuItems}
              socialItems={[
                { label: "Telegram", link: CONTACTS.telegram },
                { label: "Instagram", link: CONTACTS.instagram },
                { label: t.footer.phone, link: `tel:${CONTACTS.phone}` },
              ]}
              socialsTitle={t.footer.contact}
              menuLabel={t.nav.menu}
              closeLabel={t.nav.close}
              displayItemNumbering
              displaySocials
              colors={["#ecd6a4", "#d3ab5c"]}
              accentColor={theme === "dark" ? "#e6c67f" : "#9a7b33"}
              /* the panel uses the page background, so the label keeps the theme's ink colour */
              menuButtonColor={theme === "dark" ? "#f4ecdc" : "#0b2e33"}
              openMenuButtonColor={theme === "dark" ? "#f4ecdc" : "#0b2e33"}
            />
          )}
        </div>
      </div>
    </header>
  );
}
