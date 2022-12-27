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

export const oppEditSchema = z.object({
  id: z.string().min(1),
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

export const INTERESTS = [
  "church",
  "teaching",
  "children",
  "environment",
  "tech",
  "physical",
] as const;

export const interestsSchema = z.object({
  interests: z.enum(INTERESTS).array(),
});

export const interestFormSchema = z.object({
  church: z.boolean(),
  teaching: z.boolean(),
  children: z.boolean(),
  environment: z.boolean(),
  tech: z.boolean(),
  physical: z.boolean(),
});
