import ChatArea from "~/components/chat-area";
import shallow from "zustand/shallow";
import { Player } from "@remotion/player";
import { type useChat } from "ai/react";
import { ScrollArea } from "~/components/ui/scroll-area";

export default function Video(props: ReturnType<typeof useChat>) {
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

  return (
    <div className="flex aspect-[16/10.5] min-h-0 w-full  grid-cols-3 grid-rows-3 items-stretch gap-7 pb-16">
      <div className="flex flex-col gap-7">
        {/* Video player */}
        <div className="col-span-2 row-span-2  aspect-video min-w-[750px] shrink-0 overflow-hidden rounded-2xl bg-[#F9F1F7]">
          <Player
            controls
            fps={30}
            durationInFrames={40 * 30}
            component={Comp}
            compositionHeight={1080}
            compositionWidth={1920}
            style={{ width: "100%", height: "100%" }}
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
