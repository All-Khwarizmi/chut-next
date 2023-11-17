import { Session } from "../interfaces";

/**
 * Calculates the count of noise levels that fall within common ranges.
 * @param sessions - An array of Session objects containing measures.
 * @returns An array of numbers representing the count of noise levels that fall within each common range.
 */
export default function calculateCommonNoiseRanges(sessions: Session[]) {
  const allNoiseLevels = sessions.flatMap((session) => session.measures);

  if (allNoiseLevels.length === 0) {
    return [];
  }

  const minNoise = Math.min(...allNoiseLevels);
  const maxNoise = Math.max(...allNoiseLevels);

  // Define common ranges based on your application's criteria
  const commonRanges = [0, 30, 60, 90]; // Example ranges, customize as needed

  const noiseRangeCounts = commonRanges.map(
    (range) =>
      allNoiseLevels.filter((level) => level >= range && level < range + 30)
        .length,
  );

  return noiseRangeCounts;
}
