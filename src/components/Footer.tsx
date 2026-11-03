import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { contactInfo, navigation, socials } from "../data/content";
import { SocialIcon } from "./Icons";
import { Brand } from "./Shared";

/* The dome: a shallow arch across the full width with a gently rippling rim. It is
   drawn at the footer's real pixel size, so the glow is never stretched. Only the
   top band is SVG; below it the dark core continues as a plain colour. */
const TOP = 80; // room above the arch for the halo
const BAND = 170; // depth drawn below the arch before the plain core takes over
const RIM_OFFSET = 16;
const CORE_OFFSET = 34;
const SAMPLES = 48;

const arcHeight = (width: number) => Math.min(110, Math.max(56, width * 0.075));

function domePath(width: number, arc: number, bottom: number, phase: number) {
  // The ellipse is a little wider than the screen, so the arch meets both edges partway down.
  const radius = width * 0.54;
  const amp = arc * 0.07;
  const points: [number, number][] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const x = -40 + ((width + 80) * i) / SAMPLES;
    const u = Math.min(Math.abs(x - width / 2) / radius, 1);
    const k = x / width;
    // Two ripples at different speeds, so the crests drift without looking mechanical.
    const wave = amp * (Math.sin(2 * Math.PI * 2.5 * k + phase) + 0.5 * Math.sin(2 * Math.PI * 4 * k - 2 * phase));
    points.push([x, TOP + arc * (1 - Math.sqrt(1 - u * u)) + wave]);
  }
  // Catmull-Rom through the samples, written as cubic Béziers so every frame has the same commands.
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(points[0][0])} ${bottom}L${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const [p1, p2] = [points[i], points[i + 1]];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}L${f(points[points.length - 1][0])} ${bottom}Z`;
}

function FooterDome({ animate }: { animate: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const arc = arcHeight(width);
  const height = Math.round(TOP + arc + BAND);
  const frames = useMemo(
    () => (width ? Array.from({ length: 9 }, (_, k) => domePath(width, arc, height + 80, (k * Math.PI) / 4)) : []),
    [width, arc, height],
  );
  const blur = (id: string, deviation: number) => (
    // sRGB: the default linearRGB keeps too few dark tones, which shows as hard steps in the core.
    <filter id={id} filterUnits="userSpaceOnUse" x={-200} y={-200} width={width + 400} height={height + 400} colorInterpolationFilters="sRGB">
      <feGaussianBlur stdDeviation={deviation} />
    </filter>
  );

  return (
    <div ref={ref} className="footer-dome" style={{ "--dome-band": `${height}px` } as CSSProperties} aria-hidden="true">
      {width > 0 && (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <path id="dome-shape" d={frames[0]}>
              {animate && <animate attributeName="d" dur="18s" repeatCount="indefinite" values={frames.join(";")} />}
            </path>
            {/* Coordinates are in the core layer's space (shifted down by CORE_OFFSET); it reaches the
                base colour before the band ends, so the plain body below meets it without a seam. */}
            <linearGradient id="dome-core" gradientUnits="userSpaceOnUse" x1="0" y1={TOP} x2="0" y2={height - CORE_OFFSET - 30}>
              <stop offset="0" style={{ stopColor: "var(--dome-core-b)" }} />
              <stop offset="1" style={{ stopColor: "var(--dome-core-a)" }} />
            </linearGradient>
            {blur("dome-blur-lg", 28)}
            {blur("dome-blur-md", 12)}
            {blur("dome-blur-sm", 5)}
          </defs>
          {/* Outside in: lavender halo, violet rim, then the deep core the text sits on. */}
          <use href="#dome-shape" className="dome-halo" filter="url(#dome-blur-lg)" />
          <use href="#dome-shape" className="dome-rim" filter="url(#dome-blur-md)" transform={`translate(0 ${RIM_OFFSET})`} />
          <use href="#dome-shape" fill="url(#dome-core)" filter="url(#dome-blur-sm)" transform={`translate(0 ${CORE_OFFSET})`} />
        </svg>
      )}
      <span className="dome-body" />
    </div>
  );
}

export default function Footer() {
  const hasSoonSocials = socials.some((social) => !social.url);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduced = useReducedMotion();

  return (
    <footer ref={ref} className="site-footer">
      {/* The wave runs only while the footer is on screen; the blur layers are costly to repaint. */}
      <FooterDome animate={inView && !reduced} />

      <div className="footer-inner">
        <div className="footer-head">
          <Brand />
          <p className="footer-tagline">خلاقیت، فراتر از تبلیغات</p>
        </div>

        <div className="footer-main">
          <address className="footer-contact">
            <h2 className="footer-title">راه‌های ارتباط</h2>
            <ul>
              <li>
                <MapPin aria-hidden="true" />
                <a href={contactInfo.mapUrl} target="_blank" rel="noopener noreferrer">
                  {contactInfo.address}
                </a>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <a href={contactInfo.phone.href} dir="ltr">
                  {contactInfo.phone.label}
                </a>
              </li>
              <li>
                <Mail aria-hidden="true" />
                <a href={`mailto:${contactInfo.email}`} lang="en" dir="ltr">
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <Clock aria-hidden="true" />
                <span>{contactInfo.hours}</span>
              </li>
            </ul>
          </address>

          <nav className="footer-nav" aria-label="پیوندهای پانویس">
            <h2 className="footer-title">دسترسی سریع</h2>
            {navigation.map((item) =>
              item.href ? (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span key={item.label} className="is-soon">
                  {item.label} <small>(به‌زودی)</small>
                </span>
              ),
            )}
          </nav>

          <div className="footer-social">
            <h2 className="footer-title">ما را دنبال کنید</h2>
            <div className="socials">
              {socials.map((social) =>
                social.url ? (
                  <a
                    key={social.label}
                    href={social.url}
                    className="social"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <SocialIcon name={social.icon} />
                  </a>
                ) : (
                  // TODO: placeholder until the agency's profile URL is added in content.ts.
                  <span key={social.label} className="social is-soon" role="img" aria-label={`${social.label}، به‌زودی`}>
                    <SocialIcon name={social.icon} />
                  </span>
                ),
              )}
              {hasSoonSocials && <small className="socials-note">صفحه‌های اجتماعی به‌زودی</small>}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© ۱۴۰۵ تمامی حقوق محفوظ است. | طراحی توسط تیم خلاقیت</p>
          <p className="credits">
            عکس مجسمه آپولو:{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Head_Apollo_BM_Sc1547.jpg" target="_blank" rel="noopener noreferrer">
              <span lang="en">Marie-Lan Nguyen</span>، ویکی‌مدیا کامنز
            </a>
            ،{" "}
            <a href="https://creativecommons.org/licenses/by/2.5/" target="_blank" rel="noopener noreferrer" lang="en">
              CC BY 2.5
            </a>{" "}
            (پس‌زمینه حذف شده)
          </p>
        </div>
      </div>
    </footer>
  );
}
