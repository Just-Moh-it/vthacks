import OpenAI from "openai";
import { type Message, OpenAIStream, StreamingTextResponse } from "ai";
import { systemPrompt } from "~/lib/constants";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const predictionRouter = createTRPCRouter({
  predict: publicProcedure
    .input(z.object({ previousQuestion: z.string() }))
    .mutation(async ({ input }) => {
      const nextPrediction = await predict(input.previousQuestion);
      if (nextPrediction?.content) {
        return {
          nextPrediction: nextPrediction.content,
        };
      }

      return {
        nextPrediction: "What would you like to know?",
      };
    }),
});

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function predict(previousQuestion: string) {
  // Extract the `messages` from the body of the request

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "You helping a user as a tutor. The user previously asked a question and your job is to predict what question they will ask next. Keep it extrmely generic and relevant to the topic. It should not be longer than 9 words. Do not add quotes or special formatting, prefixes, or suffixes to your response. Only return the qestion without prose or explanation.",
      },
      { role: "user", content: previousQuestion },
    ],
  });

  // Respond with the stream
  return response.choices[0]?.message;
}
