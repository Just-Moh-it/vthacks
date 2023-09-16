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
  imageUrl: z.string(),
});
export const imageAndTitleAndPointsSlideSchema = _baseSlideSchema.extend({
  type: z.literal("imageAndTitleAndPoints"),
  imageUrl: z.string(),
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
