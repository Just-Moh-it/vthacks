import { create } from "zustand";
import { type Message } from "ai";
import { type InputProps } from "~/remotion/video";

interface ZustandStore {
  messagesMaybeOutOfSync: Message[];
  setStoredMessages: (newMessages: Message[]) => void;
  isCreatingVideo: boolean;
  inputProps: InputProps;
}

export const useZustandStore = create<ZustandStore>()((set) => ({
  messagesMaybeOutOfSync: [],
  setStoredMessages: (newMessages) =>
    set({ messagesMaybeOutOfSync: newMessages }),
  isCreatingVideo: false,
  inputProps: {
    chapters: [
      // {
      //   audioUrl:
      //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      //   faceVideoUrl:
      //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      //   slides: [
      //     {
      //       type: "image",
      //       stockImageUrl:
      //         "https://images.unsplash.com/photo-1693155119174-4b6e79a27814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3132&q=80",
      //       durationInFrames: 100,
      //     },
      //   ],
      // },
      // {
      //   audioUrl:
      //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      //   faceVideoUrl:
      //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      //   slides: [
      //     {
      //       type: "title",
      //       title: "Toxic ex wifey",
      //       durationInFrames: 100,
      //     },
      //   ],
      // },
      // {
      //   audioUrl:
      //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      //   faceVideoUrl:
      //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      //   slides: [
      //     {
      //       type: "titleAndCaption",
      //       title: "Toxic ex wifey",
      //       caption: "(like fr bro)",
      //       durationInFrames: 100,
      //     },
      //   ],
      // },
      // {
      //   audioUrl:
      //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      //   faceVideoUrl:
      //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      //   slides: [
      //     {
      //       type: "quoteAndAuthor",
      //       quote:
      //         "“When it is cool... it is awesome too, just like how to see people and stuff like that”",
      //       authorName: "John Dalton",
      //       durationInFrames: 100,
      //     },
      //   ],
      // },
      // {
      //   audioUrl:
      //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      //   faceVideoUrl:
      //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      //   slides: [
      //     {
      //       type: "imageAndTitleAndPoints",
      //       stockImageUrl:
      //         "https://images.unsplash.com/photo-1693155119174-4b6e79a27814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3132&q=80",
      //       points: [
      //         "It’s cool",
      //         "It looks great!",
      //         "It is awesome!",
      //         "It is cool!",
      //       ],
      //       title: "Why make it?",
      //       durationInFrames: 100,
      //     },
      //   ],
      // },
    ],
  },
}));

useZustandStore.subscribe((newState) => console.log("New state", newState));
