import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth, formatUzPhone, isValidUzPhone } from "../auth/AuthContext";
import { useLang } from "../i18n/LangContext";
import { useTheme } from "../hooks/ThemeContext";
import type { LocaleKey } from "../i18n/translations";
import { CareDry, CareHand, CareIron, CareWash, IconEye, IconEyeOff, IconMoon, IconSun } from "./../components/icons";
import { LogoLockup } from "../components/Logo";
import "./AuthPage.scss";

const LANGS: { key: LocaleKey; label: string }[] = [
  { key: "uz", label: "Oʻz" },
  { key: "oz", label: "Ўз" },
  { key: "ru", label: "Ру" },
];

type Mode = "login" | "register";

/** Password input with a show/hide eye toggle. */
function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  showLabel,
  hideLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete: string;
  showLabel: string;
  hideLabel: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="auth__field">
      <span>{label}</span>
      <div className="auth__pass">
        <input
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          minLength={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="auth__pass-toggle"
          aria-label={show ? hideLabel : showLabel}
          title={show ? hideLabel : showLabel}
          aria-pressed={show}
          onClick={() => setShow(!show)}
        >
          {show ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </button>
      </div>
    </label>
  );
}

/** Text field for the 9 digits of an Uzbek number, +998 prefix fixed. */
function PhoneField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (digits: string) => void;
  label: string;
}) {
  return (
    <label className="auth__field">
      <span>{label}</span>
      <div className="auth__phone">
        <span className="auth__phone-prefix mono">+998</span>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          className="mono"
          placeholder="93 570 51 50"
          value={formatUzPhone(value).slice(5)}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
            onChange(digits);
          }}
        />
      </div>
    </label>
  );
}

export function AuthPage() {
  const { user, login, register } = useAuth();
  const { t, lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";
    return <Navigate to={from} replace />;
  }

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && name.trim().length < 2) {
      setError(t.auth.errName);
      return;
    }
    if (!isValidUzPhone(phone)) {
      setError(t.auth.errPhone);
      return;
    }
    if (pass.length < 8) {
      setError(t.auth.errPass);
      return;
    }
    if (mode === "register" && pass !== pass2) {
      setError(t.auth.errPass2);
      return;
    }

    setBusy(true);
    try {
      if (mode === "register") {
        const res = await register(name.trim(), phone, pass);
        if (!res.ok) {
          setError(t.auth.errPhoneTaken);
          return;
        }
      } else {
        const ok = await login(phone, pass);
        if (!ok) {
          setError(t.auth.errLogin);
          return;
        }
      }
      navigate("/", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      {/* brand panel */}
      <aside className="auth__brand">
        <div className="auth__brand-top">
          <LogoLockup size={190} />
        </div>
        <div>
          <h1>{t.auth.brandTitle}</h1>
          <p>{t.auth.brandSub}</p>
        </div>
        <div className="auth__care" aria-hidden>
          <CareWash size={18} />
          <CareHand size={18} />
          <CareIron size={18} />
          <CareDry size={18} />
        </div>
      </aside>

      {/* form panel */}
      <main className="auth__panel">
        <div className="auth__controls">
          <div className="auth__langs" role="group" aria-label="Til / Язык">
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
          <button className="auth__theme" onClick={toggle} aria-label={t.nav.theme}>
            {theme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
          </button>
        </div>

        <form className="auth__card" onSubmit={onSubmit}>
          <div className="auth__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "is-active" : ""}
              onClick={() => switchMode("login")}
            >
              {t.auth.loginTab}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={mode === "register" ? "is-active" : ""}
              onClick={() => switchMode("register")}
            >
              {t.auth.registerTab}
            </button>
          </div>

          {mode === "register" && (
            <label className="auth__field">
              <span>{t.auth.name}</span>
              <input
                type="text"
                autoComplete="name"
                placeholder={t.auth.namePh}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}

          <PhoneField value={phone} onChange={setPhone} label={t.auth.phone} />

          <PasswordField
            label={t.auth.password}
            value={pass}
            onChange={setPass}
            placeholder={t.auth.passwordPh}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            showLabel={t.auth.showPass}
            hideLabel={t.auth.hidePass}
          />

          {mode === "register" && (
            <PasswordField
              label={t.auth.password2}
              value={pass2}
              onChange={setPass2}
              autoComplete="new-password"
              showLabel={t.auth.showPass}
              hideLabel={t.auth.hidePass}
            />
          )}

          {error && (
            <p className="auth__error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary auth__submit" disabled={busy}>
            {mode === "login" ? t.auth.submitLogin : t.auth.submitRegister}
          </button>

          <button
            type="button"
            className="auth__switch"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? t.auth.switchToRegister : t.auth.switchToLogin}
          </button>

          <p className="auth__note">{t.auth.uzOnly}</p>
          <p className="auth__note auth__note--demo mono">{t.auth.demoNote}</p>
        </form>
      </main>
    </div>
  );
}
