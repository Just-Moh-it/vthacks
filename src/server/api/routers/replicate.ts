import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ReplicateStream, StreamingTextResponse } from "ai";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "",
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
    .mutation(({ input: { id } }) => {
      console.log("id", id);
    }),
});
