import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useLang } from "../i18n/LangContext";
import { Logo } from "./Logo";
import "./AuthGate.scss";

/**
 * Login-wall for actions (ordering, AI concierge).
 * const { guard, gate } = useAuthGate();
 * guard(() => doAction()) — runs the action if logged in, otherwise opens the modal.
 * Render {gate} once in the component.
 */
export function useAuthGate() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const guard = useCallback(
    (action: () => void) => {
      if (user) {
        action();
      } else {
        setOpen(true);
      }
    },
    [user],
  );

  const gate = <AuthGateModal open={open} onClose={() => setOpen(false)} />;

  return { guard, gate };
}

function AuthGateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="gate" role="dialog" aria-modal="true" aria-label={t.gate.title} onClick={onClose}>
      <div className="gate__card" onClick={(e) => e.stopPropagation()}>
        <Logo size={40} className="gate__logo" />
        <h3>{t.gate.title}</h3>
        <p>{t.gate.body}</p>
        <button className="btn btn--primary" onClick={() => navigate("/auth")}>
          {t.gate.login}
        </button>
        <button className="gate__cancel" onClick={onClose}>
          {t.gate.cancel}
        </button>
      </div>
    </div>
  );
}
