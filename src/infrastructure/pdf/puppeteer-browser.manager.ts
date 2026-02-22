import puppeteer, { type Browser } from 'puppeteer-core';

export class PuppeteerBrowserManager {
  private browserPromise: Promise<Browser> | undefined;

  constructor(private readonly executablePath?: string) {}

  getBrowser(): Promise<Browser> {
    if (!this.browserPromise) {
      this.browserPromise = puppeteer.launch({
        headless: true,
        executablePath: this.executablePath,
        ignoreDefaultArgs: ['--disable-extensions'],
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
        ],
      });
    }
    return this.browserPromise;
  }

  async close(): Promise<void> {
    if (!this.browserPromise) return;
    const browser = await this.browserPromise;
    await browser.close();
    this.browserPromise = undefined;
  }
}
