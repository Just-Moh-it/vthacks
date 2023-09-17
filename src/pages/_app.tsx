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
    // {
    //   path: "fonts/KaTeX_AMS-Regular.woff2",
    //   weight: "normal",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_Caligraphic-Bold.woff2",
    //   weight: "700",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_Fraktur-Bold.woff2",
    //   weight: "700",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_Main-Bold.woff2",
    //   weight: "700",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_Main-BoldItalic.woff2",
    //   weight: "700",
    //   style: "italic",
    // },
    // {
    //   path: "fonts/KaTeX_Main-Regular.woff2",
    //   weight: "normal",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_SansSerif-Bold.woff2",
    //   weight: "700",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_SansSerif-Italic.woff2",
    //   weight: "400",
    //   style: "italic",
    // },
    // {
    //   path: "fonts/KaTeX_SansSerif-Regular.woff2",
    //   weight: "400",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_Script-Regular.woff2",
    //   weight: "normal",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_Size1-Regular.woff2",
    //   weight: "normal",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_Size2-Regular.woff2",
    //   weight: "normal",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_Size3-Regular.woff2",
    //   weight: "normal",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_Size4-Regular.woff2",
    //   weight: "normal",
    //   style: "normal",
    // },
    // {
    //   path: "fonts/KaTeX_Typewriter-Regular.woff2",
    //   weight: "normal",
    //   style: "normal",
    // },
  ],
  variable: "--font-alpina",
});
const romanaFont = localFont({
  src: [{ path: "./fonts/romana-bold.otf", weight: "700", style: "normal" }],
  variable: "--font-romana",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();
  const { mutateAsync: mutateAsyncTranscribe } =
    api.elevenlabs.transcribe.useMutation();
  const router = useRouter();

  const chat = useChat({
    initialMessages: [
      {
        role: "assistant",
        content:
          "Hey 👋, I'm Lisa - your AI tutor! I'm well versed in a wide variety of topics and I can answer almost any question you have. I can even create video 🎬 about your topic in order to better explain it, just ask!",
        id: "intro",
      },
      {
        role: "user",
        content:
          "Could you please explain what a derivative and integral is?$Aj",
        id: "jlkdajdl",
      },
      {
        role: "assistant",
        content: `Absolutely, let’s start with derivatives.
In calculus, a derivative measures how a function changes as its input changes. It represents the rate at which a quantity is changing at a given point. Loosely speaking, a derivative can be thought of as how much one quantity is changing in response to changes in some other quantity. The derivative of a function at a chosen input value describes the best linear approximation of the function near that input value.
For instance, the derivative of a function at a point is the slope of the line tangent to the curve at that point, where the derivative has a geometric interpretation as the instantaneous rate of change.
Next, limits.
In mathematics, a limit is the value that a function approaches as the input approaches some value. Limits are essential to calculus and mathematical analysis in general. They are used to define continuity, derivatives, and integral.
Limits can be defined for sequences, functions, and more complex mathematical objects. They can be evaluated from the left, from the right, or from both, and may equal to any real number, plus or minus infinity, and may also be undefined.
Limit can be thought of as the value a function approaches as we gather points “infinitely close” to the given point.
In a simple sense, derivatives tell us the rate of change whereas limits tell us the value a function approaches.`,
        id: "jlkjd",
      },
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
        defintions.call(fnArguments as any, mutateAsyncTranscribe, router);
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
