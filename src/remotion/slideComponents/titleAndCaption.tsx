import { AbsoluteFill } from "remotion";
import { type z } from "zod";
import { type titleAndCaptionSlideSchema } from "~/types/lisa-json";

export default function TitleAndCaption({
  title,
  caption,
}: z.infer<typeof titleAndCaptionSlideSchema>) {
  return (
    <AbsoluteFill className="flex-col items-center justify-center gap-16 ">
      <h1 className="font-display text-[226px] leading-[280px]">{title}</h1>
      <p className="text-[110px] leading-[140px] text-foreground/60">
        {caption}
      </p>
    </AbsoluteFill>
  );
}
