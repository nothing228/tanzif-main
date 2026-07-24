import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { LangProvider } from "./i18n/LangContext";
import { ThemeProvider } from "./hooks/ThemeContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MobileCta } from "./components/MobileCta";
import { AiWidget } from "./components/AiWidget";
import { AuthPage } from "./pages/AuthPage";
import { ProfilePage } from "./pages/ProfilePage";
import { HomePage } from "./pages/pages";
import { LegalPage } from "./pages/LegalPage";

function ScrollToTop() {
  const { pathname, state } = useLocation();
  useEffect(() => {
    // a section was requested (e.g. from the profile page) — HomePage scrolls to it
    if ((state as { scrollTo?: string } | null)?.scrollTo) return;
    window.scrollTo(0, 0);
  }, [pathname, state]);
  return null;
}

/** Profile is the only route behind the login wall. */
function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return <Outlet />;
}

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MobileCta />
      <AiWidget />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <ThemeProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route element={<RequireAuth />}>
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
                <Route path="/offer" element={<LegalPage />} />
                <Route path="/privacy" element={<LegalPage />} />
                <Route path="/terms" element={<LegalPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </LangProvider>
    </AuthProvider>
  );
}
