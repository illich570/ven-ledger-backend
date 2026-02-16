import { Resend } from 'resend';

import { validConfig } from '../../config.js';

const resend = new Resend(validConfig.resendApiKey);

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  const { data, error } = await resend.emails.send({
    from: validConfig.emailFrom,
    ...params,
  });
  if (error) throw error;
  return data;
}
