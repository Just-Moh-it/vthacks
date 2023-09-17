import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import Replicate from "replicate";
import { env } from "~/env.mjs";

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

export const replicateRouter = createTRPCRouter({
  createPrediction: publicProcedure
    .input(
      z.object({
        source_image: z.string(),
        driven_audio: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await replicate.predictions.create({
        version:
          "3aa3dac9353cc4d6bd62a8f95957bd844003b401ca4e4a9b33baa574c549d376",
        input: {
          source_image: input.source_image,
          driven_audio: input.driven_audio,
        },
      });

      return response;
    }),
  getPrediction: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id } }) => {
      const response = await replicate.predictions.get(id);
      return response;
    }),
});
