import { CloudflareFileStorageService } from '#infrastructure/file-storage/cloudflare-file-service.js';
import { PuppeteerBrowserManager } from '#infrastructure/pdf/puppeteer-browser.manager.js';
import { PuppeteerPdfGeneratorService } from '#infrastructure/pdf/puppeteer-pdf-generator.service.js';
import { Semaphore } from '#infrastructure/pdf/semaphore.js';
import { EtaTemplateRendererService } from '#infrastructure/templates/eta-template-renderer.service.js';

import { createApp } from './app.js';
import { GenerateDocumentUseCase } from './application/use-cases/generate-document.use-case.js';
import { GetDocumentsUseCase } from './application/use-cases/get-documents.use-case.js';
import { validConfig } from './config.js';
import { createAuth } from './infrastructure/auth/auth.js';
import {
  closeDatabase,
  getDatabase,
  initializeDatabase,
} from './infrastructure/database/database.js';
import { DrizzleDocumentRepository } from './infrastructure/database/repositories/document.repository.js';
import { ResendEmailService } from './infrastructure/email/email-service.js';
import logger from './infrastructure/logger/pino-logger.js';

await initializeDatabase();

const emailService = new ResendEmailService(
  validConfig.resendApiKey,
  validConfig.emailFrom,
);
const r2Client = new CloudflareFileStorageService(
  validConfig.cloudflareAccountId,
  validConfig.accessKeyId,
  validConfig.secretAccessKey,
);
const browserManager = new PuppeteerBrowserManager(
  validConfig.puppeteerExecutablePath,
);
const semaphore = new Semaphore(validConfig.pdfMaxConcurrency);
const pdfGenerator = new PuppeteerPdfGeneratorService(
  browserManager,
  semaphore,
);
const templateRenderer = new EtaTemplateRendererService(
  validConfig.templateViewsDir,
);
const auth = createAuth({ emailService });

const documentRepository = new DrizzleDocumentRepository(getDatabase());
const getDocuments = new GetDocumentsUseCase(documentRepository);
const generateDocument = new GenerateDocumentUseCase(
  documentRepository,
  pdfGenerator,
  templateRenderer,
  r2Client,
  validConfig.bucketName,
);

const app = createApp({
  auth,
  logger,
  trustedOrigins: validConfig.trustedOrigins,
  getDocuments,
  generateDocument,
});

const server = app.listen(validConfig.port, () => {
  logger.info(`Server alive! Running on PORT: ${validConfig.port}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await closeDatabase();
    logger.info('HTTP server and database pool closed');
  });
});
