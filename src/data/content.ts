/** Homepage content. Text and images can be replaced here without touching the UI.
 * A future PHP integration can map its response to these interfaces.
 */
export interface Media {
  src: string;
  srcSet?: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
}
export type ServiceIcon =
  | "sound"
  | "marketing"
  | "web"
  | "photo"
  | "vfx"
  | "print";
export interface Service {
  id: string;
  title: string;
  latin?: string;
  icon: ServiceIcon;
  /** Each service takes its own colour from the brand spectrum (indigo, violet, orchid). */
  hue: "indigo" | "blue-violet" | "violet" | "lilac" | "orchid" | "magenta";
  description: string;
  /** Card and service-page photo. Temporary stock photo until the agency's own work replaces it. */
  image: Media;
}
export interface Project {
  id: string;
  category: string;
  image: Media;
  /** [REAL DATA] The project's write-up for its page; until set, the page says it is coming. */
  description?: string;
  /** Id of the related service: linked from the project page and preselected in its consult form. */
  service?: string;
}
export interface Metric {
  value: number;
  label: string;
  prefix?: string;
  suffix: string;
  icon: "star" | "folder" | "people";
}
export interface HeroSlide {
  id: string;
  phrase: string;
  description: string;
}
export interface Client {
  name: string;
  /** Simple geometric stand-in for a logo. */
  mark: "circle" | "diamond" | "arc" | "bars" | "ring" | "triangle" | "wave" | "dot";
  logo?: string;
}
export interface Social {
  label: string;
  /** Empty until the agency's real profile exists; the icon then renders as "coming soon". */
  url: string;
  icon: "instagram" | "telegram" | "linkedin" | "youtube";
}

