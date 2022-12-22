import { z } from "zod";

export const oppCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  start: z.date(),
  end: z.date(),
  isChurch: z.boolean(),
  categories: z.array(z.string().min(1)),
  contact: z.string().optional(),
  url: z.string().optional(),
});

export const oppRateSchema = z.object({
  oppId: z.string(),
  rating: z.number().min(1).max(5),
});
