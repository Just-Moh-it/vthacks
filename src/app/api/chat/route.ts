import { type Message, OpenAIStream, StreamingTextResponse } from "ai";
import { systemPrompt } from "~/lib/constants";
import { env } from "~/env.mjs";
import { openaiFunctions } from "~/lib/openaiFunctions";
import zodToJsonSchema from "zod-to-json-schema";
import { openai } from "~/lib/openai";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = (await req.json()) as { messages: Message[] };

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: env.GPT_MODEL!,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      // @ts-expect-error untyped
      ...messages,
    ],
    functions: Object.entries(openaiFunctions).map(([key, value]) => ({
      name: key,
      parameters: zodToJsonSchema(value.schema, key).definitions![
        key
      ] as Record<string, any>,
    })),
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
