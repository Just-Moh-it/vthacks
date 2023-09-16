import { AbsoluteFill } from "remotion";
import { type z } from "zod";
import { type quoteAndAuthorSlideSchema } from "~/types/lisa-json";

export default function QuoteAndAuthorSlide({
  authorName,
  quote,
  type,
}: z.infer<typeof quoteAndAuthorSlideSchema>) {
  return (
    <AbsoluteFill className="flex-col items-center justify-center gap-16 text-center font-display">
      <h1 className="text-[80px] leading-[120px]">{quote}</h1>
      <p className="text-[80px] leading-[102px] text-foreground/60">
        - {authorName}
      </p>
    </AbsoluteFill>
  );
}
