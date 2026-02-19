import type { Request, Response } from 'express';

export function publicPingHandler(_request: Request, response: Response): void {
  response.json({
    message: 'pong',
    public: true,
    timestamp: new Date().toISOString(),
  });
}

export function privateMeHandler(request: Request, response: Response): void {
  if (!request.auth) {
    response.status(401).json({ status: 'error', message: 'Unauthorized' });
    return;
  }
  response.json({
    user: request.auth.user,
    session: {
      id: request.auth.session.id,
      expiresAt: request.auth.session.expiresAt,
    },
  });
}

export function adminOnlyHandler(request: Request, response: Response): void {
  response.json({
    message: 'Admin access granted',
    role: request.auth?.user?.role,
    timestamp: new Date().toISOString(),
  });
}

export function accountantOnlyHandler(
  request: Request,
  response: Response,
): void {
  response.json({
    message: 'Accountant access granted',
    role: request.auth?.user?.role,
    timestamp: new Date().toISOString(),
  });
}
