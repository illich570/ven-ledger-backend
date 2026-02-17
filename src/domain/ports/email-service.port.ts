export interface EmailServicePort {
  sendEmail(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ id: string }>;
}
