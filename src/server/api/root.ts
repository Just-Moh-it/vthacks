import { predictionRouter } from "~/server/api/routers/predictQuestion";
import { createTRPCRouter } from "~/server/api/trpc";
import { replicateRouter } from "./routers/replicate";
import { unsplasRouter } from "~/server/api/routers/unsplash";
import { elevenlabsRouter } from "~/server/api/routers/elevenlabs";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  predictNextQuestion: predictionRouter,
  replicate: replicateRouter,
  unsplash: unsplasRouter,
  elevenlabs: elevenlabsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
