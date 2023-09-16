import { AbsoluteFill, Img } from "remotion";
import { type z } from "zod";
import { type imageAndTitleAndPointsSlideSchema } from "~/types/lisa-json";

export default function ImageAndTitleAndPoints({
  imageUrl,
  title,
  points,
}: z.infer<typeof imageAndTitleAndPointsSlideSchema>) {
  return (
    <AbsoluteFill className="flex-row bg-white">
      <Img
        src={imageUrl}
        className="aspect-[16/11] h-[64%] object-cover object-center"
      />
      <div className="flex flex-col gap-12">
        <h1 className="text-5xl">{title}</h1>
        <div className="flex flex-col items-start gap-10">
          {points.map((point) => (
            <h1 key={point}>{point}</h1>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}
