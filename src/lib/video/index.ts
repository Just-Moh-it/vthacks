import { type ZodObject, z } from "zod";
import { prepareFunction } from "~/lib/utils";

export const metadataPropsSchema = z.object({
  title: z.string().describe("Title about the main topic of the conversation."),
  chapters: z
    .array(
      z.object({
        chapter_title: z
          .string()
          .describe(
            "1 - 4 word title for the chapter which summarizes the chapter.",
          ),
        chapter_topics: z
          .array(z.string())
          .describe("2 - 5 talking points which encompass the topic."),
      }),
    )
    .describe(
      "3 different chapters which split up the main point of the conversation into easier to follow sections.",
    ),
});

export const chapterScriptsPropsSchema = z.object({
  chapters: z
    .object({
      slides: z
        .object({
          script: z
            .string()
            .describe(
              "What the video host should say when presenting the slide.",
            ),
          slideLayout: slideSchema.describe(
            "The best possible layout for the slides based on what is being said",
          ),
        })
        .array(),
    })
    .array(),
});

export const firstPipelineStepOpenaiFunctions = {
  // @ts-expect-error type
  get_metadata: prepareFunction({ schema: metadataPropsSchema }),
  // @ts-expect-error type
  get_chapter_scripts: prepareFunction({ schema: chapterScriptsPropsSchema }),
};

export const videoPrompts = {
  metadata: `You are creating metadata for a video presentation. You will use your current conversation with the user to create a presentation that will help answer their questions. Give me the following in JSON format which is compatible with the below interface:

  metadataProps {
      title: string,
      chapters: [
          {
              chatper_title: string,
              chapter_topics: string[]
          }
      ]
  }

  A short title that describes the current topic.

  3 different chapters (each one covering a main point in the current conversation). Each chapter should contain a title which is 1 - 4 words and summarizes the chapter. They should also include 2 - 5 takling points which will later be used to create speaker notes for the video. These talking points should completely encompass the topic.

  Do not add any prose, be clear and concise with your topics and descriptions.
  `,
  chapterScripts: `You are part of an online AI tutor app, and you create videos for students to learn certain topics. You are creating scripts for a video presentation. You will use your current conversation with the user to create a presentation based on the the chapter outline. The chapter outline contains relevant information about each chapter and the chapters topics.

  Chapter outline:
  \`\`\`
  {replaceme.metadata}
  \`\`\`
  
  
  
  Your output must be compliant with the following interface:
  \`\`\`
  {
    chapters: [
      slides: [
        {
          script: string;
          slideLayout: {
            type: "title";
            title: string;
          } | {
            type: "titleAndCaption";
            title: string;
            caption: string;
          } | {
            type: "image";
            stockImageQuery: string;
          } | {
            type: "imageAndTitleAndPoints";
            stockImageQuery: string;
            title: string;
            points: string[];
          } | {
            type: "quoteAndAuthor";
            quote: string;
            authorName: string;
          };
        }
      ]
    ]
  }
  \`\`\`
  There should be three entries in the chapters array. Each of these intros should have 3 - 6 slides. None of these slides should include an introduction to the chapter. You should start explaining the topic on Chap N slide 1, and finish explaining it on Chap N slide [length - 1]. Chapter 1 slide 1 should start with "Welcome to..." None of the other slides should every start with "Welcome to...". None of the other slides should have an introduction, they should all immediately start their topic.
  
  Generate the chapter scripts. Each slide should have between 3 and 10 sentences. This script should be detailed but also concice.
  Slide layouts should include all the arguments that come with their corresponding type or are included in the name.
  For stockImageQuery, come up with a short search query that will be used with a stock image database to get an image for the slide. Image queries should not be super specific since stock images for specific queries are hard to find. Keep them broad and oriented to find images that are related to the topic and not the exact topic itself.
  
  You MUST include a script, a slide template, and the args for each slide template.`,
};

import OpenAI from "openai";
import { type Message } from "ai";
import { env } from "~/env.mjs";
import zodToJsonSchema from "zod-to-json-schema";
import { slideSchema } from "~/types/lisa-json";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY!,
});
