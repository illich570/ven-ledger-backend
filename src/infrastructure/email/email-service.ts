import { Resend } from 'resend';

import type { EmailServicePort } from '../../domain/ports/email-service.port.js';

export class ResendEmailService implements EmailServicePort {
  private readonly resend: Resend;

  constructor(
    apiKey: string,
    private readonly from: string,
  ) {
    this.resend = new Resend(apiKey);
  }

  async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ id: string }> {
    const { data, error } = await this.resend.emails.send({
      from: this.from,
      ...params,
    });
    if (error) throw error;
    return data as { id: string };
  }
}
