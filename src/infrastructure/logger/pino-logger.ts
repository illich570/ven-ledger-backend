import pino from 'pino';
import serializers from 'pino-std-serializers';

import { validConfig } from '../../config.js';

const { err, req, res } = serializers;

const __dirname = import.meta.dirname;

const baseOptions: pino.LoggerOptions = {
  base: {
    service: validConfig.serviceName,
    env: validConfig.env,
    version: validConfig.appVersion,
  },
  level: validConfig.logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    err,
    req,
    res,
  },
};

let logger: pino.Logger;

if (validConfig.env === 'development') {
  const transport = pino.transport({
    targets: [
      { target: 'pino-pretty', options: { destination: 1 } },
      {
        target: 'pino/file',
        options: {
          destination: `${__dirname}/${validConfig.logFile}`,
        },
      },
    ],
  });

  logger = pino(baseOptions, transport);
} else if (validConfig.logtailSourceToken) {
  const transport = pino.transport({
    targets: [
      { target: 'pino/file', options: { destination: 1 } },
      {
        target: '@logtail/pino',
        options: { sourceToken: validConfig.logtailSourceToken },
      },
    ],
  });

  logger = pino(baseOptions, transport);
} else {
  logger = pino(baseOptions);
}

export default logger;
