import { z } from "zod";
import { prepareFunction } from "~/lib/utils";
import {
  type chapterScriptsPropsSchema,
  type metadataPropsSchema,
} from "~/lib/video";
import { useZustandStore } from "~/store";
import { getAudioDurationInSeconds } from "@remotion/media-utils";

export const openaiFunctions = {
  create_video: prepareFunction({
    schema: z.object({}),
    call: async ({}, transcribeAsync, router) => {
      useZustandStore.setState({ isCreatingVideo: true });
      const messages = useZustandStore.getState().messagesMaybeOutOfSync;

      const res = await fetch("/api/metadata", {
        method: "POST",
        body: JSON.stringify({
          messages,
        }),
      });
      if (!res.ok)
        return console.log(
          "Failed getting metadata",
          res.status,
          res.statusText,
        );
      const metadataJson = (await res.json()) as z.infer<
        typeof metadataPropsSchema
      >;

      const chapterScriptsResponse = await fetch("/api/chapter-scripts", {
        method: "POST",
        body: JSON.stringify({
          metadata: metadataJson,
          messages,
        }),
      });
      if (!chapterScriptsResponse.ok)
        return console.error(
          "Unable to fetch chapter scripts",
          chapterScriptsResponse.status,
          chapterScriptsResponse.statusText,
        );

      const chapterScriptsJson =
        (await chapterScriptsResponse.json()) as z.infer<
          typeof chapterScriptsPropsSchema
        >;

      useZustandStore.setState({
        inputProps: {
          chapters: chapterScriptsJson.chapters.map((chapter, chapterI) => {
            return {
              ...chapter,
              slides: chapter.slides.map(async (slide, slideI) => {
                const { url } = await transcribeAsync({
                  text: slide.script,
                });
                const durationInFrames =
                  (await getAudioDurationInSeconds(url)) * 30 || 1;

                return { ...slide, audioUrl: url, durationInFrames };
              }),
            };
          }),
        },
      });

      router.push("/video");
    },
  }),
};
