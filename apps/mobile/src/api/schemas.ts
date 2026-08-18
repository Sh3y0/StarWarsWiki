import { z } from 'zod';

export const databankImageSetSchema = z.object({
  desktop_2x1: z.string().optional(),
  desktop_16x9: z.string().optional(),
  desktop_4x3: z.string().optional(),
  desktop_1x1: z.string().optional(),
});

export const databankItemSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    short_desc: z.string().optional(),
    dynamic_desc: z.string().optional(),
    images: z
      .object({
        desktop: databankImageSetSchema.optional(),
      })
      .optional(),
    alt_text: z.string().optional(),
    href: z.string().optional(),
  })
  .passthrough();

export const characterListSchema = z.array(databankItemSchema);
