import pino from 'pino';

import { validConfig } from '../../config.js';
const __dirname = import.meta.dirname;

let logger: pino.Logger;

if (validConfig.env === 'development') {
  const transport = pino.transport({
    targets: [
      {
        target: 'pino-pretty',
        options: { destination: 1 },
      },
      {
        target: 'pino/file',
        options: { destination: `${__dirname}/${validConfig.logFile}` },
      },
    ],
  });

  logger = pino(
    {
      level: validConfig.logLevel,
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    transport,
  );
} else {
  logger = pino({
    level: validConfig.logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

export default logger;
