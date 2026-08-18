import { z } from 'zod';
import { DATABANK_CATEGORIES } from './databank.types';

export const categoryParamSchema = z.object({
  category: z.enum(DATABANK_CATEGORIES),
});

export const getItemsQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  slug: z.string().optional(),
});

export const databankItemSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    short_desc: z.string().optional(),
    dynamic_desc: z.string().optional(),
    alt_text: z.string().optional(),
    is_encyclopedia_entry: z.boolean().optional(),
    type: z.string().optional(),
    href: z.string().optional(),
  })
  .passthrough();

export const getItemsResponseSchema = z.array(databankItemSchema);

export const syncResponseSchema = z.object({
  category: z.enum(DATABANK_CATEGORIES),
  totalFetched: z.number(),
  updatedAt: z.string(),
  filePath: z.string(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
});
