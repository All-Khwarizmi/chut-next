// Helper function to identify noise patterns
export default function identifyNoisePatterns(measures: number[]) {
  const noisePatterns = [];

  for (let i = 1; i < measures.length - 1; i++) {
    const currentMeasure = measures[i];
    const previousMeasure = measures[i - 1];
    const nextMeasure = measures[i + 1];

    // Check if measures are defined
    if (
      currentMeasure === undefined ||
      previousMeasure === undefined ||
      nextMeasure === undefined
    ) {
      continue;
    } // Skip this iteration if any of the measures are undefined

    // Check for a flatline - a measure equal to its neighbors
    if (currentMeasure === previousMeasure && currentMeasure === nextMeasure) {
      noisePatterns.push("Flatline detected");
    }
    // Check for a valley - a measure lower than its neighbors
    if (currentMeasure < previousMeasure && currentMeasure < nextMeasure) {
      noisePatterns.push("Valley detected");
    }

    // Check for a peak - a measure higher than its neighbors
    if (currentMeasure > previousMeasure && currentMeasure > nextMeasure) {
      noisePatterns.push("Peak detected");
    }
    // You can add more conditions to identify other patterns based on your requirements
  }

  return noisePatterns;
}
