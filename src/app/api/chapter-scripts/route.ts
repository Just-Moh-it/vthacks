import { type z } from "zod";
import { type metadataPropsSchema } from "~/lib/video";
import { type Message } from "ai";
import { videoPrompts } from "~/lib/video";
import { calculateVideoMetadata } from "~/app/api/metadata/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages, metadata } = (await req.json()) as {
    messages: Message[];
    metadata: z.infer<typeof metadataPropsSchema>;
  };

  const chapterScripts = await getChapterScripts(messages, metadata);

  return chapterScripts;
}

async function getChapterScripts(
  context: Message[],
  metadata: z.infer<typeof metadataPropsSchema>,
) {
  const prompt = videoPrompts.chapterScripts.replaceAll(
    "{replaceme.metadata}",
    JSON.stringify(metadata, null, 2),
  );

  const chapterScripts = await calculateVideoMetadata(
    context,
    prompt,
    "get_chapter_scripts",
  );

  console.log("Chapter Scripts\n", JSON.stringify(chapterScripts, null, 2));

  return NextResponse.json(chapterScripts);
}
