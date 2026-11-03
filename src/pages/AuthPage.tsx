import { useEffect, useRef, useState } from "react";
import type { FormEvent, PointerEvent } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight, ArrowUpLeft, Check, Eye, EyeOff } from "lucide-react";

import { images } from "../data/content";
import { Image, ease } from "../components/Shared";
import StarField from "../components/StarField";
import "../styles/auth.css";

type AuthMode = "login" | "register";

const MotionLink = motion.create(Link);

/** The card's parts arrive in reading order, so the eye lands on the heading, then the form. */
const card: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/** Extra register fields open and close in place, so it is clear what the other form adds. */
const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.42, ease },
} as const;

const swap = {
  initial: { opacity: 0, y: "0.35em", filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: "-0.25em", filter: "blur(6px)" },
  transition: { duration: 0.32, ease },
} as const;

const strengthLabels = ["خیلی کوتاه", "ضعیف", "متوسط", "خوب", "قوی"];

/** A rough local guide only: length, a mix of digits and letters, and a symbol. */
function passwordStrength(value: string) {
  if (value.length < 8) return 0;
  let score = 1;
  if (value.length >= 12) score++;
  if (/\d/.test(value) && /\D/.test(value)) score++;
  if (/[^\p{L}\p{N}]/u.test(value)) score++;
  return score;
}

/** Orbit rings from the hero, drawn once around the sign-in card. */
function Orbits() {
  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 2.4, delay, ease },
  });
  return (
    <svg className="auth-orbits" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="auth-orbit-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--ring-a)" stopOpacity="0" />
          <stop offset="0.3" stopColor="var(--ring-a)" stopOpacity="0.7" />
          <stop offset="0.6" stopColor="var(--ring-b)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--ring-c)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.ellipse cx="600" cy="400" rx="640" ry="190" transform="rotate(-12 600 400)" {...draw(0.2)} />
      <motion.ellipse cx="600" cy="420" rx="520" ry="300" transform="rotate(18 600 420)" {...draw(0.55)} />
    </svg>
  );
}

