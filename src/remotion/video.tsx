import { useCallback } from "react";
import { Audio, Series, Video } from "remotion";
import { type z } from "zod";
import ImageSlide from "~/remotion/slideComponents/image";
import ImageAndTitleAndPointsSlide from "~/remotion/slideComponents/imageAndTitleAndPoints";
import QuoteAndAuthorSlide from "~/remotion/slideComponents/quote";
import TitleSlide from "~/remotion/slideComponents/title";
import TitleAndCaption from "~/remotion/slideComponents/titleAndCaption";
import { type slideSchema } from "~/types/lisa-json";

export type InputProps = {
  chapters: {
    slides: {
      slideLayout: z.infer<typeof slideSchema>;
      durationInFrames: number;
      audioUrl: string;
      faceVideoUrl?: string;
      script?: string;
    }[];
  }[];
};

export default function VideoComp(inputProps: InputProps) {
  const getSlide = useCallback(
    (slide: InputProps["chapters"][number]["slides"][number]) => {
      console.log("")
      switch (slide.slideLayout.type) {
        case "image":
          return <ImageSlide {...slide.slideLayout} />;
        case "imageAndTitleAndPoints":
          return <ImageAndTitleAndPointsSlide {...slide.slideLayout} />;
        case "quoteAndAuthor":
          return <QuoteAndAuthorSlide {...slide.slideLayout} />;
        case "title":
          return <TitleSlide {...slide.slideLayout} />;
        case "titleAndCaption":
          return <TitleAndCaption {...slide.slideLayout} />;
      }
    },
    [],
  );

  return (
    <Series>
      {inputProps.chapters.map((chapter, i) => (
        <Series.Sequence
          key={i}
          durationInFrames={
            chapter.slides.reduce((agg, { durationInFrames }) => {
              return agg + durationInFrames;
            }, 1) || 1
          }
        >
          <Series>
            {chapter.slides.map((slide, a) => (
              <Series.Sequence
                key={a}
                durationInFrames={slide.durationInFrames}
              >
                <Audio src={slide.audioUrl} />
                {slide.faceVideoUrl && (
                  <Video
                    src={slide.faceVideoUrl}
                    className="absolute bottom-10 right-10 z-30 h-[400px] w-[400px] rounded-full object-cover object-center"
                  />
                )}
                {getSlide(slide)}
              </Series.Sequence>
            ))}
          </Series>
        </Series.Sequence>
      ))}
    </Series>
  );
}
