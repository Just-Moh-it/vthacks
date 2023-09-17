import { type Message } from "ai";
import { NextResponse } from "next/server";
import { type z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { env } from "~/env.mjs";
import { openai } from "~/lib/openai";
import {
  firstPipelineStepOpenaiFunctions,
  type metadataPropsSchema,
  videoPrompts,
} from "~/lib/video";

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Message[] };

  const prompt = videoPrompts.metadata;
  const metadata = await calculateVideoMetadata(
    messages,
    prompt,
    "get_metadata",
  );

  return NextResponse.json(metadata);
}

export async function calculateVideoMetadata(
  context: Message[],
  prompt: string,
  gtpFunction: keyof typeof firstPipelineStepOpenaiFunctions,
) {
  const currentContext: {
    role: string;
    content: string;
  }[] = context.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  currentContext.push({
    role: "system",
    content: prompt,
  });

  // Request the OpenAI API for the response based on the prompt
  console.log("Generating response...");
  const response = await openai.chat.completions.create({
    model: env.GPT_MODEL!,
    stream: false,
    messages: currentContext as any,
    // @ts-expect-error testing
    functions: Object.entries(firstPipelineStepOpenaiFunctions)
      .filter(([func]) => func === gtpFunction)
      .map(([key, value]) => ({
        name: key,
        parameters: zodToJsonSchema(value.schema, key).definitions![key],
      })),
  });
  console.log("Response", JSON.stringify(response, null, 2));
  console.log("\n\n\n");

  const args = response.choices?.[0]?.message.function_call?.arguments;
  if (!args) throw new Error("No arg");
  const json = JSON.parse(args);
  return json as z.infer<typeof metadataPropsSchema>;
}
