import { z } from 'zod';

export const listSchema = z.object({
  search: z.string().optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
});
