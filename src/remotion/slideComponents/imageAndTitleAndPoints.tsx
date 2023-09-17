import { AbsoluteFill, Img } from "remotion";
import { type z } from "zod";
import { type imageAndTitleAndPointsSlideSchema } from "~/types/lisa-json";

export default function ImageAndTitleAndPointsSlide({
  stockImageQuery,
  title,
  points,
}: z.infer<typeof imageAndTitleAndPointsSlideSchema>) {
  return (
    <AbsoluteFill className="!flex-row gap-36 bg-white px-28 py-48">
      {stockImageQuery && (
        <Img
          src={stockImageQuery}
          className="h-[700px] w-[620px] object-cover object-center"
        />
      )}
      <div className="flex flex-col gap-16 font-display">
        <h1 className="text-[100px] leading-[127px]">{title}</h1>
        {points.map((point) => (
          <p className="text-[50px] leading-[64px]" key={point}>
            {point}
          </p>
        ))}
      </div>
    </AbsoluteFill>
  );
}
