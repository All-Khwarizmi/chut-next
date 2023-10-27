import { useEffect } from "react";
import * as Tone from "tone";
import { useStore } from "~/utils/stores/stores";
import DisplayMeter from "./display-meter";

interface RecordProps {
  threshold: number;
  isSound: boolean;
}

export function SoundContextCreator({ threshold, isSound }: RecordProps) {
  const meter = new Tone.Meter();
  const [soundUrl, setSoundRef, soundList] = useStore((state) => [
    state.soundRef,
    state.setSoundRef,
    state.soundList,
  ]);

  useEffect(() => {
    const mic = new Tone.UserMedia();
    mic.open();
    mic.connect(meter);
    Tone.context.resume();

    // Try to change to this other one
    // mic.context.resume();
    return () => {
      mic.close();
    };
  }, []);

  return (
    <>
      <DisplayMeter
        meter={meter}
        threshold={threshold}
        sound={new Audio(soundUrl)}
        isSound={isSound}
      />
    </>
  );
}
