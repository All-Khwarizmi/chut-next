// Helper function to calculate noise variability
export default function calculateNoiseVariability(measures: number[]) {
  if (measures.length < 2) {
    return 0; // Not enough data to calculate variability
  }

  const mean =
    measures.reduce((acc, measure) => acc + measure, 0) / measures.length;
  const squaredDifferences = measures.map((measure) =>
    Math.pow(measure - mean, 2),
  );
  const variance =
    squaredDifferences.reduce((acc, squaredDiff) => acc + squaredDiff, 0) /
    measures.length;

  return Math.sqrt(variance);
}
