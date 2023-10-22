"use client";

import { useState, useEffect } from "react";
import { useStore } from "~/utils/stores";
import * as Tone from "tone";
import { getDecibel } from "~/utils/toneHelpers";
interface RecordProps {
  threshold: number;
  isSound: boolean;
}

// export function RecordComponent({ threshold, sound, isSound }: RecordProps) {
//   const isRecording = useStore((state) => state.isRecording);
//   const setRecording = useStore((state) => state.setRecording);

//   return (
//     <>
//       {isRecording ? (
//         <div>
//           <RequestPermission
//             threshold={threshold}
//             sound={sound}
//             isSound={isSound}
//           />
//           <button
//             className="rounded-lg  bg-red-500 p-3 px-5 text-base shadow-lg hover:bg-red-600 sm:p-4 sm:px-6 sm:text-lg"
//             onClick={() => setRecording(false)}
//           >
//             Stop
//           </button>
//         </div>
//       ) : (
//         <div>
//           <button
//             className="rounded-lg bg-green-500 p-3 px-5 text-base shadow-lg hover:bg-green-600 sm:p-4 sm:px-6 sm:text-lg"
//             onClick={() => setRecording(true)}
//           >
//             Start Recording
//           </button>
//         </div>
//       )}
//     </>
//   );
// }

export function RequestPermission({ threshold, isSound }: RecordProps) {
  const meter = new Tone.Meter();
  const isRecording = useStore((state) => state.isRecording);
  const [soundUrl, setSoundRef] = useStore((state) => [
    state.soundRef,
    state.setSoundRef,
  ]);

  useEffect(() => {
    const mic = new Tone.UserMedia();
    mic.open();
    mic.connect(meter);
    Tone.context.resume();

    return () => {
      mic.close();
    };
  }, []);

  return (
    <>
      <Meter
        meter={meter}
        threshold={threshold}
        sound={new Audio(soundUrl)}
        isSound={isSound}
      />
    </>
  );
}

export interface MeterProps {
  meter: Tone.Meter;
  threshold: number;
  sound: HTMLAudioElement;
  isSound: boolean;
}

export default function Meter({
  meter,
  threshold,
  sound,
  isSound,
}: MeterProps) {
  const setDecibel = useStore((state) => state.setDecibel);
  const isRecording = useStore((state) => state.isRecording);
  const decibel = useStore((state) => state.decibel);

  useEffect(() => {
    const updateDecibel = () => {
      const val = getDecibel(meter) + 100;
      console.log(val);
      setDecibel(val);
    };

    const intervalId = setInterval(updateDecibel, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <DisplayEmoji
        decibel={useStore((state) => state.decibel)}
        threshold={threshold}
        sound={sound}
        isSound={isSound}
      />
      <p className="py-5 text-lg font-bold">
        Decibels: {decibel === -Infinity ? "..." : decibel}
      </p>
    </div>
  );
}

export interface DisplayEmojiProps {
  decibel: number;
  threshold: number;
  sound: HTMLAudioElement;
  isSound: boolean;
}

function DisplayEmoji({
  decibel,
  threshold,
  sound,
  isSound,
}: DisplayEmojiProps) {
  const emoji = getEmoji(decibel, threshold);
  getSound(decibel, threshold, sound, isSound);
  return <div className="text-9xl">{emoji}</div>;
}

function getEmoji(decibel: number, threshold: number) {
  if (decibel >= threshold) {
    return "🤫";
  } else {
    return "🤓";
  }
}

function getSound(
  decibel: number,
  threshold: number,
  audio: HTMLAudioElement,
  isSound: boolean,
) {
  if (decibel >= threshold && isSound) {
    displaySound(audio);
  }
}

export function displaySound(audio: HTMLAudioElement) {
  audio
    .play()
    .then(() => console.log(audio))
    .catch((e) => console.log(`Something wrong happened: ${e}`));
}
