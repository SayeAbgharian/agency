/** Temporary remote photography. Replace URLs here, without changing the UI.
 * All projects, people, testimonials and metrics below are fictional demo content.
 * A future PHP integration can map its response to these interfaces.
 */
export interface Media {
  src: string;
  alt: string;
  position?: string;
}
export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  image: Media;
}
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: Media;
}
export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  image: Media;
}
export interface Metric {
  value: number;
  label: string;
  suffix: string;
}
const photo = (id: string, width = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
export const images = {
  hero: {
    src: photo("photo-1618005182384-a83a8bd57fbe", 1400),
    alt: "فرم انتزاعی با نورپردازی بنفش و آبی؛ تصویر موقت از آن‌اسپلش",
    position: "50% 50%",
  },
  introduction: {
    src: photo("photo-1492691527719-9d1e07e534b4", 1200),
    alt: "عکاسی در ارتفاعات با پس‌زمینه کوهستان و مه",
  },
  approach: {
    src: photo("photo-1522071820081-009f0129c71c", 1100),
    alt: "همکاری یک تیم خلاق در محیط استودیو",
  },
  footer: {
    src: photo("photo-1519608487953-e999c86e7455", 1600),
    alt: "خیابان شهر در شب با نورهای نئون بنفش و آبی",
    position: "50% 65%",
  },
  fallback: photo("photo-1634017839464-5c339ebe3cb4", 1000),
} satisfies Record<string, Media | string>;
export const navigation = [
  { label: "خانه", href: "#home" },
  { label: "خدمات", href: "#services" },
  { label: "نمونه‌کارها", href: "#portfolio" },
  { label: "درباره ما", href: "#about" },
  { label: "وبلاگ", href: "#journal" },
  { label: "تماس", href: "#contact" },
];
export const metrics: Metric[] = [
  { value: 240, label: "پروژه به سرانجام رسیده", suffix: "+" },
  { value: 85, label: "همراه و مشتری راضی", suffix: "+" },
  { value: 12, label: "سال تجربه خلاقانه", suffix: "" },
  { value: 160, label: "کمپین به‌یادماندنی", suffix: "+" },
];
export const services: Service[] = [
  {
    id: "digital",
    title: "طراحی وب‌سایت و توسعه دیجیتال",
    category: "تجربه‌ای فراتر از کلیک",
    description:
      "از طراحی تجربه کاربری تا توسعه وب‌سایت؛ حضور دیجیتال برندتان را سریع، زیبا و هدفمند می‌سازیم.",
    image: {
      src: photo("photo-1460925895917-afdab827c52f"),
      alt: "طراحی و برنامه‌ریزی یک تجربه دیجیتال روی لپ‌تاپ",
    },
  },
  {
    id: "marketing",
    title: "بازاریابی دیجیتال و سئو",
    category: "دیده شوید، درست و به‌موقع",
    description:
      "با استراتژی محتوا، بهینه‌سازی جست‌وجو و کمپین‌های داده‌محور، مخاطب مناسب را به برندتان می‌رسانیم.",
    image: {
      src: photo("photo-1519389950473-47ba0277781c"),
      alt: "تیم بازاریابی در حال بررسی ایده‌ها و داده‌ها",
    },
  },
  {
    id: "content",
    title: "تولید محتوای تبلیغاتی",
    category: "روایت‌هایی که می‌مانند",
    description:
      "ایده را به روایت تبدیل می‌کنیم؛ از متن و سناریو تا محتوای خلاقانه‌ای که شخصیت برند را زنده می‌کند.",
    image: {
      src: photo("photo-1455390582262-044cdead277a"),
      alt: "دفتر یادداشت و ابزار نوشتن برای ایده‌پردازی محتوا",
    },
  },
  {
    id: "photography",
    title: "عکاسی تبلیغاتی",
    category: "هر قاب، یک داستان",
    description:
      "نور، ترکیب‌بندی و جزئیات را کنار هم می‌گذاریم تا محصولات و فضای برندتان متفاوت دیده شوند.",
    image: {
      src: photo("photo-1516035069371-29a1b244cc32"),
      alt: "نمای نزدیک دوربین حرفه‌ای عکاسی",
    },
  },
  {
    id: "film",
    title: "فیلم‌سازی و تولید ویدئو",
    category: "تصویر، صدا، تأثیر",
    description:
      "از پیش‌تولید و کارگردانی تا تدوین و صدا؛ تیزرها و فیلم‌های تبلیغاتی را یکپارچه اجرا می‌کنیم.",
    image: {
      src: photo("photo-1485846234645-a62644f84728"),
      alt: "کلاکت سینمایی در صحنه تولید یک فیلم",
    },
  },
  {
    id: "motion",
    title: "موشن گرافیک و جلوه‌های ویژه",
    category: "ایده‌ها به حرکت درمی‌آیند",
    description:
      "با انیمیشن، طراحی حرکت و جلوه‌های بصری، پیچیده‌ترین پیام‌ها را ساده، زنده و تماشایی روایت می‌کنیم.",
    image: {
      src: photo("photo-1634017839464-5c339ebe3cb4"),
      alt: "ساختار انتزاعی آبی با خطوط روان و پرتحرک",
    },
  },
  {
    id: "branding",
    title: "برندینگ و هویت بصری",
    category: "شخصیتی برای ماندن",
    description:
      "جایگاه‌یابی، نام، هویت بصری و زبان برند؛ اجزای یک شخصیت منسجم که در ذهن مخاطب ماندگار می‌شود.",
    image: {
      src: photo("photo-1600585154340-be6161a56a0c"),
      alt: "فضای معماری مینیمال با ترکیب‌بندی و هویت بصری مشخص",
    },
  },
  {
    id: "social",
    title: "مدیریت شبکه‌های اجتماعی",
    category: "گفت‌وگو، نه فقط انتشار",
    description:
      "با تقویم محتوا، طراحی، مدیریت جامعه و تحلیل عملکرد، ارتباطی واقعی با مخاطبانتان می‌سازیم.",
    image: {
      src: photo("photo-1511707171634-5f897ff02aa9"),
      alt: "گوشی هوشمند برای ارتباط در شبکه‌های اجتماعی",
    },
  },
];
export const projects: Project[] = [
  {
    id: "noor",
    title: "نور؛ روایتی از سادگی",
    category: "برندینگ و هویت بصری",
    description:
      "مطالعه مفهومی هویت یک برند سبک زندگی؛ از زبان بصری تا تجربه‌ای آرام و یکپارچه.",
    image: {
      src: photo("photo-1600210492486-724fe5c67fb0", 1300),
      alt: "فضای داخلی روشن و مینیمال برای پروژه مفهومی نور",
    },
  },
  {
    id: "pulse",
    title: "نبض شهر",
    category: "کمپین دیجیتال",
    description:
      "ایده یک کمپین برای نسلی که همیشه در حرکت است؛ ترکیب ریتم شهر با داستان‌های کوتاه دیجیتال.",
    image: {
      src: photo("photo-1519608487953-e999c86e7455"),
      alt: "خیابان شبانه با نورهای نئون در تصویر مفهومی کمپین نبض شهر",
    },
  },
  {
    id: "frame",
    title: "طعمِ یک لحظه",
    category: "عکاسی تبلیغاتی",
    description:
      "یک مجموعه عکاسی مفهومی برای ثبت بافت، رنگ و حس محصول با نورپردازی دقیق.",
    image: {
      src: photo("photo-1495474472287-4d71bcdd2085"),
      alt: "چند فنجان قهوه در دست همراهان، در نور طبیعی",
    },
  },
  {
    id: "motion-film",
    title: "در مسیرِ فردا",
    category: "تولید فیلم تبلیغاتی",
    description:
      "طرح مفهومی یک فیلم برند با تمرکز بر حرکت، چشم‌انداز و روایت تصویری سینمایی.",
    image: {
      src: photo("photo-1473448912268-2022ce9509d8"),
      alt: "جنگل و دریاچه برای کانسپت فیلم در مسیر فردا",
    },
  },
  {
    id: "outdoor",
    title: "شهر، بومِ ماست",
    category: "تبلیغات محیطی",
    description:
      "ایده‌پردازی یک کمپین شهری؛ پیامی کوتاه و هویتی جسور برای دیده‌شدن در مقیاس بزرگ.",
    image: {
      src: photo("photo-1519501025264-65ba15a82390"),
      alt: "خیابان شهری و ساختمان‌های بلند برای کمپین محیطی",
    },
  },
];
export const testimonials: Testimonial[] = [
  {
    name: "سارا محمدی",
    role: "مدیر برند — مجموعه فرضی نور",
    quote:
      "ایده‌ها فقط زیبا نبودند؛ دقیقاً همان حسی را منتقل کردند که می‌خواستیم مخاطب از برند ما به خاطر بسپارد.",
    image: {
      src: photo("photo-1580489944761-15a19d654956", 160),
      alt: "تصویر موقت برای شخصیت فرضی سارا محمدی",
    },
  },
  {
    name: "علی رضایی",
    role: "مدیر بازاریابی — مجموعه فرضی نبض",
    quote:
      "از اولین جلسه تا آخرین خروجی، یک تیم همراه داشتیم؛ منظم، خلاق و حساس به کوچک‌ترین جزئیات.",
    image: {
      src: photo("photo-1500648767791-00dcc994a43e", 160),
      alt: "تصویر موقت برای شخصیت فرضی علی رضایی",
    },
  },
  {
    name: "مینا کریمی",
    role: "بنیان‌گذار — مجموعه فرضی آوند",
    quote:
      "توانستند داستان ما را پیدا کنند و به زبان تصویر بگویند. نتیجه، هویتی بود که واقعاً شبیه خودمان است.",
    image: {
      src: photo("photo-1534528741775-53994a69daeb", 160),
      alt: "تصویر موقت برای شخصیت فرضی مینا کریمی",
    },
  },
];
export const faNumber = (n: number) => new Intl.NumberFormat("fa-IR").format(n);
