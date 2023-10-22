"use client";
import { persist, createJSONStorage } from "zustand/middleware";

import { create } from "zustand";

interface StoreState {
  isRecording: boolean;
  threshold: number;
  soundRef: string;
  decibel: number;
  setRecording: (isRecording: boolean) => void;
  setDecibel: (decibel: number) => void;
  setThreshold: (threshold: number) => void;
  setSoundRef: (soundRef: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isRecording: false,
      threshold: 80, // Set your initial threshold value here
      soundRef: "./shhh.mp3", // Set your initial audio element here
      decibel: 0,
      setRecording: (isRecording: boolean) => set({ isRecording }),
      setDecibel: (decibel: number) => set({ decibel }),
      setThreshold: (threshold: number) => set({ threshold }),
      setSoundRef: (soundRef: string) => set({ soundRef }),
    }),
    { name: "chut-state", skipHydration: true },
  ),
);
