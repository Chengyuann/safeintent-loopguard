import { chromium } from "playwright";
import path from "node:path";

const outputDir = path.resolve("outputs/demo-v2/raw");
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const targetUrl = process.env.DEMO_URL || "http://127.0.0.1:4173/";

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--autoplay-policy=no-user-gesture-required"]
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: outputDir,
    size: { width: 1440, height: 900 }
  }
});

const page = await context.newPage();
await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
await page.waitForSelector(".moduleCard");
await page.waitForTimeout(2500);

async function clickModule(title) {
  const button = page.locator(".moduleCard", { hasText: title });
  await button.click();
  await page.waitForSelector(".detailOverlay");
}

async function closeModule() {
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.waitForSelector(".detailOverlay", { state: "detached" });
}

await page.mouse.move(180, 320);
await page.waitForTimeout(1800);
await page.mouse.move(1020, 280, { steps: 40 });
await page.waitForTimeout(1800);

await clickModule("Social Context");
await page.waitForTimeout(7200);
await closeModule();
await page.waitForTimeout(700);

await clickModule("Mandate Compiler");
await page.waitForTimeout(7800);
await closeModule();
await page.waitForTimeout(700);

await clickModule("Loop Guard");
await page.waitForTimeout(4200);
await page.locator(".codeBox").evaluate((element) => {
  element.scrollTop = element.scrollHeight * 0.55;
});
await page.waitForTimeout(4400);
await closeModule();
await page.waitForTimeout(700);

await clickModule("Intent Receipt");
await page.waitForTimeout(5200);
await page.locator(".conflicts").scrollIntoViewIfNeeded();
await page.waitForTimeout(4300);
await page.locator(".rewriteList").scrollIntoViewIfNeeded();
await page.waitForTimeout(4300);
await page.locator(".receipt").scrollIntoViewIfNeeded();
await page.waitForTimeout(4200);
await closeModule();

await page.waitForTimeout(16800);

const video = page.video();
await context.close();
await browser.close();

if (video) {
  console.log(await video.path());
}
