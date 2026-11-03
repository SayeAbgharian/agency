import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import type { Media } from "../data/content";
import { Ambient } from "../components/Ambient";
import { ConsultationDialog } from "../components/Contact";
import { ChevronIcon } from "../components/Icons";
import { Image, ease } from "../components/Shared";

/** Shared layout of the service and project pages: photo, title, text, a consult button and links onward. */
export default function DetailPage({
  back,
  media,
  title,
  children,
  consultLabel,
  consultServiceId,
  related,
  othersTitle,
  others,
}: {
  back: { to: string; label: string };
  media: Media;
  title: ReactNode;
  children: ReactNode;
  consultLabel: string;
  consultServiceId?: string;
  related?: ReactNode;
  othersTitle: string;
  others: { to: string; label: string }[];
}) {
  const reduced = useReducedMotion();
  const [consult, setConsult] = useState(false);

  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <main className="detail-page container">
      <Ambient />
      <Link to={back.to} className="detail-page-back">
        <ChevronIcon direction="right" />
        {back.label}
      </Link>

      <article className="detail-page-grid">
        <motion.div className="detail-page-media" {...rise(0)}>
          <Image media={media} eager sizes="(max-width: 860px) 100vw, 560px" />
          <span className="temp-label detail-temp">تصویر موقت</span>
        </motion.div>

        <div className="detail-page-text">
          <motion.h1 {...rise(0.08)}>{title}</motion.h1>
          <motion.div {...rise(0.16)}>{children}</motion.div>
          <motion.div className="detail-page-actions" {...rise(0.24)}>
            <button type="button" className="button button-primary" onClick={() => setConsult(true)}>
              {consultLabel}
            </button>
            {related}
          </motion.div>
        </div>
      </article>

      <nav className="detail-page-others" aria-label={othersTitle}>
        <h2>{othersTitle}</h2>
        <ul>
          {others.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {consult && <ConsultationDialog serviceId={consultServiceId} onClose={() => setConsult(false)} />}
    </main>
  );
}
