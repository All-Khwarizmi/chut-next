import * as Tone from "tone";
/**
 * @description Returns the current peak decibel value from a Tone.Meter
 * @param {Tone.Meter} meter - The meter to get the current decibel value from
 * @returns {number} The current peak decibel value
 */
export function getDecibel(meter: Tone.Meter): number {
  const decibel = meter.getValue();
  if (Array.isArray(decibel)) {
    return decibel[0]!;
  }
  return Math.floor(decibel);
}
