// Browser click-through and accessibility checks for the homepage.
// Usage: npm run dev, then in another terminal: npm run test:e2e
// Env: BASE_URL (default http://127.0.0.1:5173), CHROMIUM_PATH (a local Chrome/Chromium),
//      PROXY (e.g. socks5://127.0.0.1:10808) if remote images need one.
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  headless: true,
  proxy: process.env.PROXY ? { server: process.env.PROXY, bypass: "127.0.0.1,localhost" } : undefined,
});
fs.mkdirSync("qa", { recursive: true });

const results = { baseURL, date: new Date().toISOString(), checks: [], consoleErrors: [], accessibility: [] };
const check = (pass, description, detail) => {
  results.checks.push({ description, pass: !!pass, ...(detail !== undefined ? { detail } : {}) });
  console.log(`${pass ? "PASS" : "FAIL"}  ${description}${!pass && detail !== undefined ? `  -> ${JSON.stringify(detail)}` : ""}`);
};

async function open({ width = 1440, height = 900, theme = "dark", reduced = false } = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  await context.addInitScript((t) => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("theme", t);
      sessionStorage.setItem("seeded", "1");
    }
  }, theme);
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  return { context, page, errors };
}

async function revealAll(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 420) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(140);
  }
  await page.waitForTimeout(1400);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(400);
}

const phrase = (page) => page.locator(".h1-phrase").first().innerText();

// 1. Layout at every width, in both themes.
for (const theme of ["dark", "light"]) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const { context, page, errors } = await open({ width, height: width < 800 ? 844 : 900, theme });
    await revealAll(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(overflow === 0, `${theme} ${width}px: no horizontal overflow`, overflow);
    check((await page.getAttribute("html", "data-theme")) === theme, `${theme} ${width}px: theme applied before render`);
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: `qa/${theme}-${width}.png`, fullPage: true });
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      results.accessibility.push({ theme, width, violations: axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.length, help: v.help })) });
      check(axe.violations.length === 0, `${theme} ${width}px: zero axe WCAG A/AA violations`, axe.violations.map((v) => v.id));
    }
    check(errors.length === 0, `${theme} ${width}px: no console errors`, errors);
    results.consoleErrors.push(...errors);
    await context.close();
  }
}

