import { Instagram, Linkedin, Send, Youtube, ArrowUp } from "lucide-react";
import { navigation, services, images } from "../data/content";
import { Brand, Image } from "./Shared";
const socials = [
  { label: "اینستاگرام", url: "https://www.instagram.com/", Icon: Instagram },
  { label: "لینکدین", url: "https://www.linkedin.com/", Icon: Linkedin },
  { label: "تلگرام", url: "https://telegram.org/", Icon: Send },
  { label: "یوتیوب", url: "https://www.youtube.com/", Icon: Youtube },
];
export default function Footer() {
  return (
    <footer className="site-footer">
      <Image media={images.footer} className="footer-background" />
      <div className="container footer-content">
        <div className="footer-main">
          <div className="footer-brand-column">
            <Brand footer />
            <p>
              ما به قدرتِ یک ایده باور داریم.
              <br />
              ایده‌ای که دیده شود، حس شود و بماند.
            </p>
            <div className="social-links">
              {socials.map(({ label, url, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label}؛ لینک نمونه به وب‌سایت اصلی`}
                  title={`${label} — لینک نمونه`}
                >
                  <Icon size={19} strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <span className="social-disclaimer">
              پیوندهای شبکه‌های اجتماعی نمایشی هستند.
            </span>
          </div>
          <div className="footer-links">
            <h3>مسیرهای آشنایی</h3>
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <div className="footer-links">
            <h3>آنچه خلق می‌کنیم</h3>
            {services.slice(0, 6).map((service) => (
              <a key={service.id} href="#services">
                {service.title}
              </a>
            ))}
          </div>
          <div className="footer-contact">
            <h3>راه‌های ارتباطی</h3>
            <p>تهران، نشانی دفتر به‌زودی</p>
            <p>
              شماره تماس: <bdi>۰۲۱ ـ ۰۰۰۰ ۰۰۰۰</bdi>
            </p>
            <p>
              ایمیل: <bdi>hello@example.com</bdi>
            </p>
            <span className="footer-demo">اطلاعات تماس نمونه است.</span>
            <a href="#contact" className="footer-talk">
              از یک گفت‌وگو شروع کنیم ↖
            </a>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          CRIITO
        </div>
        <div className="footer-bottom">
          <p>
            © ۱۴۰۵ Criito. یک پیش‌نمایش خلاقانه؛ تمام محتوا و آمار نمایشی است.
          </p>
          <a href="#home">
            بازگشت به بالا
            <span className="round-arrow">
              <ArrowUp size={17} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
