import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
// import Acronym from "./components/Acronym";
import Introduction from "./components/Introduction";
// import Statistics from "./components/Statistics";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Testimonials from "./components/Testimonials";
import { Contact, ConsultationDialog } from "./components/Contact";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";

function RouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    document.title =
      pathname === "/auth"
        ? "ورود و ثبت‌نام | Criito"
        : "Criito | خلاقیت، فراتر از تبلیغات";
  }, [pathname]);

  return null;
}

function HomePage() {
  const [consultOpen, setConsultOpen] = useState(false);

  const openConsult = () => setConsultOpen(true);

  return (
    <>
      <a href="#main" className="skip-link">
        رفتن به محتوای اصلی
      </a>

      <Header />

      <main id="main">
        <Hero onConsult={openConsult} />
        {/* <Acronym /> */}
        <Introduction />
        {/* <Statistics /> */}
        <Services />
        <Portfolio onConsult={openConsult} />
        <Testimonials />
        <Contact onConsult={openConsult} />
      </main>

      <Footer />

      {consultOpen && (
        <ConsultationDialog onClose={() => setConsultOpen(false)} />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteEffects />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