// 2. Desktop click-through.
{
  const { context, page, errors } = await open();

  const skip = page.locator(".skip-link");
  await page.keyboard.press("Tab");
  check(await skip.evaluate((el) => el === document.activeElement), "Tab: skip link receives focus first");

  const hrefs = await page.locator(".nav-pill a.nav-link").evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  const missing = await page.evaluate((list) => list.filter((h) => !document.querySelector(h)), hrefs);
  check(hrefs.length === 5 && missing.length === 0, "nav: every link points to a section that exists", { hrefs, missing });
  const soon = page.locator(".nav-pill .is-soon");
  check((await soon.count()) === 1 && (await soon.innerText()).includes("به‌زودی"), "nav: blog is labelled 'به‌زودی' and is not a link");

  await page.locator('.nav-pill a[href="#services"]').click();
  await page.waitForTimeout(1500);
  const servicesTop = await page.evaluate(() => document.getElementById("services").getBoundingClientRect().top);
  check(Math.abs(servicesTop) < 160, "nav: 'خدمات' scrolls to the services section", servicesTop);
  check((await page.locator(".nav-pill .is-active").innerText()).trim() === "خدمات", "nav: active indicator follows the section in view");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);

  await page.locator(".theme-toggle").click();
  await page.waitForTimeout(900);
  check((await page.getAttribute("html", "data-theme")) === "light", "theme toggle: switches to light");
  await page.reload({ waitUntil: "networkidle" });
  check((await page.getAttribute("html", "data-theme")) === "light", "theme toggle: choice persists after reload");
  await page.locator(".theme-toggle").click();
  await page.waitForTimeout(900);
  check((await page.getAttribute("html", "data-theme")) === "dark", "theme toggle: switches back to dark");

  await page.locator(".slide-dot").nth(1).click();
  await page.waitForTimeout(1300);
  check((await phrase(page)).includes("قاب"), "hero: slide 02 shows its headline", await phrase(page));
  check((await page.locator(".slide-dot").nth(1).getAttribute("aria-current")) === "true", "hero: active slide is marked aria-current");

  await page.locator(".slide-pause").click();
  check((await page.locator(".slide-pause").getAttribute("aria-pressed")) === "true", "hero: pause button reports pressed state");
  const pausedPhrase = await phrase(page);
  const dustFrame = () => page.locator(".stardust").evaluate((canvas) => canvas.toDataURL());
  const frameA = await dustFrame();
  await page.waitForTimeout(700);
  check(frameA === (await dustFrame()), "hero: pause also freezes the star dust");
  check(
    (await page.locator(".statue-sheen").evaluate((el) => getComputedStyle(el).animationPlayState)) === "paused",
    "hero: pause also freezes the light sweep on the statue",
  );
  await page.waitForTimeout(7300);
  check((await phrase(page)) === pausedPhrase, "hero: paused slides do not advance (8s)");
  await page.locator(".slide-pause").click();
  const frameB = await dustFrame();
  await page.waitForTimeout(700);
  check(frameB !== (await dustFrame()), "hero: star dust moves again after unpausing");
  await page.waitForTimeout(7300);
  check((await phrase(page)) !== pausedPhrase, "hero: autoplay resumes after unpausing");

  await page.locator(".header-cta").click();
  check(await page.locator("dialog[open]").isVisible(), "header CTA: opens the consultation dialog");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check((await page.locator("dialog[open]").count()) === 0, "dialog: Escape closes it");

  await page.locator(".hero-actions .button-primary").click();
  await page.locator(".form-submit").click();
  check((await page.locator(".field-error").count()) === 2, "form: empty submit shows two text errors");
  check((await page.getAttribute("#consult-name", "aria-invalid")) === "true", "form: invalid field gets aria-invalid");
  check(await page.locator("#consult-name").evaluate((el) => el === document.activeElement), "form: focus moves to the first invalid field");
  await page.fill("#consult-name", "نام آزمایشی");
  await page.fill("#consult-contact", "abc");
  await page.locator(".form-submit").click();
  check((await page.locator("#consult-contact-error").innerText()).includes("شماره تماس یا ایمیل"), "form: malformed contact is rejected with a message");
  await page.fill("#consult-contact", "۰۹۱۲۱۲۳۴۵۶۷");
  await page.locator(".form-submit").click();
  check(await page.locator(".form-done[role=status]").isVisible(), "form: valid submit (Persian digits) shows the honest 'not sent' status");
  await page.locator(".form-done .button").click();
  await page.waitForTimeout(300);
  check((await page.locator("dialog[open]").count()) === 0, "form: 'بستن' closes the dialog");

  const firstService = page.locator(".service-card").first();
  await firstService.scrollIntoViewIfNeeded();
  check((await page.locator(".service-card").count()) === 6, "services: six photo cards");
  await firstService.hover();
  await page.waitForTimeout(800);
  check(await firstService.locator(".service-description").isVisible(), "services: hover reveals the full description");
  await firstService.click();
  await page.waitForURL("**/services/sound");
  check((await page.locator(".detail-page h1").innerText()).includes("صداگذاری"), "services: card opens its own service page");
  await page.locator(".detail-page .button-primary").click();
  check((await page.inputValue("#consult-service")) === "sound", "service page: consult button preselects the service in the form");
  await page.locator(".dialog-close").click();
  await page.waitForTimeout(300);
  check((await page.locator("dialog[open]").count()) === 0, "dialog: close button closes it");
  await page.locator(".detail-page-back").click();
  await page.waitForTimeout(1200);
  const backTop = await page.evaluate(() => document.getElementById("services").getBoundingClientRect().top);
  check(Math.abs(backTop) < 160, "service page: 'همه خدمات' returns to the services section", backTop);

  const aboutToggle = page.locator(".about-toggle");
  await aboutToggle.scrollIntoViewIfNeeded();
  await aboutToggle.click();
  await page.waitForTimeout(700);
  check((await aboutToggle.getAttribute("aria-expanded")) === "true" && (await page.locator("#about-more").isVisible()), "about: 'چطور کار می‌کنیم؟' expands the extra text");
  await aboutToggle.click();
  await page.waitForTimeout(700);
  check((await page.locator("#about-more").count()) === 0, "about: second click collapses it");

  const panels = page.locator(".panel");
  await panels.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  check((await page.locator(".panel.is-open").count()) === 1, "portfolio: exactly one panel is open");
  // Start from a known state: the pointer may already rest on a panel after scrolling.
  await panels.first().hover();
  await page.waitForTimeout(1100);
  const closedWidth = (await panels.nth(2).boundingBox()).width;
  await panels.nth(2).hover();
  await page.waitForTimeout(1100);
  const openWidth = (await panels.nth(2).boundingBox()).width;
  check(openWidth > closedWidth * 2.5 && (await panels.nth(2).getAttribute("class")).includes("is-open"), "portfolio: hovering a panel opens it", { closedWidth, openWidth });
  // Real keyboard navigation: Tab from the fourth panel to the fifth.
  await panels.nth(3).locator(".panel-button").focus();
  await page.keyboard.press("Tab");
  await page.waitForTimeout(300);
  check((await panels.nth(4).getAttribute("class")).includes("is-open"), "portfolio: keyboard focus opens a panel");
  await page.keyboard.press("Enter");
  await page.waitForURL("**/projects/teaser");
  check((await page.locator(".detail-page h1").innerText()).includes("تیزر"), "portfolio: Enter on the open panel opens its project page");
  await page.locator(".detail-page-back").click();
  await page.waitForTimeout(1200);
  const portfolioTop = await page.evaluate(() => document.getElementById("portfolio").getBoundingClientRect().top);
  check(Math.abs(portfolioTop) < 160, "project page: 'همه نمونه‌کارها' returns to the portfolio section", portfolioTop);

  const track = page.locator(".clients-track");
  // The track itself never stops moving, so scroll to its (still) container.
  await page.locator(".clients-strip").scrollIntoViewIfNeeded();
  const x1 = await track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  await page.waitForTimeout(1000);
  const x2 = await track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  check(x2 > x1, "clients: logos drift to the right", { x1, x2 });
  await page.locator(".clients-strip").hover();
  await page.waitForTimeout(1500);
  const h1 = await track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  await page.waitForTimeout(600);
  const h2 = await track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  check(Math.abs(h2 - h1) < 0.5, "clients: hovering the strip stops it", { h1, h2 });
  await page.mouse.move(5, 5);
  await page.locator(".clients-toggle").click();
  await page.waitForTimeout(1500);
  const p1 = await track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  await page.waitForTimeout(600);
  const p2 = await track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  check(Math.abs(p2 - p1) < 0.5 && (await page.locator(".clients-toggle").getAttribute("aria-pressed")) === "true", "clients: the pause button stops it", { p1, p2 });
  await page.locator(".clients-toggle").click();

  await page.locator(".cta-button").click();
  check(await page.locator("dialog[open]").isVisible(), "closing CTA: opens the consultation dialog");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  check((await page.locator(".socials .social.is-soon").count()) === 4 && (await page.locator(".socials-note").isVisible()), "footer: social placeholders are labelled 'به‌زودی', not dead links");
  const credits = await page.locator(".credits a").evaluateAll((links) => links.map((a) => a.href));
  check(credits.some((h) => h.includes("commons.wikimedia.org")) && credits.some((h) => h.includes("creativecommons.org")), "footer: statue photo credit links to source and licence");

  await page.locator('a[href="/auth"]').first().click();
  await page.waitForURL("**/auth");
  check((await page.locator("h1").count()) === 1, "header: account icon opens the sign-in page");

  check(errors.length === 0, "desktop click-through: no console errors", errors);
  results.consoleErrors.push(...errors);
  await context.close();
}

