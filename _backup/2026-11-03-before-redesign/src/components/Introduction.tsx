import { Arrow, Eyebrow, Image, Reveal } from "./Shared";
import { images } from "../data/content";

export default function Introduction() {
  return (
    <>
      <section
        id="about"
        className="section introduction"
        aria-labelledby="about-title"
      >
        <div className="container intro-layout">
          <Reveal className="intro-image-composition">
            <Image media={images.introduction} className="intro-image" />
            <span className="image-index">روایتِ ما / ۰۱</span>
            <div className="image-floating-tag">
              <span>از زاویه‌ای دیگر</span>
              <strong>نگاه می‌کنیم.</strong>
              <Arrow />
            </div>
          </Reveal>
          <Reveal className="intro-copy" delay={0.1}>
            <Eyebrow>درباره Criito</Eyebrow>
            <h2 id="about-title">
              ما فقط تبلیغ نمی‌کنیم؛
              <br />
              <span className="gradient-text">اثر می‌گذاریم.</span>
            </h2>
            <p>
              هر برند داستانی دارد؛ ما اینجاییم تا آن را شنیدنی، دیدنی و
              به‌یادماندنی کنیم. با نگاهی جسور و ذهنی کنجکاو، از دلِ شناخت
              کسب‌وکار شما، ایده‌هایی می‌سازیم که فقط دیده نمی‌شوند؛ احساس
              می‌شوند.
            </p>
            <p className="muted">
              برای ما، خلاقیت وقتی ارزشمند است که به یک ارتباط واقعی میان برند و
              آدم‌ها تبدیل شود.
            </p>
            <a href="#approach" className="text-link">
              درباره ما بیشتر بدانید
              <span className="round-arrow">
                <Arrow />
              </span>
            </a>
          </Reveal>
        </div>
      </section>
      <section
        id="approach"
        className="section approach"
        aria-labelledby="approach-title"
      >
        <div className="container approach-layout">
          <Reveal className="approach-copy">
            <Eyebrow>از فکر تا تأثیر</Eyebrow>
            <h2 id="approach-title">
              ایده‌های بزرگ.
              <br />
              اجرای دقیق.
              <br />
              <span className="gradient-text">نتیجه‌ای ماندگار.</span>
            </h2>
            <p>
              پشت هر تصویر تأثیرگذار، یک فکر دقیق ایستاده است. استراتژی مسیر را
              روشن می‌کند، خلاقیت به آن جان می‌دهد و اجرای یکپارچه، آن را به
              تجربه‌ای ملموس تبدیل می‌کند.
            </p>
            <div className="process-strip">
              <span>
                <b>۰۱</b>کشف و شناخت
              </span>
              <span>
                <b>۰۲</b>ایده‌پردازی
              </span>
              <span>
                <b>۰۳</b>خلق و اجرا
              </span>
            </div>
            <a href="#journal" className="text-link">
              با نگاه ما آشنا شوید
              <span className="round-arrow">
                <Arrow />
              </span>
            </a>
          </Reveal>
          <Reveal className="approach-visual" delay={0.1}>
            <Image media={images.approach} className="approach-image" />
            <span className="image-index">پشتِ صحنه / ۰۲</span>
            <div id="journal" className="journal-note">
              <span className="mini-label">از دفتر خلاقیت / یادداشت کوتاه</span>
              <details>
                <summary>
                  چرا هر ایده‌ی خوب، با یک سؤال شروع می‌شود؟
                  <Arrow />
                </summary>
                <p>
                  پیش از طراحی و اجرا، می‌پرسیم: مخاطب شما کیست و قرار است چه
                  چیزی را متفاوت احساس کند؟ پاسخ روشن به همین سؤال، مسیر یک
                  ایده‌ی مؤثر را می‌سازد. خلاقیت برای ما از گوش‌دادن شروع
                  می‌شود.
                </p>
              </details>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
