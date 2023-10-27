import { getDownloadURL, ref, listAll } from "firebase/storage";
import { storageBucket } from "../firebase";
import { SoundOptions, useStore } from "./stores";

/**
 * @description Check if the user has exceeded the prumim usage limit. If so, return true. Otherwise, return false.
 *
 * @returns {boolean}
 */
export const checkPremiumUsage = (
  userSounds: SoundOptions[],
  userRecords: SoundOptions[],
): boolean => {
  if (userSounds.length + userRecords.length === 20) {
    return true;
  } else {
    return false;
  }
};

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
