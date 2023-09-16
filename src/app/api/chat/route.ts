import OpenAI from "openai";
import { type Message, OpenAIStream, StreamingTextResponse } from "ai";
import { systemPrompt } from "~/lib/constants";
import { env } from "~/env.mjs";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = (await req.json()) as { messages: Message[] };

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      // @ts-expect-error untyped
      ...messages,
    ],
    // functions: [
    //   {
    //     name: "create_video",
    //     parameters: {},
    //     description:
    //       "When the person asks to explain or give a summary of the topic",
    //   },
    // ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
