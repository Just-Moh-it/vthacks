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
    audioUrl: string;
    faceVideoUrl: string;
    slides: (z.infer<typeof slideSchema> & {
      durationInFrames: number;
    })[];
  }[];
};

export default function VideoComp(inputProps: InputProps) {
  const getSlide = useCallback(
    (slide: InputProps["chapters"][number]["slides"][number]) => {
      switch (slide.type) {
        case "image":
          return <ImageSlide {...slide} />;
        case "imageAndTitleAndPoints":
          return <ImageAndTitleAndPointsSlide {...slide} />;
        case "quoteAndAuthor":
          return <QuoteAndAuthorSlide {...slide} />;
        case "title":
          return <TitleSlide {...slide} />;
        case "titleAndCaption":
          return <TitleAndCaption {...slide} />;
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
          <Audio src={chapter.audioUrl} />
          <Video
            src={chapter.faceVideoUrl}
            className="absolute bottom-10 right-10 z-30 h-[400px] w-[400px] rounded-full object-cover object-center"
          />
          <Series>
            {chapter.slides.map((slide, a) => (
              <Series.Sequence
                key={a}
                durationInFrames={slide.durationInFrames}
              >
                {getSlide(slide)}
              </Series.Sequence>
            ))}
          </Series>
        </Series.Sequence>
      ))}
    </Series>
  );
}
