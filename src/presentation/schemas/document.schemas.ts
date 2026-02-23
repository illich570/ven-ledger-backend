import { z } from 'zod';

export const generateDocumentBodySchema = z.object({
  documentHolderId: z.string().min(1),
  title: z.string().min(4),
});
