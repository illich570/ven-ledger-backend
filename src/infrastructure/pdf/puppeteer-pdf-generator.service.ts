import type { PdfGeneratorPort } from '../../domain/ports/pdf-generator.port.js';
import type { PuppeteerBrowserManager } from './puppeteer-browser.manager.js';
import type { Semaphore } from './semaphore.js';

export class PuppeteerPdfGeneratorService implements PdfGeneratorPort {
  constructor(
    private readonly browserManager: PuppeteerBrowserManager,
    private readonly semaphore: Semaphore,
  ) {}

  async htmlToPdf(params: {
    html: string;
    headerTemplate?: string;
    footerTemplate?: string;
  }): Promise<Buffer> {
    return this.semaphore.run(async () => {
      const browser = await this.browserManager.getBrowser();
      const page = await browser.newPage();

      try {
        await page.setContent(params.html, { waitUntil: 'load' });
        const data = await page.pdf({
          format: 'A4',
          displayHeaderFooter: true,
          printBackground: true,
          margin: { top: '30px', bottom: '120px', left: '70px', right: '70px' },
          headerTemplate: params.headerTemplate ?? '<div></div>',
          footerTemplate: params.footerTemplate ?? '<div></div>',
        });
        return Buffer.from(data);
      } finally {
        await page.close();
      }
    });
  }
}
