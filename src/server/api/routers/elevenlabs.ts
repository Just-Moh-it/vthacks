import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const elevenlabsRouter = createTRPCRouter({
  createTTS: publicProcedure
    .input(
      z.object({
        voiceId: z.string().optional().default("ewdB8Jn9FJaYMorleDYC"),
        text: z
          .string()
          .optional()
          .default(
            "You can turn on latency optimizations at some cost of quality. The best possible final latency varies by model.",
          ),
      }),
    )
    .mutation(async ({ input: { voiceId, text } }) => {
      const data = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "audio/mpeg",
            "xi-api-key": env.ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text,
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

      const blob = await data.blob();

      // You can log the blob or perform any other operation on the blob.
      console.log(blob);
      return blob;
    }),
});
