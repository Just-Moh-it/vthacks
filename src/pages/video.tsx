import ChatArea from "~/components/chat-area";
import { Player } from "@remotion/player";
import { type useChat } from "ai/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useEffect, useMemo, useState } from "react";
import { type InputProps } from "~/remotion/video";
import RemotionVideo from "~/remotion/video";
import { prefetch } from "remotion";

export default function Video(props: ReturnType<typeof useChat>) {
  const [inputProps, setInputProps] = useState<InputProps>({
    chapters: [
      {
        audioUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        faceVideoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        slides: [
          {
            type: "image",
            imageUrl:
              "https://images.unsplash.com/photo-1693155119174-4b6e79a27814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3132&q=80",
            durationInFrames: 100,
          },
        ],
      },
      {
        audioUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        faceVideoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        slides: [
          {
            type: "title",
            title: "Toxic ex wifey",
            durationInFrames: 100,
          },
        ],
      },
      {
        audioUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        faceVideoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        slides: [
          {
            type: "titleAndCaption",
            title: "Toxic ex wifey",
            caption: "(like fr bro)",
            durationInFrames: 100,
          },
        ],
      },
      {
        audioUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        faceVideoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        slides: [
          {
            type: "quoteAndAuthor",
            quote:
              "“When it is cool... it is awesome too, just like how to see people and stuff like that”",
            authorName: "John Dalton",
            durationInFrames: 100,
          },
        ],
      },
      {
        audioUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        faceVideoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        slides: [
          {
            type: "imageAndTitleAndPoints",
            imageUrl:
              "https://images.unsplash.com/photo-1693155119174-4b6e79a27814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3132&q=80",
            points: [
              "It’s cool",
              "It looks great!",
              "It is awesome!",
              "It is cool!",
            ],
            title: "Why make it?",
            durationInFrames: 100,
          },
        ],
      },
    ],
  });

  const onPause = () => {
    // setMessages([
    //   {
    //     id: "temp_system_prompt",
    //     role: "system",
    //     content:
    //       "The user has been watching a video up until now. The previous messages that have been sent are exactly what the videos were about. The user has now paused the video. If they ask a question, they are most likely confused about the video.",
    //   },
    //   ...messages,
    // ]);
  };

  const onUnPause = () => {
    // setMessages(
    //   messages.filter((message) => message.id !== "temp_system_prompt"),
    // );
  };

  const jumpToChapter = (id: string) => {
    //If the chapter is in the current message array, remove all messages after it.
    //if it is not already in the array, add it to the array and all messages before it.
  };

  useEffect(() => {
    console.log("Changed");
    inputProps.chapters.forEach((chapter) => {
      [
        chapter.audioUrl,
        chapter.faceVideoUrl,
        ...chapter.slides.map((slide) => "imageUrl" in slide && slide.imageUrl),
      ]
        .flatMap((item) => (item ? [item] : []))
        .forEach((url) => {
          try {
            prefetch(url);
            console.info("Prefetch worked", url);
          } catch (err) {
            console.warn("Prefetch failed for asset", url);
          }
        });
    });
  }, [inputProps.chapters]);

  const totalDurationInFrames = useMemo(
    () =>
      inputProps.chapters.reduce((agg, { slides }) => {
        const slidesAggDur = slides.reduce(
          (aggSlide, { durationInFrames }) => aggSlide + durationInFrames,
          0,
        );
        return agg + slidesAggDur;
      }, 0) || 1,
    [inputProps],
  );

  return (
    <div className="flex aspect-[16/10.5] min-h-0 w-full  grid-cols-3 grid-rows-3 items-stretch gap-7 pb-16">
      <div className="flex flex-col gap-7">
        {/* Video player */}
        <div className="col-span-2 row-span-2  aspect-video min-w-[750px] shrink-0 overflow-hidden rounded-2xl bg-[#F9F1F7]">
          <Player
            controls
            fps={30}
            durationInFrames={totalDurationInFrames}
            component={RemotionVideo}
            compositionHeight={1080}
            compositionWidth={1920}
            style={{ width: "100%", height: "100%" }}
            inputProps={inputProps}
          />
        </div>

        {/* Chapters area */}
        <div className="col-span-2 row-span-1 grow rounded-2xl bg-[#F9F1F7]"></div>
      </div>

      {/* Chat-area */}
      <ScrollArea className="col-span-1 row-span-3 min-h-0 grow overflow-y-auto overflow-x-hidden rounded-2xl bg-[#F9F1F7]">
        <ChatArea {...props} />
      </ScrollArea>
    </div>
  );
}

const Comp = () => {
  return <h1 className="text-xl">Hello worl</h1>;
};
