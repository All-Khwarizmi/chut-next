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
