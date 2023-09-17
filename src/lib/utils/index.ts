import { type ClassValue, clsx } from "clsx";
import { type useRouter } from "next/router";
import { twMerge } from "tailwind-merge";
import { type ZodObject, type z } from "zod";
import { type api } from "~/utils/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (reader.result) resolve(reader.result as string);
      else reject("Didn't find result");
    };
    reader.readAsDataURL(blob);
  });
};

type ChatFunctionArgs<T extends ZodObject<any, any>> = {
  schema: T;
  call: (
    args: z.infer<T>,
    mutateTranscribeAsync: ReturnType<
      typeof api.elevenlabs.transcribe.useMutation
    >["mutateAsync"],
    push: ReturnType<typeof useRouter>["push"],
    mutateUnsplashAsync: ReturnType<
      typeof api.unsplash.searchImage.useMutation
    >["mutateAsync"],
  ) => void;
};
export function prepareFunction<T extends ZodObject<any, any>>(
  args: ChatFunctionArgs<T>,
) {
  return args;
}
