import { useState } from "react";
import { Check, Send } from "lucide-react";
import { Arrow, Dialog, Eyebrow, Image, Reveal } from "./Shared";
import { images } from "../data/content";

export function Contact({ onConsult }: { onConsult: () => void }) {
  return (
    <section
      id="contact"
      className="contact-section container"
      aria-labelledby="contact-title"
    >
      <Reveal className="contact-panel">
        <Image media={images.footer} className="contact-background" />
        <div className="contact-light" aria-hidden="true" />
        <div className="contact-copy">
          <Eyebrow>ایده‌ی بعدی، شاید از همین‌جا شروع شود</Eyebrow>
          <h2 id="contact-title">
            آماده‌ایم برند شما را
            <br />
            <span className="gradient-text">متحول کنیم؟</span>
          </h2>
          <p>همین حالا با ما گفت‌وگو کنید و مسیر رشد برندتان را آغاز کنید.</p>
          <button className="button button-primary" onClick={onConsult}>
            درخواست مشاوره رایگان
            <Arrow />
          </button>
        </div>
        <span className="contact-side-label">یک گفت‌وگو، هزار امکان تازه.</span>
      </Reveal>
    </section>
  );
}
export function ConsultationDialog({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <Dialog
      title="درخواست مشاوره رایگان؛ فرم نمایشی"
      onClose={onClose}
      className="consult-dialog"
    >
      {submitted ? (
        <div className="form-success" role="status">
          <span className="success-icon">
            <Check size={30} />
          </span>
          <h2>شروعِ یک ایده‌ی تازه!</h2>
          <p>
            پیش‌نمایش فرم با موفقیت انجام شد. این نسخه نمایشی است؛ اطلاعات شما
            ارسال یا ذخیره نشده است.
          </p>
          <button autoFocus className="button button-primary" onClick={onClose}>
            بازگشت به صفحه
            <Arrow />
          </button>
        </div>
      ) : (
        <>
          <Eyebrow>از ایده‌تان بگویید</Eyebrow>
          <h2>یک گفت‌وگوی خلاقانه.</h2>
          <p className="form-disclaimer">
            فرم نمایشی است؛ هیچ اطلاعاتی ارسال یا ذخیره نمی‌شود. لطفاً فقط
            اطلاعات آزمایشی وارد کنید.
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <label htmlFor="consult-name">
              نام شما
              <input
                autoFocus
                data-autofocus
                id="consult-name"
                name="name"
                required
                minLength={2}
                maxLength={80}
                placeholder="نام آزمایشی"
                autoComplete="off"
              />
            </label>
            <label htmlFor="consult-email">
              ایمیل
              <input
                id="consult-email"
                name="email"
                type="email"
                required
                maxLength={160}
                placeholder="name@example.com"
                dir="ltr"
                autoComplete="off"
              />
            </label>
            <label htmlFor="consult-message">
              از ایده یا پروژه‌تان بگویید
              <textarea
                id="consult-message"
                name="message"
                required
                minLength={10}
                maxLength={2000}
                rows={3}
                placeholder="دوست دارید چه چیزی خلق کنیم؟"
              />
            </label>
            <button className="button button-primary" type="submit">
              پیش‌نمایش درخواست
              <Send size={18} />
            </button>
          </form>
        </>
      )}
    </Dialog>
  );
}
