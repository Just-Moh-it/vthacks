import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const unsplasRouter = createTRPCRouter({
  searchImage: publicProcedure
    .input(z.object({ query: z.string().optional() }))
    .mutation(async ({ input: { query } }) => {
      const res = await fetch(
        `https://api.unsplash.com/search/photos/?query=${query}`,
        {
          headers: {
            Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
          },
        },
      );

      if (!res.ok) throw new Error(`No ok ${res.status}`);

      const json = await res.json();
      return json;
    }),
});
