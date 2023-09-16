import { Img } from "remotion";
import { type z } from "zod";
import { type imageSlideSchema } from "~/types/lisa-json";

export default function ImageSlide({
  imageUrl,
}: z.infer<typeof imageSlideSchema>) {
  return (
    <>
      <Img
        src={imageUrl}
        className="h-full w-full object-cover object-center"
      />
    </>
  );
}
