import { Session } from "../interfaces";

export default function calculateCalmDurations(
  sessionHistory: Session[],
  threshold: number,
) {
  const calmDurations: number[] = [];
  let currentCalmDuration = 0;

  for (const session of sessionHistory) {
    for (const measure of session.measures) {
      if (measure <= threshold) {
        currentCalmDuration += 1000; // Assuming measurements are every 1000ms
      } else {
        if (currentCalmDuration > 0) {
          calmDurations.push(currentCalmDuration);
          currentCalmDuration = 0;
        }
      }
    }
  }

  return calmDurations;
}
