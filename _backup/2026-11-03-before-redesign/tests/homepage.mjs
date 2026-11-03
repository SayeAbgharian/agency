import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:5173";
const executablePath = process.env.CHROMIUM_PATH || undefined;
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox"],
});
const results = {
  baseURL,
  checks: [],
  images: [],
  consoleErrors: [],
  accessibility: [],
  resourceErrors: [],
};
const check = (condition, description) => {
  results.checks.push({ description, pass: !!condition });
  if (!condition) throw new Error(description);
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
fs.mkdirSync("qa", { recursive: true });
async function settle(page) {
  await page.waitForTimeout(900);
}
async function revealAll(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 650) {
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      y,
    );
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(2000);
}
async function captureSection(page, selector, file) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await settle(page);
  await page.locator(selector).screenshot({
    path: `qa/${file}.png`,
    style: ".site-header,.skip-link{visibility:hidden!important}",
  });
}
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("response", (response) => {
    if (response.status() >= 400)
      results.resourceErrors.push({
        url: response.url(),
        status: response.status(),
      });
  });
  page.on("pageerror", (error) => results.consoleErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") results.consoleErrors.push(message.text());
  });
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await sleep(1200);
  await page.screenshot({ path: "qa/desktop-hero.png" });
  check(
    (await page.locator("html").getAttribute("dir")) === "rtl",
    "Root layout is RTL",
  );
  check(
    (await page.locator("h1").count()) === 1,
    "One semantic H1 and one public homepage",
  );
  const anchorTargets = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links.every((link) => document.querySelector(link.getAttribute("href"))),
    );
  check(anchorTargets, "Every internal link has a real target");
  await revealAll(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await settle(page);
  await page.screenshot({ path: "qa/desktop-full.png", fullPage: true });
  await captureSection(page, "#about", "desktop-introduction");
  await captureSection(page, "#approach", "desktop-approach");
  await captureSection(page, ".statistics", "desktop-statistics");
  await captureSection(page, "#services", "desktop-services");
  await page.locator(".service-card").first().click();
  check(
    (await page
      .locator(".service-card")
      .first()
      .getAttribute("aria-expanded")) === "true",
    "Service cards expand on click and expose state",
  );
  await page.locator(".service-card").first().click();
  await page.locator("#portfolio").scrollIntoViewIfNeeded();
  await settle(page);
  await page.getByRole("button", { name: "مشاهده همه نمونه‌کارها" }).click();
  check(
    (await page.locator(".project").count()) === 5,
    "Portfolio expands to all five sample categories",
  );
  await captureSection(page, "#portfolio", "desktop-portfolio");
  await page.locator(".project-button").first().click();
  check(
    (await page.locator("dialog[open]").count()) === 1,
    "Project preview opens as a native accessible dialog",
  );
  await page.screenshot({ path: "qa/desktop-project-dialog.png" });
  await page.keyboard.press("Escape");
  check(
    (await page.locator("dialog[open]").count()) === 0,
    "Escape closes project dialog",
  );
  await captureSection(page, ".testimonials", "desktop-testimonials");
  await captureSection(page, ".contact-section", "desktop-contact");
  await captureSection(page, ".site-footer", "desktop-footer");
  check(
    await page
      .locator(".site-header")
      .evaluate((el) => el.classList.contains("is-compact")),
    "Header becomes compact after scrolling",
  );
  await page.locator(".header-cta").click();
  check(
    await page
      .locator("#consult-name")
      .evaluate((el) => document.activeElement === el),
    "Consultation dialog autofocuses the first input",
  );
  await page.screenshot({ path: "qa/desktop-consult-dialog.png" });
  for (let tab = 0; tab < 8; tab++) await page.keyboard.press("Tab");
  check(
    await page
      .locator("dialog")
      .evaluate((dialog) => dialog.contains(document.activeElement)),
    "Native consultation dialog traps keyboard focus",
  );
  await page.locator("#consult-name").fill("نام آزمایشی");
  await page.locator("#consult-email").fill("demo@example.com");
  await page
    .locator("#consult-message")
    .fill("این یک درخواست آزمایشی برای بررسی فرم نمایشی است.");
  let outbound = 0;
  const track = (request) => {
    if (request.method() === "POST") outbound++;
  };
  page.on("request", track);
  await page.getByRole("button", { name: "پیش‌نمایش درخواست" }).click();
  check(
    (await page.getByRole("status").count()) === 1 && outbound === 0,
    "Demo form shows confirmation without transmitting data",
  );
  await page.getByRole("button", { name: "بازگشت به صفحه" }).click();
  results.images = await page.locator("img").evaluateAll((imgs) =>
    imgs.map((i) => ({
      src: i.currentSrc,
      loaded: i.complete && i.naturalWidth > 0,
      alt: i.alt,
    })),
  );
  check(
    results.images.every((i) => i.loaded && i.alt),
    "All remote photographs load and have meaningful alternative text",
  );
  check(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "No desktop horizontal overflow",
  );
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  results.accessibility.push({
    viewport: "desktop",
    violations: axe.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      nodes: nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
  await context.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const phone = await mobile.newPage();
  phone.on("pageerror", (error) => results.consoleErrors.push(error.message));
  await phone.goto(baseURL, { waitUntil: "networkidle" });
  await phone.evaluate(() => document.fonts.ready);
  await settle(phone);
  await phone.screenshot({ path: "qa/mobile-hero.png", fullPage: false });
  await revealAll(phone);
  await phone.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await phone.screenshot({ path: "qa/mobile-full.png", fullPage: true });
  check(
    await phone.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "No mobile horizontal overflow at 390px",
  );
  await phone.getByRole("button", { name: "باز کردن فهرست" }).click();
  check(
    (await phone
      .getByRole("button", { name: "بستن فهرست" })
      .getAttribute("aria-expanded")) === "true",
    "Mobile navigation opens",
  );
  await phone.screenshot({ path: "qa/mobile-menu.png" });
  await phone
    .locator("#mobile-navigation")
    .getByRole("link", { name: "خدمات", exact: true })
    .click();
  check(
    await phone.evaluate(() => location.hash === "#services"),
    "Mobile navigation follows section anchors",
  );
  check(
    (await phone
      .getByRole("button", { name: "باز کردن فهرست" })
      .getAttribute("aria-expanded")) === "false",
    "Mobile navigation closes after selection",
  );
  check(
    await phone
      .locator(".service-description")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity === "1"),
    "Touch users can read service descriptions without hover",
  );
  await captureSection(phone, "#about", "mobile-introduction");
  await captureSection(phone, "#approach", "mobile-approach");
  await captureSection(phone, ".statistics", "mobile-statistics");
  const countBefore = await phone.locator(".stat strong").allTextContents();
  check(
    countBefore[0].includes("۲۴۰") && countBefore[1].includes("۸۵"),
    "Counters finish immediately under reduced-motion preferences",
  );
  await captureSection(phone, ".service-slot-1", "mobile-service");
  await captureSection(phone, "#portfolio", "mobile-portfolio");
  await phone.getByRole("button", { name: "مشاهده همه نمونه‌کارها" }).click();
  check(
    (await phone.locator(".project").count()) === 5,
    "Mobile portfolio expands to all five sample projects",
  );
  await phone.locator(".project-button").first().click();
  await phone.screenshot({ path: "qa/mobile-project-dialog.png" });
  await phone.keyboard.press("Escape");
  await captureSection(phone, ".testimonials", "mobile-testimonials");
  await captureSection(phone, ".contact-section", "mobile-contact");
  await captureSection(phone, ".site-footer", "mobile-footer");
  check(
    JSON.stringify(await phone.locator(".stat strong").allTextContents()) ===
      JSON.stringify(countBefore),
    "Counters retain final values after leaving and revisiting the section",
  );
  await phone.locator(".contact-copy button").click();
  await phone.screenshot({ path: "qa/mobile-consult-dialog.png" });
  const mobileDialogAxe = await new AxeBuilder({ page: phone })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  results.accessibility.push({
    viewport: "mobile-dialog",
    violations: mobileDialogAxe.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      nodes: nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
  await phone.keyboard.press("Escape");
  const mobileAxe = await new AxeBuilder({ page: phone })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  results.accessibility.push({
    viewport: "mobile",
    violations: mobileAxe.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      nodes: nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
  await phone.locator("#journal").scrollIntoViewIfNeeded();
  await phone.locator("#journal summary").click();
  check(
    (await phone.locator("#journal details").getAttribute("open")) !== null,
    "Blog navigation points to a real expandable editorial note on the same page",
  );
  // Exercise both stages of the image-error fallback, without deliberately making invalid network requests.
  const firstImage = phone.locator(".hero-image img");
  await firstImage.dispatchEvent("error");
  await settle(phone);
  await phone.locator(".hero-image img").dispatchEvent("error");
  check(
    (await phone.locator(".hero-image .image-fallback").count()) === 1,
    "Image failure ends with an accessible CSS fallback, not a broken image",
  );
  for (const width of [320, 360, 768, 1024, 1920]) {
    await phone.setViewportSize({ width, height: 900 });
    await settle(phone);
    check(
      await phone.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No horizontal overflow at ${width}px`,
    );
  }
  check(
    results.consoleErrors.length === 0,
    "No browser console errors or uncaught React exceptions",
  );
  await mobile.close();
  check(
    results.accessibility.every((run) => run.violations.length === 0),
    "Automated WCAG A/AA accessibility checks report zero violations",
  );
} catch (error) {
  results.failure = error.message;
} finally {
  fs.writeFileSync("qa/test-results.json", JSON.stringify(results, null, 2));
  await browser.close();
  console.log(
    JSON.stringify(
      {
        checks: results.checks.length,
        passed: results.checks.filter((c) => c.pass).length,
        images: results.images.length,
        errors: results.consoleErrors,
        accessibility: results.accessibility.map((a) => ({
          viewport: a.viewport,
          violations: a.violations.length,
        })),
        failure: results.failure || null,
      },
      null,
      2,
    ),
  );
  if (results.failure) process.exit(1);
}
