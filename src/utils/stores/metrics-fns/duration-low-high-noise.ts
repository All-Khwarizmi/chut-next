import { Session } from "../interfaces";

/**
 * Calculates the average duration of high noise sessions.
 * A session is considered high noise if any of its measures exceed the high noise threshold.
 * @param sessions An array of Session objects.
 * @returns The average duration of high noise sessions, or 0 if there are no high noise sessions.
 */
export function calculateAverageDurationHighNoise(sessions: Session[]) {
  const highNoiseSessions = sessions.filter((session) => {
    // Define your threshold for high noise based on your application's criteria
    const highNoiseThreshold = 70; // Adjust as needed
    return session.measures.some((level) => level >= highNoiseThreshold);
  });

  if (highNoiseSessions.length === 0) {
    return 0;
  }

  const totalHighNoiseDuration = highNoiseSessions.reduce(
    (sum, session) => sum + session.measures.length,
    0,
  );

  const averageDuration = totalHighNoiseDuration / highNoiseSessions.length;

  return averageDuration;
}

/**
 * Calculates the average duration of sessions with low noise levels.
 * @param sessions An array of Session objects.
 * @returns The average duration of sessions with low noise levels.
 */
export function calculateAverageDurationLowNoise(sessions: Session[]) {
  const lowNoiseSessions = sessions.filter((session) => {
    // Define your threshold for low noise based on your application's criteria
    const lowNoiseThreshold = 30; // Adjust as needed
    return session.measures.every((level) => level < lowNoiseThreshold);
  });

  if (lowNoiseSessions.length === 0) {
    return 0;
  }

  const totalLowNoiseDuration = lowNoiseSessions.reduce(
    (sum, session) => sum + session.measures.length,
    0,
  );

  const averageDuration = totalLowNoiseDuration / lowNoiseSessions.length;

  return averageDuration;
}
