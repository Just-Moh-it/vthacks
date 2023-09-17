import ChatArea from "~/components/chat-area";
import { Player } from "@remotion/player";
import { type useChat } from "ai/react";
import { useEffect, useMemo, useState } from "react";
import { type InputProps } from "~/remotion/video";
import RemotionVideo from "~/remotion/video";
import { prefetch } from "remotion";
import { useZustandStore } from "~/store";

const output = `
{
  "chapters": [
    {
      "slides": [
        {
          "script": "In calculus, a derivative measures how a function changes as its input changes.",
          "slideLayout": {
            "type": "title",
            "title": "Introduction to Derivatives"
          }
        },
        {
          "script": "In simpler terms, it's a measure of how a curve slopes at any given point. For instance, let's consider the function f(x) = x^2.",
          "slideLayout": {
            "type": "titleAndCaption",
            "title": "Definition of a derivative",
            "caption": "Visualizing derivatives"
          }
        },
        {
          "script": "The derivative of this function, denoted as f'(x) or df/dx, gives us 2x. This means, at any point x on the curve of f(x), the slope of the curve is 2x.",
          "slideLayout": {
            "type": "imageAndTitleAndPoints",
            "imageUrl": "derivative-fx.png",
            "title": "Geometric interpretation",
            "points": [
              "f'(x) = 2x",
              "At any point x, the slope is 2x"
            ]
          }
        },
        {
          "script": "Here's how you can compute the derivative of a function. If you have a function \`f(x)\` and you want to find the derivative of this function, you’d use the concept of limits.",
          "slideLayout": {
            "type": "titleAndCaption",
            "title": "Notation and terminology",
            "caption": "Calculating derivatives using limits"
          }
        }
      ]
    },
    {
      "slides": [
        {
          "script": "The rules for differentiation include the power rule, the product rule, the quotient rule, and the chain rule.",
          "slideLayout": {
            "type": "title",
            "title": "Differentiation Rules"
          }
        },
        {
          "script": "The power rule, for example, simplifies the process of differentiating any function that is a power of x.",
          "slideLayout": {
            "type": "titleAndCaption",
            "title": "Power rule",
            "caption": "Differentiating powers of x"
          }
        },
        {
          "script": "The product and quotient rules are used when differentiating functions that are the product or quotient of other functions.",
          "slideLayout": {
            "type": "imageAndTitleAndPoints",
            "imageUrl": "product-quotient-rule.png",
            "title": "Product and Quotient rule",
            "points": [
              "Product rule",
              "Quotient rule"
            ]
          }
        },
        {
          "script": "The chain rule is used when differentiating composite functions.",
          "slideLayout": {
            "type": "titleAndCaption",
            "title": "Chain rule",
            "caption": "Differentiating composite functions"
          }
        }
      ]
    },
    {
      "slides": [
        {
          "script": "Derivatives also have several practical applications. They can be used to determine rates of change, optimize functions, solve related rates problems, and graph functions.",
          "slideLayout": {
            "type": "title",
            "title": "Applications of Derivatives"
          }
        },
        {
          "script": "The derivative of a function can represent a physical quantity. For example, in physics, speed is the derivative of the position with respect to time.",
          "slideLayout": {
            "type": "titleAndCaption",
            "title": "Rate of change",
            "caption": "Derivatives in motion"
          }
        },
        {
          "script": "Derivatives are also used in optimization problems. In fact, the process of finding maxima or minima is fundamentally a calculus problem.",
          "slideLayout": {
            "type": "titleAndCaption",
            "title": "Optimization",
            "caption": "Finding maxima or minima"
          }
        },
        {
          "script": "In related rates problems, we use derivatives to relate the rates of change of two or more related quantities.",
          "slideLayout": {
            "type": "titleAndCaption",
            "title": "Related rates",
            "caption": "Relating rates of change"
          }
        },
        {
          "script": "Lastly, graphing functions often involves the determination of critical points and inflection points, which are obtained using the first and second derivative respectively.",
          "slideLayout": {
            "type": "titleAndCaption",
            "title": "Graphing functions",
            "caption": "Using derivatives to graph functions"
          }
        }
      ]
    }
  ]
}`;

export default function Video(props: ReturnType<typeof useChat>) {
  const { inputProps } = useZustandStore(({ inputProps }) => ({ inputProps }));

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
        ...chapter.slides.flatMap((slide) => [
          "stockImageUrl" in slide && slide.stockImageUrl,
          slide.audioUrl,
          slide.faceVideoUrl,
        ]),
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
      <div className="col-span-1 row-span-3 min-h-0 grow overflow-y-auto overflow-x-hidden rounded-2xl bg-[#F9F1F7]">
        <ChatArea {...props} />
      </div>
    </div>
  );
}

const Comp = () => {
  return <h1 className="text-xl">Hello worl</h1>;
};
