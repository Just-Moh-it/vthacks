import { z } from "zod";
import { prepareFunction } from "~/lib/utils";
import {
  type chapterScriptsPropsSchema,
  type metadataPropsSchema,
} from "~/lib/video";
import { useZustandStore } from "~/store";
import { getAudioDurationCustom } from "~/lib/getAudioDurationCustom";

export const openaiFunctions = {
  create_video: prepareFunction({
    schema: z.object({}),
    call: async ({}, transcribeAsync, push, searchUnsplashAsync) => {
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
      // {
      //   chapters: [
      //     {
      //       slides: [
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "1:Derivatives.",
      //           slideLayout: {
      //             type: "title",
      //             title: "Introduction to Derivatives",
      //           },
      //         },
      //         {
      //           script:
      //             "A derivative ",
      //           slideLayout: {
      //             type: "imageAndTitleAndPoints",
      //             stockImageQuery: "derivative concept",
      //             title: "Definition of a Derivative",
      //             points: [
      //               "The derivative measures the rate of change of a function",
      //               "It represents the slope of the tangent line at a point",
      //               "Instantaneous rate of change",
      //             ],
      //           },
      //         },
      //         {
      //           script:
      //             "Now, let's ",
      //           slideLayout: {
      //             type: "titleAndCaption",
      //             title: "Finding the Derivative",
      //             caption: "Differentiation rules and formulas",
      //           },
      //         },
      //         {
      //           script:
      //             "Now, let's ",
      //           slideLayout: {
      //             type: "titleAndCaption",
      //             title: "Finding the Derivative",
      //             caption: "Differentiation rules and formulas",
      //           },
      //         },
      //         {
      //           script:
      //             "Now, let's ",
      //           slideLayout: {
      //             type: "titleAndCaption",
      //             title: "Finding the Derivative",
      //             caption: "Differentiation rules and formulas",
      //           },
      //         },
      //         {
      //           script:
      //             "Now, let's ",
      //           slideLayout: {
      //             type: "titleAndCaption",
      //             title: "Finding the Derivative",
      //             caption: "Differentiation rules and formulas",
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // };

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

      let iteratedSlides = 0;

      const scripts: string[] = [];

      chapterScriptsJson.chapters.forEach((chapter, chapterI) => {
        chapter.slides.forEach((slide, slideI) => {
          scripts.push(slide.script);
        });
      });

      let queue: audioQueue = {
        text: scripts,
        outputUrl: "",
      };

      const audioUrls = [];

      while (false && queue.text.length > 0) {
        await tryToGetAudio(queue, transcribeAsync);
        const durationInFrames =
          (await getAudioDurationCustom(queue.outputUrl)) * 30 || 1;

        // queue.outputUrl
        audioUrls.push(queue.outputUrl);
      }

      // let inputProps = { chapters: [] } satisfies InputProps;

      for (const chapter of chapterScriptsJson.chapters) {
        for (const slide of chapter.slides) {
        }
      }

      const getInputProps = async () => {
        let resolvedChapters = [];
        for (const [chapterI, chapter] of Object.entries(
          chapterScriptsJson.chapters,
        )) {
          let resolvedSlides = [];
          for (const [slideI, slide] of Object.entries(chapter.slides)) {
            if (iteratedSlides % 5 === 0 && iteratedSlides !== 0) {
              console.log("Waiting", 70 * 1000);
              await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
            }

            iteratedSlides += 1;

            let stockUrl;
            if (
              slide.slideLayout.type === "image" ||
              slide.slideLayout.type === "imageAndTitleAndPoints"
            ) {
              const query = slide.slideLayout.stockImageQuery;
              if (!query && "stockImageUrl" in slide.slideLayout)
                slide.slideLayout.stockImageUrl = "/lisapfp.png";

              var stockUrlQuery = await searchUnsplashAsync({ query });
              stockUrl = stockUrlQuery.results?.[0]?.urls.regular;

              console.log("Stock url", stockUrl, stockUrlQuery);
            }

            const { url } = await transcribeAsync({
              text: slide.script,
              voiceId: useZustandStore.getState().voiceId,
            });
            const durationInFrames =
              (await getAudioDurationCustom(url)) * 30 + 25 || 1;

            console.log("Outta scope", stockUrl);

            resolvedSlides.push({
              ...slide,
              audioUrl: url,
              durationInFrames,
              slideLayout: {
                ...slide.slideLayout,
                ...(stockUrl ? { stockImageUrl: stockUrl } : {}),
              },
            });
          }

          resolvedChapters.push({
            ...chapter,
            slides: resolvedSlides,
          });
        }

        return {
          chapters: resolvedChapters,
        };
      };
      console.log("Gettinginput props");

      const inputProps = await getInputProps();

      console.log("Got input props", inputProps);
      useZustandStore.setState({ inputProps });

      console.log("Pushing");
      push("/video");
    },
  }),
};

interface audioQueue {
  text: string[];
  outputUrl: string;
}

async function tryToGetAudio(queue: audioQueue, transcribeAsync: Function) {
  let audioUrl = "";
  try {
    const { url } = await transcribeAsync({
      text: queue.text[0],
    });

    audioUrl = url;
  } catch {
    console.log("Failed to get audio, waiting 20 seconds then trying again...");
    await new Promise((resolve) => setTimeout(resolve, 20 * 1000));
  }

  queue.outputUrl = audioUrl;
  queue.text.shift();
}
