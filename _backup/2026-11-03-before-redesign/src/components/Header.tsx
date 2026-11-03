import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { navigation } from "../data/content";
import { Arrow, Brand } from "./Shared";

export default function Header() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setCompact(window.scrollY > 60);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    const handleClickOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 1100) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={`site-header ${compact ? "is-compact" : ""} ${
        menuOpen ? "menu-open" : ""
      }`}
    >
      <div className="header-content">
        <Brand />

        <nav className="desktop-nav" aria-label="ناوبری اصلی">
          {navigation.map((item) => (
            <span key={item.label} className="nav-item">
              {item.label}
            </span>
          ))}
        </nav>

        <Link to="/auth" className="button button-small header-cta">
          ورود / ثبت‌نام
          <Arrow />
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="icon-button mobile-toggle"
          aria-label={menuOpen ? "بستن فهرست" : "باز کردن فهرست"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="ناوبری موبایل"
        inert={!menuOpen}
      >
        {navigation.map((item) => (
          <span key={item.label} className="nav-item">
            {item.label}
          </span>
        ))}

        <Link to="/auth" className="button" onClick={() => setMenuOpen(false)}>
          ورود / ثبت‌نام
          <Arrow />
        </Link>
      </nav>
    </header>
  );
}
