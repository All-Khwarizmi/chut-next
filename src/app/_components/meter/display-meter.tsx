"use client";
import { useEffect } from "react";
import { useStore } from "~/utils/stores/stores";
import * as Tone from "tone";
import { getDecibel } from "~/utils/tone-helpers";
import { DisplayEmoji } from "./display-emoji-and-sound";
import { noiseLevelComment } from "../helpers/noise-levels-comment";
import { isTooLoud } from "../helpers/is-too-loud";

export interface MeterProps {
  meter: Tone.Meter;
  threshold: number;
  sound: HTMLAudioElement;
  isSound: boolean;
}

export default function DisplayMeter({
  meter,
  threshold,
  sound,
  isSound,
}: MeterProps) {
  const [decibel, setDecibel, sessionArr, setSession, setRecording] = useStore(
    (state) => [
      state.decibel,
      state.setDecibel,
      state.sessionArr,
      state.setSession,
      state.setRecording,
    ],
  );

  useEffect(() => {
    const updateDecibel = () => {
      const val = getDecibel(meter) + 100;
      setDecibel(val);
      setSession(val);
      isInfinity(sessionArr);
    };

    const intervalId = setInterval(updateDecibel, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [sessionArr]);

  // Check if the two last measurements == -Infinity and if so set isRecording to false. On Chrome after reloading the page or other interruption the media api asks for an user action to display allow any audio context.
  const isInfinity = (measuresArr: number[]): void => {
    const len = measuresArr.length;
    const lastElement = measuresArr[len - 1];
    const secondLastElement = measuresArr[len - 2];
    const isInfinity =
      lastElement === -Infinity && secondLastElement === -Infinity;
    if (isInfinity) {
      setRecording(false);
    }
  };

  return (
    <div>
      <DisplayEmoji threshold={threshold} sound={sound} isSound={isSound} />
      <div className="flex place-content-center items-center gap-x-2 pt-3">
        <p
          className={` text-5xl font-bold ${
            isTooLoud(sessionArr, threshold) ? "text-red-500" : "text-green-500"
          }`}
        >
          {decibel === -Infinity ? "..." : decibel}
        </p>{" "}
        <p className="text-5xl"> dB</p>
      </div>
      <div>
        <p className="text-lg text-slate-400">({noiseLevelComment(decibel)})</p>
      </div>
    </div>
  );
}