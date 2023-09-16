import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRef, useState, useEffect } from "react";
import { api } from "~/utils/api";
// import { useChat } from "~/lib/hooks/useChat";
import { type useChat } from "ai/react";
import { cn } from "~/lib/utils";
import Link from "next/link";

export default function ChatArea({
  messages,
  handleSubmit,
  handleInputChange,
  input
}: ReturnType<typeof useChat>) {
  const [promptInput, setPromptInput] = useState("");

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
      <div className="flex grow flex-col gap-8 p-7 h-full" id="conversation-container">
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
