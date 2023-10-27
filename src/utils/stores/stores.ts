"use client";
import { persist } from "zustand/middleware";
import { create } from "zustand";

interface HistoryObject {
  date: Date;
  measures: Array<number>;
}

type SessionsHistory = Array<HistoryObject>;

type Session = Array<number>;

// on start recording fill the sessionArr with the sounds measures ✅
// on stop recording                  ❌
// push the sessionArr to the history ✅
// reset the sessionArr               ✅
// log                                ❌
// the average noise level            ❌
// number of measures = time          ❌
// Date                               ❌
// User ID                            ❌

interface StoreState {
  isRecording: boolean;
  isSoundPlaying: boolean;
  threshold: number;
  soundRef: string;
  decibel: number;
  update: boolean;
  soundList: SoundOptions[];
  setIsSoundPlaying: (isPlaying: boolean) => void;
  backupSoundList: SoundOptions[];
  userSounds: SoundOptions[];
  userRecords: SoundOptions[];
  sessionArr: Session;
  sessionHistory: SessionsHistory;
  setSession: (measure: number) => void;

  pushSessionArr: () => void;
  setRecording: (isRecording: boolean) => void;
  setDecibel: (decibel: number) => void;
  setThreshold: (threshold: number) => void;
  checkSoundName: (name: string) => boolean;
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
      isSoundPlaying: false,
      threshold: 80, // Set your initial threshold value here
      soundRef: "./shhh.mp3", // Set your initial audio element here
      decibel: 0,
      soundList: [],
      backupSoundList: [],
      userRecords: [],
      userSounds: [],
      update: false,
      sessionArr: [],
      sessionHistory: [],
      setIsSoundPlaying: (isPlaying) => set({isSoundPlaying: isPlaying}),
      setSession: (measure: number) => {
        const sessionArr = get().sessionArr;
        sessionArr.push(measure);
        set({ sessionArr });
      },
      pushSessionArr: () => {
        const sessionArr = get().sessionArr;
        const sessionHistory = get().sessionHistory;
        sessionHistory.push({
          date: new Date(),
          measures: sessionArr,
        });
        set({ sessionArr: [] });
      },
      setRecording: (isRecording: boolean) => {
        const prevRecordingState = get().isRecording;
        if (prevRecordingState === false && isRecording === true) {
          set({ isRecording: true });
        } else if (prevRecordingState === true && isRecording === false) {
          set({ isRecording: false });
          get().pushSessionArr();
        }
      },
      setDecibel: (decibel: number) => set({ decibel }),
      setThreshold: (threshold: number) => set({ threshold }),

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
      checkSoundName(name) {
        const soundList = get().soundList;
        const userSounds = get().userSounds;
        const userRecords = get().userRecords;

        if (soundList.some((e) => e.label === name)) {
          return false;
        }
        if (userRecords.some((e) => e.label === name)) {
          return false;
        }
        if (userSounds.some((e) => e.label === name)) {
          return false;
        }
        return true;
      },
    }),

    {
      name: "chut-state",
    },
  ),
);


