import { Session } from "../interfaces";

export default function calculateNoiseDuringSpecificSubjects(
  sessions: Session[],
) {
  const subjects = [
    ...new Set(sessions.map((session) => session.subject ?? "")),
  ];

  const averageNoiseBySubject: Record<string, number> = {};

  subjects.forEach((subject) => {
    const subjectSessions = sessions.filter(
      (session) => session.subject === subject,
    );

    if (subjectSessions.length === 0) {
      averageNoiseBySubject[subject] = 0; // No sessions for the subject, set average noise to 0
      return;
    }

    const totalNoiseLevels = subjectSessions.reduce(
      (sum, session) =>
        sum + session.measures.reduce((acc, measure) => acc + measure, 0),
      0,
    );

    const averageNoise = totalNoiseLevels / subjectSessions.length;

    averageNoiseBySubject[subject] = averageNoise;
  });

  return averageNoiseBySubject;
}
