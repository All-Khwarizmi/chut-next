"use client";
import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";
import { storageBucket } from "./firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";

interface StoreState {
  isRecording: boolean;
  threshold: number;
  soundRef: string;
  decibel: number;
  soundList: SoundOptions[];
  setRecording: (isRecording: boolean) => void;
  setDecibel: (decibel: number) => void;
  setThreshold: (threshold: number) => void;
  setSoundRef: (soundRef: string) => void;
  setSoundList: (soundList: SoundOptions) => void;
}

export interface SoundOptions {
  label: string;
  value: string;
}
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isRecording: false,
      threshold: 80, // Set your initial threshold value here
      soundRef: "./shhh.mp3", // Set your initial audio element here
      decibel: 0,
      soundList: [],
      setRecording: (isRecording: boolean) => set({ isRecording }),
      setDecibel: (decibel: number) => set({ decibel }),
      setThreshold: (threshold: number) => set({ threshold }),
      setSoundRef: (soundRef: string) => set({ soundRef }),
      setSoundList: (soundList) => {
        set((state) => ({
          soundList: [...state.soundList],
        }));
      },
    }),
    {
      name: "chut-state",
      onRehydrateStorage(state) {
        console.log("hydration starts");
        console.log(`Sound list= ${state.soundList.length}`);

        // optional
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.log("hydration finished");
          }
        };
      },
    },
  ),
);

// Fetch sound list from Firebase Storage and set it in the store
export const fetchSoundList = async () => {
  const storageRef = ref(storageBucket, "sounds/"); // Reference to your Firebase Storage bucket

  // List all objects in the bucket

  listAll(storageRef)
    .then((result) => {
      const soundOptionsArr: SoundOptions[] = [];
      result.items.map((item) => {
        getDownloadURL(item).then((url) => {
          const soundObj = { label: item.name, value: url };
          soundOptionsArr.push(soundObj);
          useStore.setState((prev) => {
            if (
              !prev.soundList.some(
                (element) =>
                  element.label === soundObj.label &&
                  element.value === soundObj.value,
              )
            ) {
              prev.soundList = [...prev.soundList, soundObj];
              return { ...prev };
            } else {
              return prev;
            }
          });
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching sound list:", error);
    });
};
