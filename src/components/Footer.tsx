import { useLang } from "../i18n/LangContext";
import { CareDry, CareDryClean, CareHand, CareIron, CareWash } from "./icons";
import { Logo, LogoWord } from "./Logo";
import "./Footer.scss";

export function Footer() {
  const { t } = useLang();

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
            <a href="tel:+998935705150" className="mono">
              {t.footer.phone}
            </a>
            <a href="tel:+998935705992" className="mono">
              {t.footer.phone2}
            </a>
            <a
              href="https://t.me/tanzif_uz"
              target="_blank"
              rel="noreferrer"
              className="mono"
            >
              {t.footer.telegram}
            </a>
          </div>

          <div className="footer__col">
            <h4>{t.footer.addressLabel}</h4>
            <p>{t.footer.address}</p>
          </div>

          <div className="footer__col">
            <h4>{t.footer.hoursLabel}</h4>
            <p>{t.footer.hours}</p>
            <p className="footer__agbis mono">{t.footer.integration}</p>
          </div>
        </div>

        <div className="footer__bottom">
          <span>{t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
