import { Session } from "../interfaces";

/**
 * Calculates the trend indicator based on the average noise levels of the last two sessions.
 * @param sessions An array of Session objects.
 * @returns A string indicating the trend: "Upward", "Downward", or "Stable".
 */
export default function calculateTrendIndicator(sessions: Session[]) {
  if (sessions.length < 2) {
    // Not enough data to determine trend
    return "Stable";
  }

  // Calculate the average noise levels for the last two sessions
  const lastSession = sessions[sessions.length - 1];
  if (
    !lastSession ||
    !lastSession.measures ||
    lastSession.measures.length === 0
  ) {
    // No data for the last session
    return "Stable";
  }

  const secondToLastSession = sessions[sessions.length - 2];
  if (
    !secondToLastSession ||
    !secondToLastSession.measures ||
    secondToLastSession.measures.length === 0
  ) {
    // No data for the second to last session
    return "Stable";
  }
  const lastSessionAverage =
    lastSession.measures.reduce((sum, measure) => sum + measure, 0) /
    lastSession.measures.length;
  const secondToLastSessionAverage =
    secondToLastSession.measures.reduce((sum, measure) => sum + measure, 0) /
    secondToLastSession.measures.length;

  // Determine the trend based on the comparison of the two averages
  if (lastSessionAverage > secondToLastSessionAverage) {
    return "Upward";
  } else if (lastSessionAverage < secondToLastSessionAverage) {
    return "Downward";
  } else {
    return "Stable";
  }
}
