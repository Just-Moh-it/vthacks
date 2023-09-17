import { z } from "zod";

export const _baseSlideSchema = z.object({});

export const titleSlideSchema = _baseSlideSchema.extend({
  type: z.literal("title"),
  title: z.string(),
});
export const titleAndCaptionSlideSchema = _baseSlideSchema.extend({
  type: z.literal("titleAndCaption"),
  title: z.string(),
  caption: z.string(),
});
export const imageSlideSchema = _baseSlideSchema.extend({
  type: z.literal("image"),
  stockImageQuery: z
    .string()
    .describe(
      "A very broad search query, like 'blue chemical' instead of 'Copper Sulphide'",
    )
    .optional(),
  stockImageUrl: z.string().url().optional(),
});
export const imageAndTitleAndPointsSlideSchema = _baseSlideSchema.extend({
  type: z.literal("imageAndTitleAndPoints"),
  stockImageQuery: z
    .string()
    .describe(
      "A very broad search query, like 'blue chemical' instead of 'Copper Sulphide'",
    )
    .optional(),
  stockImageUrl: z.string().url().optional(),
  title: z.string(),
  points: z.string().array().min(3).max(5),
});
export const quoteAndAuthorSlideSchema = _baseSlideSchema.extend({
  type: z.literal("quoteAndAuthor"),
  quote: z.string(),
  authorName: z.string(),
});

export const slideSchema = z.union([
  titleSlideSchema,
  titleAndCaptionSlideSchema,
  imageSlideSchema,
  imageAndTitleAndPointsSlideSchema,
  quoteAndAuthorSlideSchema,
]);
