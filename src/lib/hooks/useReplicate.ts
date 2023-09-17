import { MIN_REPLICATE_POLLING_INTERVAL_IN_MS } from "~/lib/constants";
import { useState } from "react";
import { api } from "~/utils/api";

export type PredictionStatus = "creating" | "starting" | "progress" | "idle";

export const useReplicatePrediction = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (output: unknown) => void;
  onError?: (error: unknown) => void;
}) => {
  const [predictionStatus, setPredictionStatus] =
    useState<PredictionStatus>("idle");
  const [progressPercent, setProgressPercent] = useState(0);
  const { mutate: createPredictionMutate } =
    api.replicate.createPrediction.useMutation({
      onSuccess: (prediction) => {
        console.log("Success", prediction);
        return setTimeout(
          () => getPredictionMutate({ id: prediction.id }),
          MIN_REPLICATE_POLLING_INTERVAL_IN_MS,
        );
      },
    });

  const { mutate: getPredictionMutate } =
    api.replicate.getPrediction.useMutation({
      onSuccess: (prediction) => {
        console.log("Success get", prediction);
        switch (prediction.status) {
          case "starting":
            setPredictionStatus("starting");
            return setTimeout(
              () => getPredictionMutate(prediction.id),
              MIN_REPLICATE_POLLING_INTERVAL_IN_MS,
            );
          case "processing":
            setPredictionStatus("progress");
            const progressPercentInString = prediction.logs
              ?.split("\n")
              .reverse()
              .find((log) => log.match(/d/g))
              ?.match(/d/g)
              ?.toString();

            if (progressPercentInString) {
              setProgressPercent(parseInt(progressPercentInString));
            }
            return setTimeout(
              () => getPredictionMutate(prediction.id),
              MIN_REPLICATE_POLLING_INTERVAL_IN_MS,
            );

          case "succeeded":
            onSuccess?.(prediction.output);
            setPredictionStatus("idle");
            return;
          case "failed":
            onError?.(prediction.error);
            setPredictionStatus("idle");
        }
      },
    });

  return { createPredictionMutate, predictionStatus, progressPercent };
};
