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
import Services from "./components/Services";
// Enable once the figures in data/content.ts `metrics` are real and sourced.
// import Statistics from "./components/Statistics";
import Portfolio from "./components/Portfolio";
import { Contact, ConsultationDialog } from "./components/Contact";
import Footer from "./components/Footer";
import { IconDefs } from "./components/Icons";
import { Ambient, CursorLight } from "./components/Ambient";
import Clients from "./components/Clients";
import AuthPage from "./pages/AuthPage";
import ServicePage from "./pages/ServicePage";
import ProjectPage from "./pages/ProjectPage";
import { projects, services } from "./data/content";

function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Links such as "/#services" from a service page land on that section, not the top.
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);

    const page =
      services.find((item) => pathname === `/services/${item.id}`)?.title ??
      projects.find((item) => pathname === `/projects/${item.id}`)?.category;
    document.title = page
      ? `${page} | Criito`
      : pathname === "/auth"
        ? "ورود و ثبت‌نام | Criito"
        : "Criito | خلاقیت، فراتر از تبلیغات";
  }, [pathname, hash]);

  return null;
}

function HomePage() {
  const [consult, setConsult] = useState<{ serviceId?: string } | null>(null);

  const openConsult = (serviceId?: string) => setConsult({ serviceId });

  return (
    <>
      <a href="#main" className="skip-link">
        رفتن به محتوای اصلی
      </a>
      <IconDefs />
      <Ambient />
      <CursorLight />

      <Header onConsult={() => openConsult()} />

      <main id="main">
        <Hero onConsult={() => openConsult()} />
        {/* <Acronym /> */}
        <Introduction />
        <Clients />
        <Services />
        {/* <Statistics /> */}
        <Portfolio />
        <Contact onConsult={() => openConsult()} />
      </main>

      <Footer />

      {consult && (
        <ConsultationDialog
          serviceId={consult.serviceId}
          onClose={() => setConsult(null)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <RouteEffects />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/services/:id" element={<ServicePage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