const unsplash = (id: string, width: number, height: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=78`;
const unsplashMedia = (
  id: string,
  alt: string,
  width: number,
  height: number,
  position?: string,
): Media => ({
  src: unsplash(id, width, height),
  srcSet: `${unsplash(id, Math.round(width / 2), Math.round(height / 2))} ${Math.round(width / 2)}w, ${unsplash(id, width, height)} ${width}w`,
  alt,
  width,
  height,
  position,
});

const base = import.meta.env.BASE_URL;

export const images = {
  /** Head of Apollo, British Museum. Photo: Marie-Lan Nguyen, CC BY 2.5 (credited in the footer). */
  statue: {
    src: `${base}images/statue-apollo.webp`,
    alt: "سر مرمرین آپولو با موهای مواج، اثری رومی از موزه بریتانیا",
    width: 1100,
    height: 1575,
  } satisfies Media,
  clouds: `${base}images/clouds.webp`,
  about: unsplashMedia(
    "photo-1516035069371-29a1b244cc32",
    "دوربین عکاسی و چند لنز روی میز تیره",
    1000,
    1100,
  ),
  aboutDetail: unsplashMedia(
    "photo-1492691527719-9d1e07e534b4",
    "عکاسی روی صخره، رو به کوه‌ها و دریای ابر",
    560,
    420,
  ),
  /** Used by the sign-in page. */
  hero: unsplashMedia(
    "photo-1618005182384-a83a8bd57fbe",
    "فرم انتزاعی با نورپردازی بنفش و آبی",
    1400,
    1400,
  ),
  fallback: unsplash("photo-1634017839464-5c339ebe3cb4", 900, 600),
};

export const navigation = [
  { label: "خانه", href: "#home" },
  { label: "خدمات", href: "#services" },
  { label: "نمونه‌کارها", href: "#portfolio" },
  { label: "درباره ما", href: "#about" },
  // TODO: link the blog once its page exists. Until then it shows "به‌زودی".
  { label: "وبلاگ", href: "" },
  { label: "تماس با ما", href: "#contact" },
];

export const heroSlides: HeroSlide[] = [
  {
    id: "peak",
    phrase: "خلاقیت، در اوج",
    description:
      "از ایده تا اجرا، در کنار شما هستیم تا برندتان را به سطحی بالاتر برسانیم.",
  },
  {
    id: "frame",
    phrase: "ایده‌ها، در قاب",
    description:
      "عکاسی، فیلم و جلوه‌های ویژه؛ پیام برندتان را به تصویری تبدیل می‌کنیم که در خاطر بماند.",
  },
  {
    id: "reach",
    phrase: "برندها، در ذهن‌ها",
    description:
      "با بازاریابی دیجیتال، سئو و وب‌سایتی که درست کار می‌کند، برندتان را به مخاطب درست می‌رسانیم.",
  },
];

export const services: Service[] = [
  {
    id: "sound",
    title: "میکس و مستر و صداگذاری",
    icon: "sound",
    hue: "orchid",
    description:
      "صداگذاری تیزر، موسیقی و گویندگی، میکس و مستر نهایی برای پخش در تلویزیون، رادیو و شبکه‌های اجتماعی.",
    image: unsplashMedia(
      "photo-1598488035139-bdbb2231ce04",
      "میز میکس و مانیتورهای استودیوی ضبط، با گیتارهایی روی دیوار",
      1200,
      1200,
    ),
  },
  {
    id: "marketing",
    title: "بازاریابی دیجیتال و سئو",
    icon: "marketing",
    hue: "indigo",
    description:
      "تحقیق کلمات کلیدی، بهینه‌سازی سایت برای جست‌وجو و کمپین‌های تبلیغاتی آنلاین با گزارش منظم از نتیجه.",
    image: unsplashMedia(
      "photo-1432888622747-4eb9a8efeb07",
      "گوشی همراه کنار کاشی‌های حروف که عبارت Social Media را ساخته‌اند",
      1200,
      1200,
    ),
  },
  {
    id: "web",
    title: "طراحی وب‌سایت و توسعه دیجیتال",
    icon: "web",
    hue: "blue-violet",
    description:
      "طراحی رابط کاربری و ساخت وب‌سایت سریع و واکنش‌گرا، از صفحه معرفی تا فروشگاه اینترنتی.",
    image: unsplashMedia(
      "photo-1547658719-da2b51169166",
      "مانیتور و تبلت با کد و طرح صفحه‌های یک وب‌سایت",
      1200,
      1200,
    ),
  },
  {
    id: "photo",
    title: "عکاسی تبلیغاتی",
    icon: "photo",
    hue: "magenta",
    description:
      "عکاسی محصول، صنعتی و کمپین در استودیو یا لوکیشن، همراه با روتوش و آماده‌سازی برای چاپ و وب.",
    image: unsplashMedia(
      "photo-1452587925148-ce544e77e70d",
      "دوربین عکاسی قدیمی کنار چند عکس چاپی روی نقشه",
      1200,
      1200,
    ),
  },
  {
    id: "vfx",
    title: "جلوه‌های ویژه بصری",
    latin: "VFX",
    icon: "vfx",
    hue: "violet",
    description:
      "کامپوزیت، مدل‌سازی سه‌بعدی و موشن گرافیک برای تیزر و ویدئوهای شبکه‌های اجتماعی.",
    image: unsplashMedia(
      "photo-1618005182384-a83a8bd57fbe",
      "طرح انتزاعی موج‌دار با رنگ‌های بنفش و آبی",
      1200,
      1200,
    ),
  },
  {
    id: "print",
    title: "چاپ دیجیتال",
    icon: "print",
    hue: "lilac",
    description:
      "طراحی و چاپ بنر، بروشور، کاتالوگ و بسته‌بندی با نمونه‌گیری رنگ پیش از چاپ نهایی.",
    image: unsplashMedia(
      "photo-1503694978374-8a2fa686963a",
      "دستگاه چاپ در حال چاپ برگه‌ها",
      1200,
      1200,
    ),
  },
];

/** [REAL DATA] Placeholder figures from the design mockup. Replace before enabling <Statistics />. */
export const metrics: Metric[] = [
  { value: 98, label: "رضایت مشتریان", suffix: "٪", icon: "star" },
  { value: 1200, label: "پروژه موفق", suffix: "+", icon: "folder" },
  { value: 500, label: "مشتری راضی", suffix: "+", icon: "people" },
];

/** Temporary stock photos (Unsplash). Each one is labelled "تصویر موقت" in the UI until real work replaces it. */
export const projects: Project[] = [
  {
    id: "city-campaign",
    category: "کمپین تبلیغات شهری",
    image: unsplashMedia(
      "photo-1519608487953-e999c86e7455",
      "خیابان شهر در شب با نورهای نئون بنفش و آبی",
      720,
      900,
    ),
  },
  {
    id: "web-dashboard",
    service: "web",
    category: "طراحی وب‌سایت",
    image: unsplashMedia(
      "photo-1460925895917-afdab827c52f",
      "لپ‌تاپ با نمودارهای یک داشبورد تحلیلی",
      720,
      900,
    ),
  },
  {
    id: "motion",
    service: "vfx",
    category: "موشن گرافیک",
    image: unsplashMedia(
      "photo-1634017839464-5c339ebe3cb4",
      "موج‌های انتزاعی آبی با خطوط روان",
      720,
      900,
    ),
  },
  {
    id: "product-photo",
    service: "photo",
    category: "عکاسی محصول",
    image: unsplashMedia(
      "photo-1495474472287-4d71bcdd2085",
      "سه فنجان قهوه در دست، نمای بالا",
      720,
      900,
    ),
  },
  {
    id: "teaser",
    service: "vfx",
    category: "تیزر تبلیغاتی",
    image: unsplashMedia(
      "photo-1485846234645-a62644f84728",
      "کلاکت فیلمبرداری در دست، در فضای باز",
      720,
      900,
    ),
  },
  {
    id: "outdoor",
    service: "print",
    category: "تبلیغات محیطی",
    image: unsplashMedia(
      "photo-1519501025264-65ba15a82390",
      "خیابان شلوغ شهری میان ساختمان‌های بلند",
      720,
      900,
    ),
  },
];

/**
 * [REAL DATA] Placeholder client brands (invented names, not real companies) for the moving logo strip.
 * Replace with the agency's real clients; give `logo` an image path to show their logo file instead of the mark.
 */
export const clients: Client[] = [
  { name: "Lumora", mark: "circle" },
  { name: "Kelvar", mark: "diamond" },
  { name: "Nimbo", mark: "arc" },
  { name: "Sorena", mark: "bars" },
  { name: "Tavio", mark: "ring" },
  { name: "Vexa", mark: "triangle" },
  { name: "Halcyn", mark: "wave" },
  { name: "Orbitly", mark: "dot" },
];

/** TODO: add the agency's real profile URLs. Empty URLs render as "به‌زودی". */
export const socials: Social[] = [
  { label: "اینستاگرام", url: "", icon: "instagram" },
  { label: "تلگرام", url: "", icon: "telegram" },
  { label: "لینکدین", url: "", icon: "linkedin" },
  { label: "یوتیوب", url: "", icon: "youtube" },
];

/** TODO: sample details; replace with the agency's real address, phone and email before launch. */
export const contactInfo = {
  address: "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۱۲۳، طبقه ۴",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Tehran+Valiasr+Street",
  phone: { label: "۰۲۱-۱۲۳۴۵۶۷۸", href: "tel:+982112345678" },
  email: "hello@example.com",
  hours: "شنبه تا چهارشنبه، ۹ تا ۱۸",
};

const faFormat =new Intl.NumberFormat("fa-IR", { useGrouping: false });
export const faNumber = (n: number) => faFormat.format(n);
