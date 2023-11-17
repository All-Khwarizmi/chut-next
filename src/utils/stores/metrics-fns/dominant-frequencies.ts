import { Session } from "../interfaces";

/**
 * Calculates the top N dominant frequencies from an array of sessions.
 * @param sessions An array of Session objects.
 * @returns An array of the top N dominant frequencies.
 */
export default function calculateDominantFrequencies(sessions: Session[]) {
  const allNoiseLevels = sessions.flatMap((session) => session.measures);

  if (allNoiseLevels.length === 0) {
    return [];
  }

  // Identify unique frequencies in the noise levels
  const uniqueFrequencies = Array.from(new Set(allNoiseLevels));

  // Sort frequencies based on their occurrence in descending order
  const sortedFrequencies = uniqueFrequencies.sort(
    (a, b) =>
      allNoiseLevels.filter((level) => level === b).length -
      allNoiseLevels.filter((level) => level === a).length,
  );

  // Return the top N dominant frequencies (adjust N based on your requirement)
  const topNDominantFrequencies = sortedFrequencies.slice(0, 5); // Example: Top 5 frequencies

  return topNDominantFrequencies;
}
