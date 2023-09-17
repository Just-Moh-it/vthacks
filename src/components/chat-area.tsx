import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRef, useState } from "react";
import { api } from "~/utils/api";
import { type useChat } from "ai/react";
import { cn } from "~/lib/utils";
import Image from "next/image";
import "~/styles/latex.min.css";
import Latex from "react-latex-next";
import { useReplicatePrediction } from "~/lib/hooks/useReplicate";

export default function ChatArea({
  messages,
  handleSubmit,
  handleInputChange,
  input,
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
  const { mutate: mutateUnsplash } = api.unsplash.searchImage.useMutation({
    onSuccess: (dat) => console.log("Unsplash", dat),
  });
  const { createPredictionMutate } = useReplicatePrediction({});
  const predicted = useRef(false);
  const [currentPrediction, setCurrentPrediction] = useState("");

  return (
    <>
      <div
        className="relative flex h-full grow flex-col gap-8 p-7"
        id="conversation-container"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "relative max-w-[75%]",
              m.role === "user"
                ? "flex items-end self-end rounded-xl bg-[#EED9E6] p-3 text-right h-auto"
                : "self-start text-left",
            )}
          >
            {m.role == "assistant" ? (
              <div className="absolute left-0 top-0 mr-4 overflow-hidden rounded-full bg-red-500">
                <Image
                  src="/lisapfp.png"
                  alt="lisa's pfp"
                  width={100}
                  height={100}
                  className="h-11 w-11"
                />
              </div>
            ) : (
              <></>
            )}
            <div
              className={
                m.role == "assistant" ? "ml-12 rounded-xl bg-[#F9F1F7] p-3" : ""
              }
            >
              {m.content.split("\n").map((line) => (
                <div key={Math.random()}>
                  <Latex>{line}</Latex>
                  {line == "" ? <br /> : <></>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
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
            className="absolute right-[2px] top-1/2 -translate-y-1/2 text-background hover:bg-[#EED9E6]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M5.36328 12.0523C4.01081 11.5711 3.33457 11.3304 3.13309 10.9655C2.95849 10.6492 2.95032 10.2673 3.11124 9.94388C3.29694 9.57063 3.96228 9.30132 5.29295 8.76272L17.8356 3.68594C19.1461 3.15547 19.8014 2.89024 20.2154 3.02623C20.5747 3.14427 20.8565 3.42608 20.9746 3.7854C21.1106 4.19937 20.8453 4.85465 20.3149 6.16521L15.2381 18.7078C14.6995 20.0385 14.4302 20.7039 14.0569 20.8896C13.7335 21.0505 13.3516 21.0423 13.0353 20.8677C12.6704 20.6662 12.4297 19.99 11.9485 18.6375L10.4751 14.4967C10.3815 14.2336 10.3347 14.102 10.2582 13.9922C10.1905 13.8948 10.106 13.8103 10.0086 13.7426C9.89876 13.6661 9.76719 13.6193 9.50407 13.5257L5.36328 12.0523Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </Button>
        </div>

        <p
          className="block text-center text-sm text-[#A6A19F]"
          onClick={async () => {
            // videoMetadataTest.mutate({ messages })}
            const res = await fetch("/api/elevenlabs", {
              method: "POST",
              headers: {
                accept: "audio/mpeg",
              },
              body: JSON.stringify({
                text: "Hey, just audio testing",
              }),
            });

            const data = await res.text();
            console.log("Dat", data);
          }}
        >
          Made for VTHacks-11: Not ready for production use
        </p>
      </form>
    </>
  );
}