export default function AuthPage() {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [shakeScope, animate] = useAnimate<HTMLDivElement>();
  const [finePointer] = useState(() => window.matchMedia("(pointer: fine)").matches);

  const isRegister = mode === "register";
  const strength = passwordStrength(password);

  // Pointer position across the page, -0.5 to 0.5; the sky and the artwork lean against it.
  const mx = useSpring(0, { stiffness: 60, damping: 20 });
  const my = useSpring(0, { stiffness: 60, damping: 20 });
  const farX = useTransform(mx, (v) => v * -14);
  const farY = useTransform(my, (v) => v * -10);
  const nearX = useTransform(mx, (v) => v * -40);
  const nearY = useTransform(my, (v) => v * -28);
  const glowX = useTransform(mx, (v) => v * 120);
  const glowY = useTransform(my, (v) => v * 80);
  const artX = useTransform(mx, (v) => v * -18);
  const artY = useTransform(my, (v) => v * -14);
  const ringRotate = useTransform(mx, (v) => v * 10);

  const follow = (event: PointerEvent<HTMLElement>) => {
    if (reduced || !finePointer || event.pointerType !== "mouse") return;
    mx.set(event.clientX / window.innerWidth - 0.5);
    my.set(event.clientY / window.innerHeight - 0.5);
  };

  useEffect(() => {
    if (!error || reduced || !shakeScope.current) return;
    // One short shake on the field in error, so the eye finds it.
    animate(shakeScope.current, { x: [0, -9, 8, -5, 4, 0] }, { duration: 0.45 });
  }, [error, reduced, animate, shakeScope]);

  const changeMode = (nextMode: AuthMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setError("");
    setSubmitted(false);
    setPassword("");
    formRef.current?.reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    setError("");
    setSubmitted(false);

    if (isRegister) {
      const confirmation = form.elements.namedItem("confirmation") as HTMLInputElement;

      if (password !== confirmation.value) {
        setError("رمز عبور و تکرار آن یکسان نیستند.");
        confirmation.focus();
        return;
      }
    }

    // نسخه نمایشی: هیچ درخواست شبکه‌ای یا ذخیره‌سازی انجام نمی‌شود.
    form.reset();
    setPassword("");
    setSubmitted(true);
  };

  const passwordType = showPassword ? "text" : "password";

  return (
    <main className="auth-page" onPointerMove={follow}>
      <div className="auth-sky" aria-hidden="true">
        <motion.span className="auth-glow auth-glow-a" style={{ x: glowX, y: glowY }} />
        <motion.span className="auth-glow auth-glow-b" style={{ x: farX, y: farY }} />
        <StarField count={64} seed={13} className="auth-stars" style={{ x: farX, y: farY }} />
        <StarField count={22} seed={29} className="auth-stars" style={{ x: nearX, y: nearY }} />
        <Orbits />
      </div>

      <motion.div
        className="auth-shell"
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease }}
      >
        <motion.section
          className="auth-card"
          aria-labelledby="auth-title"
          variants={card}
          initial="hidden"
          animate="show"
        >
          <MotionLink to="/" className="auth-back" variants={item}>
            <ArrowRight size={18} aria-hidden="true" />
            بازگشت به خانه
          </MotionLink>

          <MotionLink to="/" className="auth-brand" aria-label="Criito؛ صفحه خانه" variants={item}>
            {/* TODO: replace this slot with the agency's logo file once it is supplied. */}
            <span className="logo-slot" aria-hidden="true">
              لوگو
            </span>
            <span dir="ltr">Criito</span>
          </MotionLink>

          <motion.p className="auth-eyebrow" variants={item}>
            آغاز یک ارتباط خلاقانه
          </motion.p>

          <motion.h1 id="auth-title" className="auth-title" variants={item}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={mode} {...swap}>
                {isRegister ? "به جمع ما بپیوندید." : "خوش برگشتید."}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          <motion.p className="auth-description" variants={item}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={mode} {...swap}>
                {isRegister
                  ? "برای شروع، اطلاعات حساب جدیدتان را وارد کنید."
                  : "برای ادامه، اطلاعات حساب خود را وارد کنید."}
              </motion.span>
            </AnimatePresence>
          </motion.p>

          <motion.div className="auth-mode" role="group" aria-label="انتخاب فرم" variants={item}>
            {(["login", "register"] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={mode === option ? "is-selected" : ""}
                aria-pressed={mode === option}
                onClick={() => changeMode(option)}
              >
                {mode === option && (
                  <motion.span
                    layoutId="auth-mode-pill"
                    className="auth-mode-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="auth-mode-label">{option === "login" ? "ورود" : "ثبت‌نام"}</span>
              </button>
            ))}
          </motion.div>

          <motion.p id="auth-demo-note" className="auth-demo-note" variants={item}>
            این صفحه نمایشی است و به سیستم حساب کاربری متصل نیست. لطفاً فقط
            اطلاعات آزمایشی وارد کنید.
          </motion.p>

          <motion.form
            ref={formRef}
            className="auth-form"
            autoComplete="off"
            aria-describedby="auth-demo-note"
            onSubmit={handleSubmit}
            onInput={() => {
              setError("");
              setSubmitted(false);
            }}
            variants={item}
          >
            <AnimatePresence initial={false}>
              {isRegister && (
                <motion.div key="name" className="auth-row auth-collapse" {...collapse}>
                  <label htmlFor="auth-name">نام و نام خانوادگی</label>
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    placeholder="نام آزمایشی"
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="auth-row">
              <label htmlFor="auth-email">ایمیل</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                placeholder="name@example.com"
                dir="ltr"
                maxLength={160}
                autoCapitalize="none"
                spellCheck={false}
                required
              />
            </div>

            <div className="auth-row">
              <label htmlFor="auth-password">رمز عبور</label>
              <div className="auth-input-wrap">
                <input
                  id="auth-password"
                  name="password"
                  type={passwordType}
                  placeholder="حداقل ۸ کاراکتر"
                  minLength={8}
                  maxLength={128}
                  aria-describedby="auth-password-hint"
                  required
                  onChange={(event) => setPassword(event.currentTarget.value)}
                />
                <button
                  type="button"
                  className="auth-reveal"
                  aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={showPassword ? "hide" : "show"}
                      className="auth-reveal-icon"
                      initial={{ opacity: 0, rotate: -40, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 40, scale: 0.6 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
              <p id="auth-password-hint" className="auth-field-hint">
                برای این پیش‌نمایش از رمز واقعی خود استفاده نکنید.
              </p>
            </div>

            <AnimatePresence initial={false}>
              {isRegister && password.length > 0 && (
                <motion.div key="strength" className="auth-row auth-collapse" {...collapse}>
                  <div className={`auth-strength level-${strength}`}>
                    <div className="auth-strength-bars" aria-hidden="true">
                      {[1, 2, 3, 4].map((step) => (
                        <span key={step} className="auth-strength-bar">
                          <motion.span
                            className="auth-strength-fill"
                            initial={false}
                            animate={{ scaleX: strength >= step ? 1 : 0 }}
                            transition={{ duration: 0.35, ease }}
                          />
                        </span>
                      ))}
                    </div>
                    <p className="auth-strength-label" aria-live="polite">
                      قدرت رمز: {strengthLabels[strength]}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {isRegister && (
                <motion.div key="confirmation" className="auth-row auth-collapse" {...collapse}>
                  <label htmlFor="auth-confirmation">تکرار رمز عبور</label>
                  <div ref={shakeScope}>
                    <input
                      id="auth-confirmation"
                      name="confirmation"
                      type={passwordType}
                      placeholder="رمز عبور را دوباره وارد کنید"
                      minLength={8}
                      maxLength={128}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "auth-error" : undefined}
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div key="error" className="auth-row auth-collapse" {...collapse}>
                  <p id="auth-error" className="auth-error" role="alert">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {submitted && (
                <motion.div key="feedback" className="auth-row auth-collapse" {...collapse}>
                  <p className="auth-feedback" role="status">
                    <motion.span
                      className="auth-feedback-mark"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.15 }}
                      aria-hidden="true"
                    >
                      <Check size={15} strokeWidth={2.6} />
                    </motion.span>
                    اعتبارسنجی نمایشی انجام شد. اطلاعات شما ارسال یا ذخیره نشده و
                    ورود یا ثبت‌نام واقعی انجام نشده است.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="auth-row">
              <button type="submit" className="button button-primary auth-submit">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={mode} {...swap}>
                    {isRegister ? "ثبت‌نام" : "ورود"}
                  </motion.span>
                </AnimatePresence>
                <ArrowUpLeft size={19} aria-hidden="true" />
              </button>
            </div>
          </motion.form>
        </motion.section>

        <aside className="auth-visual" aria-label="هویت بصری Criito">
          <motion.div
            className="auth-art-frame"
            initial={{ scale: 1.16, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease }}
            style={{ x: artX, y: artY }}
          >
            <Image media={images.hero} className="auth-art" eager />
          </motion.div>

          <svg className="auth-visual-ring" viewBox="0 0 400 400" aria-hidden="true">
            <defs>
              <linearGradient id="auth-ring-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--ring-a)" stopOpacity="0.1" />
                <stop offset="0.5" stopColor="var(--ring-b)" stopOpacity="1" />
                <stop offset="1" stopColor="var(--ring-c)" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <motion.g style={{ rotate: ringRotate, originX: "200px", originY: "200px" }}>
              <motion.ellipse
                cx="200"
                cy="200"
                rx="185"
                ry="58"
                transform="rotate(-16 200 200)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 0.9, ease }}
              />
            </motion.g>
          </svg>

          <motion.div
            className="auth-visual-copy"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.9 } } }}
          >
            <motion.span variants={item}>استراتژی · خلاقیت · تجربه</motion.span>
            <h2>
              {["هر ارتباط،", "آغاز یک اتفاق تازه."].map((line) => (
                <span key={line} className="auth-line">
                  <motion.span
                    className="auth-line-inner"
                    variants={{
                      hidden: { y: "110%" },
                      show: { y: 0, transition: { duration: 0.9, ease } },
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h2>
            <motion.p variants={item}>از یک ایده‌ی کوچک، تا اثری ماندگار.</motion.p>
          </motion.div>
        </aside>
      </motion.div>
    </main>
  );
}
