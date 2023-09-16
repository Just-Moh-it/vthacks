import { type AppType } from "next/app";
import localFont from "next/font/local";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { cn } from "~/lib/utils";
import Header from "~/components/header";
import { useRouter } from "next/router";

import React from "react";
import { type Message } from "ai";

import { useChat } from "ai/react";

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
  const { pathname } = useRouter();
  const chat = useChat({
    initialMessages: [],
  });

  return (
    <div
      className={cn(
        "h-full w-full font-sans text-xl font-normal",
        alpinaFont.className,
        romanaFont.className,
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
  );
};

export default api.withTRPC(MyApp);
