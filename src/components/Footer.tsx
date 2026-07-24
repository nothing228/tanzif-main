import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CONTACTS } from "../data/contacts";
import { useLang } from "../i18n/LangContext";
import { AnchorLink } from "./AnchorLink";
import {
  CareDry,
  CareDryClean,
  CareHand,
  CareIron,
  CareWash,
  IconArrowUp,
  IconInstagram,
  IconMail,
  IconPin,
  IconTelegram,
} from "./icons";
import { Logo, LogoWord } from "./Logo";
import "./Footer.scss";

export function Footer() {
  const { t } = useLang();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { id: "services", label: t.nav.services },
    { id: "calc", label: t.nav.prices },
    { id: "pickup", label: t.nav.calc },
    { id: "gallery", label: t.nav.gallery },
    { id: "club", label: t.nav.club },
    { id: "business", label: t.nav.business },
    { id: "knowledge", label: t.nav.knowledge },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <Logo size={40} />
              <LogoWord size={22} />
            </div>
            <p>{t.footer.tagline}</p>
            <div className="footer__care" aria-hidden>
              <CareWash size={18} />
              <CareHand size={18} />
              <CareIron size={18} />
              <CareDry size={18} />
              <CareDryClean size={18} />
            </div>
          </div>

          <div className="footer__col">
            <h4>{t.footer.contact}</h4>
            <a href={`tel:${CONTACTS.phone}`} className="mono">
              {t.footer.phone}
            </a>
            <a href={`tel:${CONTACTS.phone2}`} className="mono">
              {t.footer.phone2}
            </a>
            <a href={`mailto:${CONTACTS.email}`} className="footer__social">
              <IconMail size={17} />
              {t.footer.email}
            </a>
            <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" className="footer__social">
              <IconTelegram size={17} />
              {t.footer.telegram}
              <span className="footer__role">· {t.footer.tgChannel}</span>
            </a>
            <a href={CONTACTS.telegramAdmin} target="_blank" rel="noreferrer" className="footer__social">
              <IconTelegram size={17} />
              {t.footer.telegramAdmin}
              <span className="footer__role">· {t.footer.tgSupport}</span>
            </a>
            <a href={CONTACTS.instagram} target="_blank" rel="noreferrer" className="footer__social">
              <IconInstagram size={17} />
              {t.footer.instagram}
            </a>
          </div>

          <div className="footer__col">
            <h4>{t.footer.addressLabel}</h4>
            <a href={CONTACTS.maps} target="_blank" rel="noreferrer" className="footer__social">
              <IconPin size={16} />
              {t.footer.address}
            </a>
            <span className="footer__map-hint">{t.footer.mapLink} →</span>
            <h4 className="footer__col-gap">{t.footer.hoursLabel}</h4>
            <p>{t.footer.hours}</p>
          </div>

          <div className="footer__col">
            <h4>{t.footer.navTitle}</h4>
            {navLinks.map((l) => (
              <AnchorLink key={l.id} id={l.id}>
                {l.label}
              </AnchorLink>
            ))}
          </div>

          <div className="footer__col">
            <h4>{t.footer.legalTitle}</h4>
            <Link to="/offer">{t.footer.offer}</Link>
            <Link to="/privacy">{t.footer.privacy}</Link>
            <Link to="/terms">{t.footer.terms}</Link>
          </div>
        </div>

        <div className="footer__bottom">
          <span>{t.footer.rights}</span>
        </div>
      </div>

      <button
        className={`footer__totop ${showTop ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={t.footer.toTop}
        title={t.footer.toTop}
      >
        <IconArrowUp size={20} />
      </button>
    </footer>
  );
}
