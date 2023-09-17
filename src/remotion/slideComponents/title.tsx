import { AbsoluteFill } from "remotion";
import { type z } from "zod";
import { type titleSlideSchema } from "~/types/lisa-json";

export default function TitleSlide({
  title,
}: z.infer<typeof titleSlideSchema>) {
  return (
    <AbsoluteFill className="items-center justify-center text-center bg-white">
      <h1 className=" font-display text-[226px] leading-[288px]">{title}</h1>
    </AbsoluteFill>
  );
}
