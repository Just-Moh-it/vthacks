import { Img } from "remotion";
import { type z } from "zod";
import { type imageSlideSchema } from "~/types/lisa-json";

export default function ImageSlide({
  stockImageUrl,
}: z.infer<typeof imageSlideSchema>) {
  return (
    <>
      {stockImageUrl && (
        <Img
          src={stockImageUrl}
          className="h-full w-full object-cover object-center"
        />
      )}
    </>
  );
}
