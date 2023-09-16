import { LoadingScreen } from "~/components/loading";
import { useState } from "react";
import ChatArea from "~/components/chat-area";
import { type useChat } from "ai/react";

export default function Home(props: ReturnType<typeof useChat>) {
  const [isThinking, setIsThinking] = useState(false);
  if (isThinking) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ChatArea {...props} />
    </>
  );
}
