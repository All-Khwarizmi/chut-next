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
  update: boolean;
  soundList: SoundOptions[];
  userSounds: SoundOptions[];
  userRecords: SoundOptions[];
  setRecording: (isRecording: boolean) => void;
  setDecibel: (decibel: number) => void;
  setThreshold: (threshold: number) => void;
  setSoundRef: (soundRef: string) => void;
  setSoundList: (soundList: SoundOptions) => void;
  setUserSounds: (userSound: SoundOptions) => void;
  setUserRecords: (userRecord: SoundOptions) => void;
  setUpdate: (update: boolean) => void;
  deleteUserSounds: (sound: SoundOptions) => void;
  deleteUserRecords: (record: SoundOptions) => void;
  getUserRecord: (recordId: string) => SoundOptions;
  getUserSound: (soundId: string) => SoundOptions;
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
      userRecords: [],
      userSounds: [],
      update: false,
      setRecording: (isRecording: boolean) => set({ isRecording }),
      setDecibel: (decibel: number) => set({ decibel }),
      setThreshold: (threshold: number) => set({ threshold }),
      setSoundRef: (soundRef: string) => set({ soundRef }),
      setSoundList: (soundList) => {
        set((state) => ({
          soundList: [...state.soundList],
        }));
      },

      setUserRecords: (userRecord: SoundOptions) => {
        set((state) => ({
          userRecords: [...state.userRecords, userRecord],
        }));
      },
      setUserSounds: (userSound: SoundOptions) => {
        set((state) => ({
          userSounds: [...state.userSounds, userSound],
        }));
      },
      setUpdate: (update: boolean) => set({ update }),
      deleteUserSounds: (sound: SoundOptions) => {
        return set((state) => {
          return {
            ...state,
            userSounds: state.userSounds.filter((s) => s.value !== sound.value),
          };
        });
      },
      deleteUserRecords: (record: SoundOptions) => {
        return set((state) => {
          return {
            ...state,
            userRecords: state.userRecords.filter(
              (r) => r.value !== record.value,
            ),
          };
        });
      },
      getUserRecord: (recordId: string) => {
        return get().userRecords.find((record) => record.label === recordId);
      },
      getUserSound: (soundId: string) => {
        return get().userSounds.find((record) => record.label === soundId);
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