// 3. Mobile menu.
{
  const { context, page, errors } = await open({ width: 390, height: 844 });
  const toggle = page.locator(".menu-toggle");
  await toggle.click();
  await page.waitForTimeout(400);
  check((await toggle.getAttribute("aria-expanded")) === "true" && (await page.locator("#mobile-navigation").isVisible()), "mobile: menu opens");
  await page.screenshot({ path: "qa/mobile-menu.png" });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  check((await toggle.getAttribute("aria-expanded")) === "false", "mobile: Escape closes the menu");
  check(await toggle.evaluate((el) => el === document.activeElement), "mobile: focus returns to the menu button");
  await toggle.click();
  await page.waitForTimeout(400);
  await page.locator('#mobile-navigation a[href="#portfolio"]').click();
  await page.waitForTimeout(1500);
  check((await toggle.getAttribute("aria-expanded")) === "false" && page.url().endsWith("#portfolio"), "mobile: choosing a link closes the menu and scrolls");
  await toggle.click();
  await page.waitForTimeout(400);
  await page.locator("#mobile-navigation .button-primary").click();
  check(await page.locator("dialog[open]").isVisible(), "mobile: menu consult button opens the dialog");
  await page.waitForTimeout(700);
  await page.screenshot({ path: "qa/mobile-dialog.png" });
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  results.accessibility.push({ theme: "dark", width: 390, state: "dialog", violations: axe.violations.map((v) => v.id) });
  check(axe.violations.length === 0, "mobile dialog: zero axe WCAG A/AA violations", axe.violations.map((v) => v.id));
  check(errors.length === 0, "mobile: no console errors", errors);
  await context.close();
}

// 4. Reduced motion: no autoplay, no looping comets, no pause control needed.
{
  const { context, page, errors } = await open({ reduced: true });
  const start = await phrase(page);
  await page.waitForTimeout(8500);
  check((await phrase(page)) === start, "reduced motion: hero slides do not autoplay");
  check((await page.locator(".slide-pause").count()) === 0, "reduced motion: no pause control (nothing moves)");
  const comets = await page.locator(".ring-comet").evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== "none").length);
  check(comets === 0, "reduced motion: ring comets are hidden", comets);
  check((await page.locator(".stardust").count()) === 0, "reduced motion: no star dust canvas");
  check((await page.locator(".cursor-light").count()) === 0, "reduced motion: no light following the mouse");
  check((await page.locator(".clients-toggle").count()) === 0 && (await page.locator(".clients-group").count()) === 1, "reduced motion: client logos sit still in one row");
  await page.locator(".slide-dot").nth(2).click();
  await page.waitForTimeout(400);
  check((await phrase(page)).includes("ذهن"), "reduced motion: slides still change on click");
  check(errors.length === 0, "reduced motion: no console errors", errors);
  await context.close();
}

await browser.close();
const failed = results.checks.filter((c) => !c.pass).length;
results.summary = { total: results.checks.length, failed };
fs.writeFileSync("qa/test-results.json", JSON.stringify(results, null, 2));
console.log(`\n${results.checks.length - failed}/${results.checks.length} checks passed. Results: qa/test-results.json`);
process.exit(failed ? 1 : 0);
