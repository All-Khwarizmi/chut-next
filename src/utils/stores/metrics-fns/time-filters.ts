import { Session } from "../interfaces";
import calculateCommonNoiseRanges from "./common-range";
import calculateDominantFrequencies from "./dominant-frequencies";
import {
  calculateAverageDurationHighNoise,
  calculateAverageDurationLowNoise,
} from "./duration-low-high-noise";
import calculateNoiseDuringGroupDiscussions from "./groupe-discussions";
import calculateMonthlyAverageNoise from "./month-avg-noise";
import calculateNoiseDuringSpecificSubjects from "./specific-subject";
import calculateTrendIndicator from "./trend-indicator";
import calculateWeeklyAverageNoise from "./week-avg-noise";

export function getSessionsByDayOfWeek(
  dayOfWeek: number,
  sessionHistory: Session[],
) {
  return sessionHistory.filter(
    (session) => session.date.getDay() === dayOfWeek,
  );
}

export function analyzeNoiseByDayOfWeek(sessionHistory: Session[]) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  daysOfWeek.forEach((day, index) => {
    const sessionsForDay = getSessionsByDayOfWeek(index, sessionHistory);
    const averageNoise = calculateAverageNoise(sessionsForDay);

    const averageClassSize = calculateAverageClassSize(sessionsForDay); // Implement this function

    console.log(
      `Day: ${day}, Average Noise: ${averageNoise}, Average Class Size: ${averageClassSize}`,
    );
  });
}

export function calculateAverageClassSize(sessions: Session[]) {
  const totalClassSizes = sessions.reduce(
    (acc, session) => acc + (session.classSize || 0),
    0,
  );
  const averageClassSize = totalClassSizes / sessions.length || 0; // Avoid division by zero
  return averageClassSize;
}

export function getSessionsByTimeOfDay(
  startHour: number,
  endHour: number,
  sessionHistory: Session[],
) {
  return sessionHistory.filter(
    (session) =>
      session.date.getHours() >= startHour && session.date.getHours() < endHour,
  );
}

export function analyzeNoiseByTimeOfDay(sessionHistory: Session[]) {
  const timeSlots = [
    { start: 8, end: 10, label: "Early Morning" },
    { start: 10, end: 12, label: "Morning" },
    { start: 12, end: 14, label: "Afternoon" },
    { start: 15, end: 0, label: "Late Afternoon" },
  ];

  timeSlots.forEach((slot) => {
    const sessionsForTime = getSessionsByTimeOfDay(
      slot.start,
      slot.end,
      sessionHistory,
    );
    const averageNoise = calculateAverageNoise(sessionsForTime); // Implement this function
    console.log(`Average noise during ${slot.label}: ${averageNoise}`);
  });
}

export function calculateAverageNoise(sessions: Session[]) {
  const totalNoise = sessions.reduce((acc, session) => {
    // Assuming noise levels are stored in the session's noiseLevels property
    const sessionNoise = session.noiseLevels
      ? session.noiseLevels.reduce((sum, level) => sum + level, 0)
      : 0;
    return acc + sessionNoise;
  }, 0);

  const averageNoise = totalNoise / sessions.length || 0; // Avoid division by zero

  return averageNoise;
}
export function getSessionsByActivity(
  isCollaborativeActivity: boolean,
  sessionHistory: Session[],
) {
  return sessionHistory.filter((session) => {
    // Assuming you have a property isCollaborativeActivity in your Session interface
    return session.isCollaborativeActivity === isCollaborativeActivity;
  });
}
export function analyzeNoiseByActivity(sessionHistory: Session[]) {
  const sessionsForCollaborative = getSessionsByActivity(true, sessionHistory);
  const sessionsForIndividual = getSessionsByActivity(false, sessionHistory);

  const averageNoiseCollaborative = calculateAverageNoise(
    sessionsForCollaborative,
  );
  const averageNoiseIndividual = calculateAverageNoise(sessionsForIndividual);

  console.log(
    `Average Noise during Collaborative Work: ${averageNoiseCollaborative}`,
  );
  console.log(
    `Average Noise during Individual Study: ${averageNoiseIndividual}`,
  );
}

//! To be implemented
export function analyzeNoiseTrends(sessionHistory: Session[]) {
  const weeklyAverage = calculateWeeklyAverageNoise(sessionHistory);
  const monthlyAverage = calculateMonthlyAverageNoise(sessionHistory);
  const trend = calculateTrendIndicator(sessionHistory);

  console.log(`Weekly Average Noise Level: ${weeklyAverage}`);
  console.log(`Monthly Average Noise Level: ${monthlyAverage}`);
  console.log(`Trend Indicator: ${trend}`);
}

export function analyzeCorrelations(sessionHistory: Session[]) {
  const groupDiscussionNoise =
    calculateNoiseDuringGroupDiscussions(sessionHistory);
  const subjectNoiseLevels =
    calculateNoiseDuringSpecificSubjects(sessionHistory);

  console.log(
    `Average Noise During Group Discussions: ${groupDiscussionNoise}`,
  );
  console.log(
    `Average Noise During Specific Subjects: ${JSON.stringify(
      subjectNoiseLevels,
    )}`,
  );
}

export function analyzeFrequencyDistribution(sessionHistory: Session[]) {
  const commonRanges = calculateCommonNoiseRanges(sessionHistory);
  const dominantFrequencies = calculateDominantFrequencies(sessionHistory);

  console.log(`Common Noise Ranges: ${commonRanges}`);
  console.log(`Dominant Frequencies: ${dominantFrequencies}`);
}

export function analyzeStateDurations(sessionHistory: Session[]) {
  const averageDurationHighNoise =
    calculateAverageDurationHighNoise(sessionHistory);
  const averageDurationLowNoise =
    calculateAverageDurationLowNoise(sessionHistory);

  console.log(
    `Average Duration of High Noise States: ${averageDurationHighNoise} minutes`,
  );
  console.log(
    `Average Duration of Low Noise States: ${averageDurationLowNoise} minutes`,
  );
}
