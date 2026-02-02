import type { Request, Response } from 'express';
export const healthHandler = (_request: Request, response: Response) => {
  response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
};
