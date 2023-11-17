import { Session } from "../interfaces";

export default function calculateMonthlyAverageNoise(sessions: Session[]) {
  const monthlyAverages: Record<number, number> = {}; // Record to store monthly averages

  sessions.forEach((session) => {
    const monthKey = session.date.getMonth(); // Using the month as the key
    const totalNoise = session.measures.reduce(
      (sum, measure) => sum + measure,
      0,
    );

    if (!monthlyAverages[monthKey]) {
      monthlyAverages[monthKey] = totalNoise / session.measures.length;
    } else {
      monthlyAverages[monthKey] += totalNoise / session.measures.length;
    }
  });

  // Calculate the average for each month
  const averagesArray = Object.values(monthlyAverages);
  const monthlyAverage =
    averagesArray.reduce((sum, average) => sum + average, 0) /
    averagesArray.length;

  return monthlyAverage;
}
