import { Session } from "../interfaces";


/**
 * Calculates the average noise level during group discussion sessions.
 * @param sessions An array of Session objects.
 * @returns The average noise level during group discussion sessions.
 */
export default function calculateNoiseDuringGroupDiscussions(sessions: Session[]) {
    const groupDiscussionSessions = sessions.filter((session) => session.isGroupDiscussion);
    
    if (groupDiscussionSessions.length === 0) {
      return 0; // No group discussion sessions, return 0
    }

    const totalNoiseLevels = groupDiscussionSessions.reduce(
      (sum, session) => sum + session.measures.reduce((acc, measure) => acc + measure, 0),
      0
    );

    const averageNoise = totalNoiseLevels / groupDiscussionSessions.length;

    return averageNoise;
  }