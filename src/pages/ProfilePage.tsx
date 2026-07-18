import { useNavigate } from "react-router-dom";
import { useAuth, formatUzPhone } from "../auth/AuthContext";
import { useLang } from "../i18n/LangContext";
import { useTheme } from "../hooks/ThemeContext";
import type { LocaleKey } from "../i18n/translations";
import { IconBell, IconMoon, IconSun, Sparkle } from "../components/icons";
import { Logo } from "../components/Logo";
import "./ProfilePage.scss";

const LANGS: { key: LocaleKey; label: string }[] = [
  { key: "uz", label: "Oʻzbekcha" },
  { key: "oz", label: "Ўзбекча" },
  { key: "ru", label: "Русский" },
];

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  if (!user) return null; // guarded by RequireAuth

  const sinceDate = new Date(user.createdAt).toLocaleDateString(
    lang === "ru" ? "ru-RU" : "uz-UZ",
  );
  const initials = user.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const onLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <section className="section profile-section">
      <div className="container">
        <div className="section-head">
          <h2>{t.profile.title}</h2>
        </div>

        <div className="profile">
          {/* membership card */}
          <article className="profile__card">
            <header>
              <Logo size={30} mono className="profile__card-logo" />
              <span className="profile__tier mono">
                <Sparkle size={12} /> {t.profile.tierV}
              </span>
            </header>
            <div className="profile__identity">
              <span className="profile__avatar">{initials}</span>
              <div>
                <strong>{user.name}</strong>
                <span className="mono">{formatUzPhone(user.phone)}</span>
              </div>
            </div>
            <footer>
              <span>{t.profile.member}</span>
              <span className="mono">
                {t.profile.since}: {sinceDate}
              </span>
            </footer>
          </article>

          <div className="profile__col">
            {/* stats */}
            <div className="profile__stats">
              <div className="profile__stat">
                <span className="profile__stat-value mono">120</span>
                <span className="profile__stat-label">{t.profile.points}</span>
              </div>
              <div className="profile__stat">
                <span className="profile__stat-value mono">{t.profile.tierV}</span>
                <span className="profile__stat-label">{t.profile.tier}</span>
              </div>
            </div>

            {/* last order */}
            <div className="profile__order">
              <h3>{t.profile.orders}</h3>
              <div className="profile__order-row">
                <span className="profile__order-icon">
                  <IconBell size={16} />
                </span>
                <div>
                  <strong>{t.profile.orderItem}</strong>
                  <span className="mono">№ A-350214</span>
                </div>
                <span className="profile__order-status">{t.profile.orderStatus}</span>
              </div>
            </div>

            {/* settings */}
            <div className="profile__settings">
              <h3>{t.profile.settings}</h3>
              <div className="profile__setting">
                <span>{t.profile.lang}</span>
                <div className="profile__langs" role="group">
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
              </div>
              <div className="profile__setting">
                <span>{t.profile.theme}</span>
                <button className="profile__theme" onClick={toggle} aria-label={t.nav.theme}>
                  {theme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
                </button>
              </div>
            </div>

            <button className="btn btn--ghost profile__logout" onClick={onLogout}>
              {t.profile.logout}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
