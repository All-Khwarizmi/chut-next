import * as Tone from "tone";

export function getDecibel(meter: Tone.Meter) {
  const decibel = meter.getValue();
  if (Array.isArray(decibel)) {
    return decibel[0]! + 18;
  }
  return Math.floor(decibel) + 18;
}
