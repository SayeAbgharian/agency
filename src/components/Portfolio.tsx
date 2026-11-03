import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

import { faNumber, projects } from "../data/content";
import { ChevronIcon } from "./Icons";
import { Image, NeonFrame, SectionTitle, ease } from "./Shared";

/** Touch screens have no hover to open a panel, and stacked slices are too thin on a phone. */
const TOUCH_LAYOUT = "(hover: none), (max-width: 760px)";

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
const label = (i: number, category: string) =>
  `${category}، نمونه‌کار ${faNumber(i + 1)} از ${faNumber(projects.length)}`;

export default function Portfolio() {
  const touch = useMedia(TOUCH_LAYOUT);

  return (
    <section id="portfolio" className="section portfolio" aria-labelledby="portfolio-title">
      <div className="container">
        <SectionTitle
          id="portfolio-title"
          title="نمونه‌کارهای ما"
          subtitle="نگاهی به بخشی از پروژه‌های موفق ما"
        />

        {touch ? <ProjectCarousel /> : <ProjectPanels />}
      </div>
    </section>
  );
}

/**
 * Mouse layout. Expanding panels: one project is open at a time and the rest wait as narrow slices.
 * Each panel links to its project page. Hover or keyboard focus opens a panel, and a click
 * on the open one follows the link.
 */
function ProjectPanels() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <ul className="panels">
      {projects.map((project, i) => {
        const open = i === active;
        return (
          <motion.li
            key={project.id}
            className={`panel ${open ? "is-open" : ""}`}
            initial={reduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.06, ease }}
            // Only a moving mouse opens a panel: when panels resize, a neighbour slides under a
            // resting cursor, and treating that as a hover would make them flip back and forth.
            onPointerMove={(event) => {
              if (!open && event.pointerType === "mouse" && (event.movementX || event.movementY)) setActive(i);
            }}
          >
            <Link
              to={`/projects/${project.id}`}
              className="panel-button"
              aria-label={label(i, project.category)}
              // Keyboard focus only: a click also focuses the link just before it fires, and opening
              // here would make that click navigate instead of opening the panel first.
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible")) setActive(i);
              }}
              onClick={(event) => {
                // detail is 0 for keyboard and screen-reader activation: those always follow the link.
                if (open || event.detail === 0) return;
                event.preventDefault();
                setActive(i);
              }}
            >
              <span className="duo panel-photo">
                <Image media={project.image} sizes="640px" />
              </span>
              <span className="panel-index" lang="en" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span className="panel-caption" aria-hidden="true">
                <span className="panel-text">
                  <span className="panel-category">{project.category}</span>
                  <span className="panel-link">
                    مشاهده پروژه
                    <ChevronIcon direction="left" />
                  </span>
                </span>
                <span className="temp-label">تصویر موقت</span>
              </span>
            </Link>
            <NeonFrame radius={24} className="is-active" />
          </motion.li>
        );
      })}
    </ul>
  );
}

/**
 * Touch layout. A swipeable row of cards where the scroll position does what hover does on
 * desktop: the card that reaches the centre comes into full colour and full size, its neighbours
 * turn slightly away in the duotone, and each photo drifts against the swipe like a window.
 * Every card shows its caption and opens its project in one tap.
 */
function ProjectCarousel() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;

    // Writes each card's signed distance from the centre (--d, in card widths, -1 to 1) and its
    // size (--p, 0 at the centre); CSS turns those into scale, tilt, colour and photo drift.
    const measure = () => {
      frame = 0;
      const box = track.getBoundingClientRect();
      const centre = box.left + box.width / 2;
      let closest = 0;
      let nearest = Infinity;
      [...track.children].forEach((slide, i) => {
        const rect = slide.getBoundingClientRect();
        const distance = (rect.left + rect.width / 2 - centre) / rect.width;
        const d = Math.max(-1, Math.min(1, distance));
        (slide as HTMLElement).style.setProperty("--d", d.toFixed(3));
        (slide as HTMLElement).style.setProperty("--p", Math.abs(d).toFixed(3));
        if (Math.abs(distance) < nearest) {
          nearest = Math.abs(distance);
          closest = i;
        }
      });
      setActive(closest);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const go = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index];
    if (!track || !slide) return;
    const box = track.getBoundingClientRect();
    const rect = slide.getBoundingClientRect();
    track.scrollBy({
      left: rect.left + rect.width / 2 - (box.left + box.width / 2),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const last = projects.length - 1;

  return (
    <div className={`pf-carousel ${reduced ? "is-still" : ""}`}>
      {/* The row enters as one, so cards that only peek in at the edges are never left invisible. */}
      <motion.ul
        ref={trackRef}
        className="pf-track"
        initial={reduced ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {projects.map((project, i) => (
          <motion.li
            key={project.id}
            className={`pf-slide ${i === active ? "is-active" : ""}`}
            variants={{
              hidden: { opacity: 0, x: -40 },
              show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
            }}
          >
            <div className="pf-lift">
              <Link to={`/projects/${project.id}`} className="pf-card" aria-label={label(i, project.category)}>
                <span className="duo pf-photo">
                  <Image media={project.image} sizes="(max-width: 760px) 80vw, 440px" />
                </span>
                <span className="panel-index" lang="en" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <span className="pf-caption" aria-hidden="true">
                  <span className="panel-text">
                    <span className="panel-category">{project.category}</span>
                    <span className="panel-link">
                      مشاهده پروژه
                      <ChevronIcon direction="left" />
                    </span>
                  </span>
                  <span className="temp-label">تصویر موقت</span>
                </span>
              </Link>
              <NeonFrame radius={24} className="is-active" />
            </div>
          </motion.li>
        ))}
      </motion.ul>

      <div className="pf-controls">
        <button
          type="button"
          className="icon-button"
          aria-label="نمونه‌کار قبلی"
          disabled={active === 0}
          onClick={() => go(active - 1)}
        >
          <ChevronIcon direction="right" />
        </button>

        <div className="pf-progress" lang="en" aria-hidden="true">
          <span className="pf-count">{pad(active + 1)}</span>
          <span className="pf-bar">
            <span className="pf-bar-fill" style={{ transform: `scaleX(${(active + 1) / projects.length})` }} />
          </span>
          <span className="pf-count is-total">{pad(projects.length)}</span>
        </div>

        <button
          type="button"
          className="icon-button"
          aria-label="نمونه‌کار بعدی"
          disabled={active === last}
          onClick={() => go(active + 1)}
        >
          <ChevronIcon direction="left" />
        </button>
      </div>
    </div>
  );
}
