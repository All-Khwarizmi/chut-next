// User.ts
interface User {
  userId: string;
  frequencyOfUse: number;
  timeSpentOnApp: number;
  featureUtilization: Record<string, number>;
  effectivenessRating?: number; // If effectiveness rating is added to user metrics
  comments?: string; // If comments are added to user metrics
  // ... (other properties)
}

export interface Session {
  date: Date;
  timestamp: number;
  measures: number[];

  // Trend Analysis Metrics
  weeklyAverageNoise?: number;
  monthlyAverageNoise?: number;
  trendIndicator?: "Upward" | "Downward" | "Stable";
  noiseVariability?: number; // New property for noise variability
  noisePatterns?: string[]; // New property for noise patterns
  noiseLevels?: number[]; // Assuming you store noise levels in each session

  // Noise Level Analysis Metrics
  collaborativeNoiseLevels?: number;
  individualNoiseLevels?: number;

  // Correlation Analysis Metrics
  noiseDuringGroupDiscussions?: number;
  noiseDuringSpecificSubjects?: Record<string, number>;

  // Frequency Distribution Metrics
  commonNoiseRanges?: number[];
  dominantFrequencies?: number[];

  // State Duration Analysis Metrics
  averageDurationHighNoise?: number;
  averageDurationLowNoise?: number;

  // User Feedback Metrics
  effectivenessRating?: number;
  comments?: string;

  classSize: number;

  // Additional Context
  isCollaborativeActivity?: boolean; // For differentiating between collaborative and individual activities
  isSoundOn?: boolean; // For tracking whether sound alerts were active
  soundName?: string; // For tracking the name of the sound triggered

  // ... (other properties)
  isGroupDiscussion?: boolean;
  subject?: string;
  calmDurations: number[]; // Array to store calm durations
  impactOnLearning: "positive" | "neutral" | "negative" | null; // New property for feedback
}
export interface State {
  sessionArr: number[];
  sessionHistory: Session[];
  user?: User;
  isSoundOn: false;
  soundName: string;
  threshold: number;
  classSize: number;

  isCollaborativeActivity: boolean;
  impactOnLearning: "positive" | "neutral" | "negative" | null; // New property for feedback
  submitImpactFeedback: (impact: Session["impactOnLearning"]) => void; // New action to submit impact feedback
  setSession: (measure: number, isSoundOn: boolean, soundName: string) => void;
  pushSessionArr: () => void;
  getSessionsForDay: (day: Date) => Session[];
  getAverageBackToCalmTime: () => number;
  trackUserInteraction: (userId: string, feature: string) => void;
  // ... (other state properties)
}

export default User;
