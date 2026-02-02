import { pinoHttp } from 'pino-http';

import { createServer } from './app.js';
import logger from './infrastructure/logger/pino-logger.js';
import { errorHandler } from './presentation/middleware/error-handler.js';
import { healthRouter } from './presentation/routes/health.routes.js';
const port = Number(process.env.PORT) || 3000;
const app = createServer();
app.use(
  pinoHttp({
    logger,
  }),
);

app.use(healthRouter);

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server alive! Running on PORT: ${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
