useZustandStore.setState(async () => {
  let iteratedSlides = 0;

  const resolvedChapters = await Promise.all(
    chapterScriptsJson.chapters.map(async (chapter, chapterI) => {
      const resolvedSlides = await Promise.all(
        chapter.slides.map(async (slide, slideI) => {

          if (iteratedSlides % 5 === 0 && iteratedSlides !== 0) {
            console.log("Waiting", 70 * 1000);
            await new Promise((resolve) =>
              setTimeout(resolve, 70 * 1000)
            );
          }

          iteratedSlides += 1;

          const { url } = await transcribeAsync({
            text: slide.script,
          });
          const durationInFrames =
            (await getAudioDurationCustom(url)) * 30 || 1;

          return { ...slide, audioUrl: url, durationInFrames };
        })
      );

      return {
        ...chapter,
        slides: resolvedSlides,
      };
    })
  );

  return {
    inputProps: {
      chapters: resolvedChapters,
    },
  };
});
