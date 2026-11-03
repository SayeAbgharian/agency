import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionStyle } from "framer-motion";

import { images, services } from "../data/content";
import { ArrowIcon } from "./Icons";
import { Dialog, Magnetic, NeonFrame, WordReveal, ease } from "./Shared";

function OrbRings({ half }: { half: "back" | "front" }) {
  return (
    <svg className={`orb-rings orb-rings-${half}`} viewBox="0 0 320 320" aria-hidden="true">
      <defs>
        <linearGradient id={`orb-grad-${half}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="320" y2="0">
          <stop offset="0" style={{ stopColor: "var(--ring-a)", stopOpacity: 0.1 }} />
          <stop offset="0.5" style={{ stopColor: "var(--ring-b)", stopOpacity: 1 }} />
          <stop offset="1" style={{ stopColor: "var(--ring-c)", stopOpacity: 0.3 }} />
        </linearGradient>
        <clipPath id={`orb-clip-${half}`} clipPathUnits="userSpaceOnUse">
          {half === "back" ? <rect x="-20" y="0" width="360" height="160" /> : <rect x="-20" y="160" width="360" height="160" />}
        </clipPath>
      </defs>
      <g clipPath={`url(#orb-clip-${half})`}>
        <ellipse cx="160" cy="160" rx="150" ry="38" fill="none" stroke={`url(#orb-grad-${half})`} strokeWidth="2.4" />
        <ellipse cx="160" cy="160" rx="124" ry="28" fill="none" stroke={`url(#orb-grad-${half})`} strokeWidth="1.4" opacity="0.7" />
      </g>
    </svg>
  );
}

export function Contact({ onConsult }: { onConsult: () => void }) {
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  // The orb's rings turn with the scroll, so they move only while the reader does.
  const tilt = useTransform(scrollYProgress, [0, 1], [-34, 14]);
  const orbY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  // The banner's colour field slides from indigo toward orchid as it crosses the screen.
  const shift = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="contact" className="cta-section" aria-labelledby="contact-title">
      <div className="container">
        <motion.div
          ref={cardRef}
          className="cta-card"
          style={reduced ? undefined : ({ "--shift": shift } as unknown as MotionStyle)}
          initial={reduced ? false : { opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease }}
        >
          <NeonFrame radius={30} />
          <motion.div className="cta-orb" style={reduced ? undefined : { y: orbY }} aria-hidden="true">
            <motion.div className="orb-tilt" style={reduced ? { rotate: -14 } : { rotate: tilt }}>
              <OrbRings half="back" />
            </motion.div>
            <span className="orb-sphere" />
            <motion.div className="orb-tilt" style={reduced ? { rotate: -14 } : { rotate: tilt }}>
              <OrbRings half="front" />
            </motion.div>
          </motion.div>

          <div className="cta-copy">
            <h2 id="contact-title">
              <WordReveal text="آماده‌اید برند خود را متحول کنید؟" delay={0.2} />
            </h2>
            <p>همین حالا با ما تماس بگیرید و مشاوره رایگان دریافت کنید.</p>
          </div>

          <Magnetic>
            <button type="button" className="button button-primary cta-button" onClick={onConsult}>
              درخواست مشاوره رایگان
              <ArrowIcon className="button-arrow" />
            </button>
          </Magnetic>

          {/* The hero's cloud bank returns here, closing the page with the same motif. */}
          <img className="cta-clouds" src={images.clouds} alt="" width={2400} height={640} loading="lazy" decoding="async" />
        </motion.div>
      </div>
    </section>
  );
}

type Errors = Partial<Record<"name" | "contact", string>>;

const toLatinDigits = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const contact = toLatinDigits(String(data.get("contact") ?? "").trim());
  if (name.length < 2) errors.name = "لطفاً نام خود را بنویسید (حداقل دو حرف).";
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isPhone = /^\+?\d{10,13}$/.test(contact.replace(/[\s-]/g, ""));
  if (!contact) errors.contact = "شماره تماس یا ایمیل را وارد کنید.";
  else if (!isEmail && !isPhone) errors.contact = "این مقدار شبیه شماره تماس یا ایمیل نیست. مثال: ۰۹۱۲۱۲۳۴۵۶۷";
  return errors;
}

export function ConsultationDialog({ onClose, serviceId }: { onClose: () => void; serviceId?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const found = validate(new FormData(form));
    setErrors(found);
    const first = (Object.keys(found) as (keyof Errors)[])[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // TODO: send the request once a backend exists. Until then nothing leaves the browser.
    setDone(true);
  };

  return (
    <Dialog title="درخواست مشاوره رایگان" onClose={onClose} className="consult-dialog">
      {done ? (
        <div className="form-done" role="status">
          <h2>فرم کامل شد</h2>
          <p>
            این فرم هنوز به سرور وصل نیست، بنابراین اطلاعات شما ارسال یا ذخیره
            نشد. پس از اتصال، همین فرم درخواست را برای تیم می‌فرستد.
          </p>
          <button type="button" className="button button-primary" onClick={onClose} autoFocus>
            بستن
          </button>
        </div>
      ) : (
        <>
          <h2>درخواست مشاوره رایگان</h2>
          <p className="form-note">
            این فرم فعلاً نمایشی است و اطلاعاتی ارسال نمی‌شود.
          </p>
          <form noValidate onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="consult-name">نام و نام خانوادگی</label>
              <input
                id="consult-name"
                name="name"
                data-autofocus
                autoComplete="name"
                maxLength={80}
                placeholder="نام شما"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "consult-name-error" : undefined}
              />
              {errors.name && (
                <p id="consult-name-error" className="field-error">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="consult-contact">شماره تماس یا ایمیل</label>
              <input
                id="consult-contact"
                name="contact"
                dir="ltr"
                autoComplete="tel"
                maxLength={120}
                placeholder="09xx xxx xxxx"
                aria-invalid={!!errors.contact}
                aria-describedby={errors.contact ? "consult-contact-error" : undefined}
              />
              {errors.contact && (
                <p id="consult-contact-error" className="field-error">
                  {errors.contact}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="consult-service">خدمت مورد نظر</label>
              <select id="consult-service" name="service" defaultValue={serviceId ?? ""}>
                <option value="">هنوز مطمئن نیستم</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="consult-message">توضیح کوتاه (اختیاری)</label>
              <textarea
                id="consult-message"
                name="message"
                rows={3}
                maxLength={1000}
                placeholder="درباره برند یا پروژه‌تان بنویسید..."
              />
            </div>
            <button type="submit" className="button button-primary form-submit">
              ثبت درخواست
            </button>
          </form>
        </>
      )}
    </Dialog>
  );
}
