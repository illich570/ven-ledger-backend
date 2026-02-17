import { createApp } from './app.js';
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
const auth = createAuth({ emailService });

const documentRepository = new DrizzleDocumentRepository(getDatabase());
const getDocuments = new GetDocumentsUseCase(documentRepository);

const app = createApp({
  auth,
  logger,
  trustedOrigins: validConfig.trustedOrigins,
  getDocuments,
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
