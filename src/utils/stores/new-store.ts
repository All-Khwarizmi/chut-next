import { create } from "zustand";
import User, { Session, State } from "./interfaces";
import calculateWeeklyAverageNoise from "./metrics-fns/week-avg-noise";
import calculateMonthlyAverageNoise from "./metrics-fns/month-avg-noise";
import calculateTrendIndicator from "./metrics-fns/trend-indicator";
import calculateNoiseDuringGroupDiscussions from "./metrics-fns/groupe-discussions";
import calculateNoiseDuringSpecificSubjects from "./metrics-fns/specific-subject";
import calculateCommonNoiseRanges from "./metrics-fns/common-range";
import calculateDominantFrequencies from "./metrics-fns/dominant-frequencies";
import {
  calculateAverageDurationHighNoise,
  calculateAverageDurationLowNoise,
} from "./metrics-fns/duration-low-high-noise";
import { persist } from "zustand/middleware";
import isSameDay from "./metrics-fns/day-session";
import calculateCalmDurations from "./metrics-fns/calm-duration";
import calculateNoiseVariability from "./metrics-fns/noise-variability";
import identifyNoisePatterns from "./metrics-fns/noise-patterns";
import { calculateAverageNoise } from "./metrics-fns/time-filters";

// Session.ts

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      sessionArr: [],
      sessionHistory: [],

      isSoundOn: false,
      soundName: "",
      threshold: 80,
      impactOnLearning: null, // New property for feedback
      isCollaborativeActivity: false,
      classSize: 25,
      // ... (other initial state properties)

      setSession: (measure: number, isSoundOn: boolean, soundName: string) => {
        let {
          sessionArr,
          sessionHistory,
          threshold,
          impactOnLearning,
          classSize,
        } = get();

        const newSession: Session = {
          classSize,
          date: new Date(),
          timestamp: Date.now(),
          measures: sessionArr,
          calmDurations: calculateCalmDurations(sessionHistory, threshold),
          impactOnLearning,
          noiseVariability: calculateNoiseVariability(sessionArr),
          noisePatterns: identifyNoisePatterns(sessionArr),
          // ... (other properties)
        };
        (sessionArr = [...sessionArr, measure]),
          (sessionHistory = [...sessionHistory, newSession]),
          set({
            sessionArr,
            sessionHistory,
          });
      },
      pushSessionArr: () => {
        set((state) => {
          const sessionArr = state.sessionArr;
          const sessionHistory = state.sessionHistory;
          const isSoundOn = state.isSoundOn;
          const soundName = state.soundName;
          const isCollaborativeActivity = state.isCollaborativeActivity;

          const newSession: Session = {
            classSize: state.classSize,

            date: new Date(),
            measures: sessionArr,
            isSoundOn,
            soundName,
            impactOnLearning: state.impactOnLearning,
            noiseVariability: calculateNoiseVariability(sessionArr),
            noisePatterns: identifyNoisePatterns(sessionArr),
            timestamp: Date.now(),
            noiseLevels: sessionArr, // Assuming you store noise levels in each session
            collaborativeNoiseLevels: isCollaborativeActivity
              ? calculateAverageNoise(sessionHistory)
              : 0,
            individualNoiseLevels: !isCollaborativeActivity
              ? calculateAverageNoise(sessionHistory)
              : 0,
            calmDurations: calculateCalmDurations(
              sessionHistory,
              state.threshold,
            ),
          };

          return {
            sessionArr: [],
            sessionHistory: [...sessionHistory, newSession],
            isSoundOn: false, // Reset isSoundOn after pushing session
          };
        });
      },
      submitImpactFeedback: (impact) => {
        set((state) => {
          const sessionHistory = state.sessionHistory;
          const lastSession = sessionHistory[sessionHistory.length - 1];

          if (lastSession) {
            lastSession.impactOnLearning = impact;
          }

          return { sessionHistory };
        });
      },
      getAverageBackToCalmTime: () => {
        const { sessionHistory } = get();

        // Flatten calm durations from all sessions
        const allCalmDurations = sessionHistory.flatMap(
          (session) => session.calmDurations,
        );

        // Calculate average back to calm time
        return allCalmDurations.length > 0
          ? allCalmDurations.reduce((acc, duration) => acc + duration, 0) /
              allCalmDurations.length
          : 0;
      },
      getSessionsForDay: (day) => {
        const { sessionHistory } = get();

        // Filter sessions for the specified day
        return sessionHistory.filter((session) => isSameDay(session.date, day));
      },
      getSessionsByDayOfWeek: (dayOfWeek: number) => {
        const { sessionHistory } = get();
        return sessionHistory.filter(
          (session) => session.date.getDay() === dayOfWeek,
        );
      },
      trackUserInteraction: (userId: string, feature: string) => {
        let { user, sessionHistory } = get();
        if (!user) {
          // Create new user
          user = {
            userId,
            frequencyOfUse: 1,
            timeSpentOnApp: calculateTimeSpentOnApp(sessionHistory),
            featureUtilization: {
              [feature]: 1,
            },
          };
          set({
            user,
          });
        }
        const updatedUser = {
          ...user,
          frequencyOfUse: user.frequencyOfUse + 1,
          timeSpentOnApp: calculateTimeSpentOnApp(sessionHistory), // Calculate session duration
          featureUtilization: {
            ...user.featureUtilization,
            [feature]: (user.featureUtilization[feature] || 0) + 1,
          },
        };
        set({
          user: updatedUser,
        });
      },
      calculateWeeklyAverageNoise,
      calculateMonthlyAverageNoise,
      calculateTrendIndicator,
      calculateNoiseDuringGroupDiscussions,
      calculateNoiseDuringSpecificSubjects,
      calculateCommonNoiseRanges,
      calculateDominantFrequencies,
      calculateAverageDurationLowNoise,
      calculateAverageDurationHighNoise,
    }),
    {
      name: "chut-new-store",
    },
  ),
);

export function calculateTimeSpentOnApp(sessionHistory: Session[]) {
  return sessionHistory.reduce(
    (acc, session) => acc + session.measures.length,
    0,
  );
}
