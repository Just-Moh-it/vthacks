import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { env } from "~/env.mjs";
import fs from "fs";
import path from "path";

export const elevenlabsRouter = createTRPCRouter({
  transcribe: publicProcedure
    .input(
      z.object({
        voiceId: z.string().optional().default("ewdB8Jn9FJaYMorleDYC"),
        text: z.string(),
      }),
    )
    .mutation(async ({ input: { voiceId, text } }) => {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "audio/mpeg",
            "xi-api-key": env.ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0,
              similarity_boost: 0,
              style: 0,
              use_speaker_boost: true,
            },
          }),
        },
      );

      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const file = Math.random().toString(36).substring(7);

      fs.writeFile(path.join("public", "audio", `${file}.mp3`), buffer, () => {
        console.log("File written successfully");
      });

      return { url: `/${file}.mp3` };
    }),
});
