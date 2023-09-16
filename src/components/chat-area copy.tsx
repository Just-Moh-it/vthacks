import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRef, useState } from "react";
import { api } from "~/utils/api";
// import { useChat } from "~/lib/hooks/useChat";
import { useChat } from "ai/react";
import { useZustandStore } from "~/store";
import { shallow } from "zustand/shallow";
import { cn } from "~/lib/utils";

export default function ChatArea() {
  const [promptInput, setPromptInput] = useState("");
  const { setMessages } = useZustandStore(
    ({ setMessages }) => ({ setMessages }),
    shallow,
  );
  const { messages, handleSubmit, input, handleInputChange } = useChat({
    onMessagesChange: (newMessages) => newMessages && setMessages(newMessages),
    initialMessages: [
      {
        id: "aksjdfkajsd",
        content:
          "I don't like it, I never liked it, and if this is all you're gonna text me over summer after radio silence from you then first and you, Rosie, e.t.c had be to be so absorbed in my romantic life, my personal life, my WHOLE FUCKING LIFE, you had to find pictures of me from YEARS AGO, FUCKING YEARS, to bring back and show me and everybody else because i was so fucking ugly and so fucking fat you guys couldnt just keep the shit ñto yourselves, everybody had to see, everyone had to know what i looked like in 5th to 6th grade having as much fun as possible, I wanted to make memories so I took pictures of myself making those memories, but for the same reason of you ass hats i stopped taking those pictures, my camera roll is purely screenshots, i dont take pictures of myself anymore because of people like yall, alright now I know I went on a tangent but this has been sitting in me for a while and now you out of the blue send me that shit, kinda makes me mad yknow? But really, don't text me, ask me to hop on house party, call me on here, e.t.c, ANY way of contacting me, if this is all you are gonna send",
        role: "user",
      },
      {
        id: "kksjdfkajsd",
        content:
          "I don't like it, I never liked it, and if this is all you're gonna text me over summer after radio silence from you then first and you, Rosie, e.t.c had be to be so absorbed in my romantic life, my personal life, my WHOLE FUCKING LIFE, you had to find pictures of me from YEARS AGO, FUCKING YEARS, to bring back and show me and everybody else because i was so fucking ugly and so fucking fat you guys couldnt just keep the shit ñto yourselves, everybody had to see, everyone had to know what i looked like in 5th to 6th grade having as much fun as possible, I wanted to make memories so I took pictures of myself making those memories, but for the same reason of you ass hats i stopped taking those pictures, my camera roll is purely screenshots, i dont take pictures of myself anymore because of people like yall, alright now I know I went on a tangent but this has been sitting in me for a while and now you out of the blue send me that shit, kinda makes me mad yknow? But really, don't text me, ask me to hop on house party, call me on here, e.t.c, ANY way of contacting me, if this is all you are gonna send",
        role: "assistant",
      },
      {
        id: "dajksaksjdfkajsd",
        content:
          "I don't like it, I never liked it, and if this is all you're gonna text me over summer after radio silence from you then first and you, Rosie, e.t.c had be to be so absorbed in my romantic life, my personal life, my WHOLE FUCKING LIFE, you had to find pictures of me from YEARS AGO, FUCKING YEARS, to bring back and show me and everybody else because i was so fucking ugly and so fucking fat you guys couldnt just keep the shit ñto yourselves, everybody had to see, everyone had to know what i looked like in 5th to 6th grade having as much fun as possible, I wanted to make memories so I took pictures of myself making those memories, but for the same reason of you ass hats i stopped taking those pictures, my camera roll is purely screenshots, i dont take pictures of myself anymore because of people like yall, alright now I know I went on a tangent but this has been sitting in me for a while and now you out of the blue send me that shit, kinda makes me mad yknow? But really, don't text me, ask me to hop on house party, call me on here, e.t.c, ANY way of contacting me, if this is all you are gonna send",
        role: "user",
      },
    ],
  });
  const { mutate, data, isLoading } =
    api.predictNextQuestion.predict.useMutation({
      onMutate: () => {
        predicted.current = true;
      },
      onSuccess(data) {
        if (data?.nextPrediction) {
          setCurrentPrediction(data?.nextPrediction);
        }
      },
    });
  const predicted = useRef(false);
  const [currentPrediction, setCurrentPrediction] = useState("");

  return (
    <>
      <div className="flex grow flex-col gap-8 p-7" id="conversation-container">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[75%]",
              m.role === "user"
                ? "flex items-end self-end rounded-xl bg-[#EED9E6] p-3 text-right"
                : "text-left",
            )}
          >
            {m.content}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
          mutate({ previousQuestion: input });
          setPromptInput("");
        }}
        className="sticky bottom-0 flex flex-col items-stretch gap-1 bg-gradient-to-t from-background to-background/90 pb-6 pt-3"
      >
        <div className="relative flex items-stretch rounded-full bg-white">
          <Input
            id="textinput"
            value={promptInput}
            onChange={(e) => {
              setPromptInput(e.target.value);
              handleInputChange(e);
            }}
            className="grow"
            placeholder={
              predicted.current
                ? isLoading
                  ? "Thinking..."
                  : data?.nextPrediction
                : "What would you like to know?"
            }
            onKeyDown={(e) => {
              if (
                e.key === "Tab" &&
                !isLoading &&
                promptInput === "" &&
                currentPrediction != ""
              ) {
                // Prevent the default action to stop focusing on the next element
                e.preventDefault();
                setPromptInput(currentPrediction);
                handleInputChange({
                  target: { value: currentPrediction },
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
          />
          <Button
            variant="secondary"
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground text-background"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={13}
              height={16}
              fill="none"
              className="fill-cream-500 transition-colors duration-300"
            >
              <path
                d="M.852 7.648a1.2 1.2 0 0 1 0-1.696l4.8-4.8a1.2 1.2 0 0 1 1.696 0l4.8 4.8a1.2 1.2 0 1 1-1.697 1.696L7.7 4.897V14a1.2 1.2 0 0 1-2.4 0V4.897L2.548 7.648a1.2 1.2 0 0 1-1.696 0Z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>

        <p className="block text-center text-sm text-[#A6A19F]">
          This is just a hackathon project and don’t use it for real things btw
        </p>
      </form>
    </>
  );
}