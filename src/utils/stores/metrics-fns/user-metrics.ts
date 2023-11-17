import exp from "constants";
import User from "../interfaces";

const analyzeUserEngagement = (users: User[]) => {
  const totalUsers = users.length;
  const averageFrequencyOfUse = calculateAverageFrequencyOfUse(users);
  const averageTimeSpentOnApp = calculateAverageTimeSpentOnApp(users);
  const popularFeatures = identifyPopularFeatures(users);

  console.log(`Total Users: ${totalUsers}`);
  console.log(`Average Frequency of Use: ${averageFrequencyOfUse}`);
  console.log(`Average Time Spent on App: ${averageTimeSpentOnApp} minutes`);
  console.log(`Popular Features: ${popularFeatures.join(", ")}`);
};

export function calculateAverageFrequencyOfUse(users: User[]) {
  const totalFrequencyOfUse = users.reduce(
    (acc, user) => acc + (user.frequencyOfUse || 0),
    0,
  );
  const averageFrequencyOfUse = totalFrequencyOfUse / users.length || 0; // Avoid division by zero
  return averageFrequencyOfUse;
}

export function calculateAverageTimeSpentOnApp(users: User[]) {
  const totalTimeSpentOnApp = users.reduce(
    (acc, user) => acc + (user.timeSpentOnApp || 0),
    0,
  );
  const averageTimeSpentOnApp = totalTimeSpentOnApp / users.length || 0; // Avoid division by zero
  return averageTimeSpentOnApp;
}

export function identifyPopularFeatures(users: User[]) {
  const featureUtilization: { [key in string]: number } = users.reduce(
    (acc, user) => ({
      ...acc,
      ...user.featureUtilization,
    }),
    {},
  );

  const sortedFeatures = Object.keys(featureUtilization).sort(
    (featureA, featureB) =>
      featureUtilization[featureB]! - featureUtilization[featureA]!,
  );

  const popularFeatures = sortedFeatures.slice(0, 3); // Top 3 features

  return popularFeatures;
}
