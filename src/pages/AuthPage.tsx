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

type Mode = "login" | "register" | "reset";

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
  const { user, login, register, resetPassword } = useAuth();
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
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";
    return <Navigate to={from} replace />;
  }

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setNotice("");
    /* passwords never carry across modes — the phone does, it saves retyping */
    setPass("");
    setPass2("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");

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
    if (mode !== "login" && pass !== pass2) {
      setError(t.auth.errPass2);
      return;
    }

    setBusy(true);
    try {
      if (mode === "reset") {
        const ok = await resetPassword(phone, pass);
        if (!ok) {
          setError(t.auth.errNoAccount);
          return;
        }
        /* back to the login form with the number kept and a confirmation */
        setMode("login");
        setPass("");
        setPass2("");
        setNotice(t.auth.resetDone);
        return;
      }
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

  const submitLabel =
    mode === "login" ? t.auth.submitLogin : mode === "register" ? t.auth.submitRegister : t.auth.submitReset;

  return (
    <div className="auth">
      {/* brand panel */}
      <aside className="auth__brand">
        <div className="auth__brand-top">
          <LogoLockup size={140} />
        </div>
        <div>
          <h1>{t.auth.brandTitle}</h1>
          <p>{t.auth.brandSub}</p>
        </div>
        <div className="auth__care" aria-hidden>
          <CareWash size={30} />
          <CareHand size={30} />
          <CareIron size={30} />
          <CareDry size={30} />
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
          {mode === "reset" ? (
            <header className="auth__reset-head">
              <h2>{t.auth.resetTitle}</h2>
              <p>{t.auth.resetLead}</p>
            </header>
          ) : (
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
          )}

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
            label={mode === "reset" ? t.auth.newPassword : t.auth.password}
            value={pass}
            onChange={setPass}
            placeholder={t.auth.passwordPh}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            showLabel={t.auth.showPass}
            hideLabel={t.auth.hidePass}
          />

          {mode !== "login" && (
            <PasswordField
              label={mode === "reset" ? t.auth.newPassword2 : t.auth.password2}
              value={pass2}
              onChange={setPass2}
              autoComplete="new-password"
              showLabel={t.auth.showPass}
              hideLabel={t.auth.hidePass}
            />
          )}

          {mode === "login" && (
            <button type="button" className="auth__forgot" onClick={() => switchMode("reset")}>
              {t.auth.forgot}
            </button>
          )}

          {error && (
            <p className="auth__error" role="alert">
              {error}
            </p>
          )}

          {notice && (
            <p className="auth__notice" role="status">
              {notice}
            </p>
          )}

          <button type="submit" className="btn btn--primary auth__submit" disabled={busy}>
            {submitLabel}
          </button>

          <button
            type="button"
            className="auth__switch"
            onClick={() => switchMode(mode === "register" ? "login" : mode === "reset" ? "login" : "register")}
          >
            {mode === "login" ? t.auth.switchToRegister : mode === "register" ? t.auth.switchToLogin : t.auth.backToLogin}
          </button>

          <p className="auth__note">{mode === "reset" ? t.auth.resetDemoNote : t.auth.uzOnly}</p>
          <p className="auth__note auth__note--demo mono">{t.auth.demoNote}</p>
        </form>
      </main>
    </div>
  );
}
