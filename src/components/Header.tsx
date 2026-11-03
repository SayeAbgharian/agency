import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

import { navigation } from "../data/content";
import { useTheme } from "../theme";
import { Brand, NeonFrame, ease } from "./Shared";
import { CloseIcon, MenuIcon, UserIcon } from "./Icons";

const sectionIds = navigation.filter((item) => item.href).map((item) => item.href.slice(1));

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "تغییر به تم روشن" : "تغییر به تم تیره";
  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      data-dark={isDark}
      aria-label={label}
      title={label}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        const box = event.currentTarget.getBoundingClientRect();
        toggle({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
      }}
    >
      {/* Moon in the dark theme, sun in the light theme; the shapes morph between them. */}
      <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
        <mask id="theme-moon-mask">
          <rect width="24" height="24" fill="#fff" />
          <circle className="theme-bite" cx="17.5" cy="7" r="6" fill="#000" />
        </mask>
        <circle className="theme-core" cx="12" cy="12" r="7.5" fill="currentColor" mask="url(#theme-moon-mask)" />
        <g className="theme-rays" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7" />
        </g>
      </svg>
    </button>
  );
}

export default function Header({ onConsult }: { onConsult: () => void }) {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const reduced = useReducedMotion();

  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav item of the section crossing the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const onResize = () => {
      if (window.innerWidth > 1040) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const navItems = (mobile: boolean) =>
    navigation.map((item) =>
      item.href ? (
        <a
          key={item.label}
          href={item.href}
          className={`nav-link ${active === item.href.slice(1) ? "is-active" : ""}`}
          aria-current={active === item.href.slice(1) ? "true" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          {item.label}
          {!mobile && active === item.href.slice(1) && (
            <motion.span
              className="nav-indicator"
              layoutId="nav-indicator"
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
        </a>
      ) : (
        <span key={item.label} className="nav-link is-soon">
          {item.label}
          <small>به‌زودی</small>
        </span>
      ),
    );

  return (
    <motion.header
      ref={headerRef}
      className={`site-header ${compact ? "is-compact" : ""} ${menuOpen ? "menu-open" : ""}`}
      initial={reduced ? false : { y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease, delay: 0.1 }}
    >
      <div className="header-bar">
        <NeonFrame radius={24} />
        <Brand />

        <nav className="nav-pill" aria-label="ناوبری اصلی">
          {navItems(false)}
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <Link to="/auth" className="icon-button" aria-label="ورود / ثبت‌نام" title="ورود / ثبت‌نام">
            <UserIcon />
          </Link>
          <button type="button" className="button button-outline header-cta" onClick={onConsult}>
            درخواست مشاوره رایگان
          </button>
          <button
            ref={toggleRef}
            type="button"
            className="icon-button menu-toggle"
            aria-label={menuOpen ? "بستن فهرست" : "باز کردن فهرست"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="ناوبری موبایل"
        inert={!menuOpen}
      >
        {navItems(true)}
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            setMenuOpen(false);
            onConsult();
          }}
        >
          درخواست مشاوره رایگان
        </button>
      </nav>

      <motion.span className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
    </motion.header>
  );
}
