import { create } from "zustand";
import { type Message } from "ai";

interface ZustandStore {
  storedMessages: Message[];
  setStoredMessages: (newMessages: Message[]) => void;
}

export const useZustandStore = create<ZustandStore>()((set) => ({
  storedMessages: [],
  setStoredMessages: (newMessages) => set({ storedMessages: newMessages }),
}));

useZustandStore.subscribe((newState) => console.log("New state", newState));
