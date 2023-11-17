import { Session } from "../interfaces";

export default function calculateWeeklyAverageNoise(sessions: Session[]) {
  // Group sessions by week
  const sessionsByWeek: Record<string, Session[]> = {};
  sessions.forEach((session) => {
    const weekKey = getWeekKey(session.timestamp);
    sessionsByWeek[weekKey] = sessionsByWeek[weekKey] || [];
    sessionsByWeek[weekKey]?.push(session);
  });

  // Calculate weekly averages
  const weeklyAverages: Record<string, number> = {};
  Object.keys(sessionsByWeek).forEach((weekKey) => {
    const weeklySessions = sessionsByWeek[weekKey];
    if (!weeklySessions) return;
    const totalNoise = weeklySessions.reduce(
      (acc, session) => acc + calculateAverageNoise(session),
      0,
    );
    if (!totalNoise) return;

    const weeklyAverage = totalNoise / weeklySessions.length;
    weeklyAverages[weekKey] = weeklyAverage;
  });

  return weeklyAverages;
}

// Helper function to get a key for the week
export function getWeekKey(timestamp: number): string {
  const date = new Date(timestamp);
  const weekStartDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay(),
  );
  return weekStartDate.toISOString().split("T")[0]!;
}

// Helper function to calculate average noise for a session
export function calculateAverageNoise(session: Session): number {
  return (
    session.measures.reduce((acc, measure) => acc + measure, 0) /
    session.measures.length
  );
}
