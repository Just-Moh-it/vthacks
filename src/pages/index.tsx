import { LoadingScreen } from "~/components/loading";
import { useState } from "react";
import ChatArea from "~/components/chat-area";
import { type useChat } from "ai/react";
import { useZustandStore } from "~/store";

export default function Home(props: ReturnType<typeof useChat>) {
  const { isCreatingVideo } = useZustandStore(({ isCreatingVideo }) => ({
    isCreatingVideo,
  }));
  if (isCreatingVideo) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ChatArea {...props} />
    </>
  );
}
