import { Reveal } from "./Shared";

const letters = [
  { letter: "C", word: "Creative", fa: "خلاقیت", text: "نگاهی تازه به هر برند" },
  { letter: "R", word: "Reaching", fa: "در دسترس", text: "همیشه کنار شما، همیشه پاسخگو" },
  { letter: "I", word: "Idea", fa: "ایده", text: "جرقه‌ی هر اتفاق بزرگ" },
  { letter: "I", word: "Impact", fa: "اثرگذاری", text: "نتیجه‌ای که دیده و سنجیده می‌شود" },
  { letter: "T", word: "Trust", fa: "اعتماد", text: "رابطه‌ای شفاف و پایدار" },
  { letter: "O", word: "Original", fa: "اصیل و منحصربه‌فرد", text: "هویتی که شبیه هیچ‌کس نیست" },
];

export default function Acronym() {
  return (
    <section className="section acronym" aria-labelledby="acronym-title">
      <div className="container">
        <Reveal className="acronym-heading">
          <p className="eyebrow">
            <span aria-hidden="true" />
            معنی نام ما
          </p>
          <h2 id="acronym-title">
            شش حرف، <span className="gradient-text">یک وعده.</span>
          </h2>
        </Reveal>
        <ul className="acronym-grid">
          {letters.map((item, index) => (
            <li key={item.word + index}>
              <Reveal className="acronym-card" delay={index * 0.07}>
                <span className="acronym-letter" aria-hidden="true">
                  {item.letter}
                </span>
                <span className="acronym-word" dir="ltr">
                  {item.word}
                </span>
                <h3>{item.fa}</h3>
                <p>{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
