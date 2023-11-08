import { useCallback, useEffect } from "react";
import * as Tone from "tone";
import { useStore } from "~/utils/stores/stores";
import DisplayMeter from "./display-meter";

interface RecordProps {
  threshold: number;
  isSound: boolean;
}

export function SoundContextCreator({ threshold, isSound }: RecordProps) {
  const [soundUrl, setSoundRef, soundList, isRecording] = useStore((state) => [
    state.soundRef,
    state.setSoundRef,
    state.soundList,
    state.isRecording,
  ]);

  // If statement and display conditionally
  const meter = new Tone.Meter();

  useEffect(() => {
    const mic = new Tone.UserMedia();
    if (isRecording) {
      mic
        .open()
        .then(() => console.log("Mic openned"))
        .catch((e) => console.log("Error openning mic: " + e));
      mic.connect(meter);
      meter.context.resume();
    } else {
      console.log("Mic closed");
      mic.close();
      mic.dispose();
      meter.dispose();
    }

    return () => {
      mic.close();
      mic.dispose();
      meter.dispose();
    };
  }, [isRecording]);
  if (!isRecording) {
    return <p className=" text-9xl"> 😴</p>;
  } else {
    return (
      <>
        <DisplayMeter meter={meter} threshold={threshold} isSound={isSound} />
      </>
    );
  }
}
