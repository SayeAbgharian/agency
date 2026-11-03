import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpLeft, Sparkles } from "lucide-react";

import { images } from "../data/content";
import { Image } from "../components/Shared";
import "../styles/auth.css";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isRegister = mode === "register";

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    setError("");
    setSubmitted(false);

    if (isRegister) {
      const password = form.elements.namedItem("password") as HTMLInputElement;

      const confirmation = form.elements.namedItem(
        "confirmation",
      ) as HTMLInputElement;

      if (password.value !== confirmation.value) {
        setError("رمز عبور و تکرار آن یکسان نیستند.");
        confirmation.focus();
        return;
      }
    }

    // نسخه نمایشی: هیچ درخواست شبکه‌ای یا ذخیره‌سازی انجام نمی‌شود.
    form.reset();
    setSubmitted(true);
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-card" aria-labelledby="auth-title">
          <Link to="/" className="auth-back">
            <ArrowRight size={18} aria-hidden="true" />
            بازگشت به خانه
          </Link>

          <Link to="/" className="auth-brand" aria-label="Criito؛ صفحه خانه">
            <Sparkles size={35} strokeWidth={1.3} aria-hidden="true" />
            <span dir="ltr">Criito</span>
          </Link>

          <p className="auth-eyebrow">آغاز یک ارتباط خلاقانه</p>

          <h1 id="auth-title">
            {isRegister ? "به جمع ما بپیوندید." : "خوش برگشتید."}
          </h1>

          <p className="auth-description">
            {isRegister
              ? "برای شروع، اطلاعات حساب جدیدتان را وارد کنید."
              : "برای ادامه، اطلاعات حساب خود را وارد کنید."}
          </p>

          <div className="auth-mode" role="group" aria-label="انتخاب فرم">
            <button
              type="button"
              className={!isRegister ? "is-selected" : ""}
              aria-pressed={!isRegister}
              onClick={() => changeMode("login")}
            >
              ورود
            </button>

            <button
              type="button"
              className={isRegister ? "is-selected" : ""}
              aria-pressed={isRegister}
              onClick={() => changeMode("register")}
            >
              ثبت‌نام
            </button>
          </div>

          <p id="auth-demo-note" className="auth-demo-note">
            این صفحه نمایشی است و به سیستم حساب کاربری متصل نیست. لطفاً فقط
            اطلاعات آزمایشی وارد کنید.
          </p>

          <form
            key={mode}
            className="auth-form"
            autoComplete="off"
            aria-describedby="auth-demo-note"
            onSubmit={handleSubmit}
            onInput={() => {
              setError("");
              setSubmitted(false);
            }}
          >
            {isRegister && (
              <label htmlFor="auth-name">
                نام و نام خانوادگی
                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  placeholder="نام آزمایشی"
                  minLength={2}
                  maxLength={80}
                  required
                />
              </label>
            )}

            <label htmlFor="auth-email">
              ایمیل
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
            </label>

            <label htmlFor="auth-password">
              رمز عبور
              <input
                id="auth-password"
                name="password"
                type="password"
                placeholder="حداقل ۸ کاراکتر"
                minLength={8}
                maxLength={128}
                aria-describedby="auth-password-hint"
                required
              />
            </label>

            <p id="auth-password-hint" className="auth-field-hint">
              برای این پیش‌نمایش از رمز واقعی خود استفاده نکنید.
            </p>

            {isRegister && (
              <label htmlFor="auth-confirmation">
                تکرار رمز عبور
                <input
                  id="auth-confirmation"
                  name="confirmation"
                  type="password"
                  placeholder="رمز عبور را دوباره وارد کنید"
                  minLength={8}
                  maxLength={128}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "auth-error" : undefined}
                  required
                />
              </label>
            )}

            {error && (
              <p id="auth-error" className="auth-error" role="alert">
                {error}
              </p>
            )}

            {submitted && (
              <p className="auth-feedback" role="status">
                اعتبارسنجی نمایشی انجام شد. اطلاعات شما ارسال یا ذخیره نشده و
                ورود یا ثبت‌نام واقعی انجام نشده است.
              </p>
            )}

            <button type="submit" className="button button-primary auth-submit">
              {isRegister ? "ثبت‌نام" : "ورود"}
              <ArrowUpLeft size={19} aria-hidden="true" />
            </button>
          </form>
        </section>

        <aside className="auth-visual" aria-label="هویت بصری Criito">
          <Image media={images.hero} className="auth-art" eager />

          <div className="auth-visual-copy">
            <span>استراتژی · خلاقیت · تجربه</span>
            <h2>
              هر ارتباط،
              <br />
              آغاز یک اتفاق تازه.
            </h2>
            <p>از یک ایده‌ی کوچک، تا اثری ماندگار.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
