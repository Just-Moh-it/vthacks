import { type AppType } from "next/app";
import localFont from "next/font/local";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { cn } from "~/lib/utils";
import Header from "~/components/header";
import { useRouter } from "next/router";

import React from "react";

import { useChat } from "ai/react";
import { openaiFunctions } from "~/lib/openaiFunctions";
import { toast } from "~/components/ui/use-toast";
import { type ChatRequest, nanoid } from "ai";
import { useZustandStore } from "~/store";

const alpinaFont = localFont({
  src: [
    {
      path: "./fonts/alpina-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/alpina-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/alpina-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/alpina-italic.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-alpina",
});
const romanaFont = localFont({
  src: [{ path: "./fonts/romana-bold.otf", weight: "700", style: "normal" }],
  variable: "--font-romana",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname, push } = useRouter();
  const { mutateAsync: mutateAsyncTranscribe } =
    api.elevenlabs.transcribe.useMutation();
  const { mutateAsync: mutateAsyncUnsplash } =
    api.unsplash.searchImage.useMutation();

  const chat = useChat({
    initialMessages: [
      {
        role: "assistant",
        content:
          "Hey 👋, I'm Lisa - your AI tutor! I'm well versed in a wide variety of topics and I can answer almost any question you have. I can even create video 🎬 about your topic in order to better explain it, just ask!",
        id: "intro",
      }
    ],
    experimental_onFunctionCall: (chatMessages, functionCall) => {
      useZustandStore.setState({ messagesMaybeOutOfSync: chatMessages });
      const fn = Object.entries(openaiFunctions).find(
        ([name]) => name === functionCall.name,
      );
      if (!fn) {
        return toast({
          variant: "destructive",
          title: "Unable to fulfill your query",
          description:
            "The function which lisa executed was not defined. Please try again.",
        });
      }
      const [, defintions] = fn;
      const unsafeFunctionCallArgumentsParsingResult =
        functionCall.arguments &&
        defintions.schema.safeParse(JSON.parse(functionCall.arguments));

      if (
        !unsafeFunctionCallArgumentsParsingResult ||
        !unsafeFunctionCallArgumentsParsingResult.success
      ) {
        return toast({
          variant: "destructive",
          title: "Could not execute the command",
          description:
            "The function arguments did not match the intended shape. Please try again.",
        });
      }
      const fnArguments = unsafeFunctionCallArgumentsParsingResult.data;

      try {
        defintions.call(
          fnArguments as any,
          mutateAsyncTranscribe,
          push,
          mutateAsyncUnsplash,
        );
      } catch (err) {
        console.error("Error executing function", err);
      }

      const functionResponse: ChatRequest = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: functionCall.name,
            role: "function" as const,
            content: JSON.stringify(fnArguments),
          },
        ],
      };
      return functionResponse;
    },
  });

  return (
    <>
      <div
        className={cn(
          "h-full w-full font-sans text-xl font-normal",
          alpinaFont.variable,
          romanaFont.variable,
        )}
      >
        <div className="relative flex h-full max-h-screen w-full flex-col items-stretch gap-2 px-12">
          <Header />

          <main
            className={cn(
              "mx-auto flex h-max w-full grow flex-col items-stretch gap-2 rounded",
              pathname === "/"
                ? "max-w-[900px]"
                : "min-h-0 max-w-[1200px] justify-center",
            )}
          >
            <Component {...pageProps} {...chat} />
          </main>
        </div>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
