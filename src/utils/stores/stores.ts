"use client";
import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";
import { storageBucket } from "../firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";

interface StoreState {
  isRecording: boolean;
  threshold: number;
  soundRef: string;
  decibel: number;
  update: boolean;
  soundList: SoundOptions[];
  backupSoundList: SoundOptions[];
  userSounds: SoundOptions[];
  userRecords: SoundOptions[];
  setRecording: (isRecording: boolean) => void;
  setDecibel: (decibel: number) => void;
  setThreshold: (threshold: number) => void;
  /**
   * @description Set the soundRef to the new soundRef and update the local storage
   * @param soundRef The new soundRef to set
   * @returns void
   *
   */
  setSoundRef: (soundRef: string) => void;
  setSoundList: (soundList: SoundOptions) => void;
  removeFromSoundList: (sound: SoundOptions) => void;
  setSoundListBackup: (soundList: SoundOptions) => void;
  setUserSounds: (userSound: SoundOptions) => void;
  setUserRecords: (userRecord: SoundOptions) => void;
  setUpdate: (update: boolean) => void;
  /**
   * @description Get the sound from the database
   * @param sound The sound to delete from the local storage
   * @returns void
   *
   */
  deleteUserSounds: (sound: SoundOptions) => void;
  /**
   * @description  Delete a record from the local storage
   * @param record The record to delete
   * @returns  void
   * *
   */
  deleteUserRecords: (record: SoundOptions) => void;
  /**
   * @description Get the record from the database
   * @param recordId The id of the record to get
   * @returns The record object from the local storage or undefined if not found
   *
   */
  getUserRecord: (recordId: string) => SoundOptions | undefined;
  /**
   * @description Get the sound from the database
   * @param soundId The id of the sound to get
   * @returns The sound object from the local storage or undefined if not found
   *
   *  */
  getUserSound: (soundId: string) => SoundOptions | undefined;
  getSoundFromSoundList: (sound: SoundOptions) => SoundOptions | undefined;
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
      backupSoundList: [],
      userRecords: [],
      userSounds: [],
      update: false,
      setRecording: (isRecording: boolean) => set({ isRecording }),
      setDecibel: (decibel: number) => set({ decibel }),
      setThreshold: (threshold: number) => set({ threshold }),
      //
      setSoundRef: (soundRef: string) => {
        set((prev) => {
          // Update soundList. Since the soundList might hold records from premium user we remove it whenever users switch to another sound. But ideally, we will have to get user premium state so that we can leave any premium sound for as long as the user is premium.
          const filteredSoundList = prev.soundList.filter((sound) => {
            if (
              sound.value === soundRef ||
              prev.backupSoundList.some(
                (backupSound) => backupSound.value === sound.value,
              )
            ) {
              return true;
            }
            return false;
          });
          prev.soundList = filteredSoundList;
          // If the soundRef is different from the previous one, update the state

          if (prev.soundRef !== soundRef) {
            return {
              ...prev,
              soundRef,
            };
          } else {
            return prev;
          }
        });
      },
      setSoundList: (soundList) => {
        set((state) => ({
          soundList: [...state.soundList, soundList],
        }));
      },
      removeFromSoundList: (sound: SoundOptions) => {
        set((state) => ({
          soundList: state.soundList.filter((s) => s.value !== sound.value),
        }));
      },
      setSoundListBackup: (soundList) => {
        set((state) => ({
          backupSoundList: [...state.backupSoundList, soundList],
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
      getSoundFromSoundList: (sound: SoundOptions) => {
        return get().soundList.find((s) => s.value === sound.value);
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
              prev.backupSoundList = [...prev.soundList, soundObj];
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
