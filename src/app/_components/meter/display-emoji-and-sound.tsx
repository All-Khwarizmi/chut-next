import { useStore } from "~/utils/stores/stores";
import { isTooLoud } from "../helpers/is-too-loud";
import { useEffect } from "react";

export interface DisplayEmojiProps {
  threshold: number;
  sound?: HTMLAudioElement;
  isSound: boolean;
}
export function DisplayEmoji({ threshold, isSound, sound }: DisplayEmojiProps) {
  const [
    sessionArr,
    isSoundPlaying,
    setIsSoundPlaying,
    setRecording,
    soundRef,
  ] = useStore((state) => [
    state.sessionArr,
    state.isSoundPlaying,
    state.setIsSoundPlaying,
    state.setRecording,
    state.soundRef,
  ]);

  const emoji = getEmoji(sessionArr, threshold);

  useEffect(() => {
    if (isTooLoud(sessionArr, threshold) && isSound && !isSoundPlaying) {
      setIsSoundPlaying(true);
      const audioCtx = new AudioContext();
      audioCtx.resume();

      if (sound) {
        sound
          .play()
          .then(() => {
            setTimeout(
              () => setIsSoundPlaying(false),
              sound.duration * 1000 + 2000,
            );
          })
          .catch((e) => {
            setRecording(false);
            setIsSoundPlaying(false);
            alert(`Something wrong happened trying to display the audio: ${e}`);
          });
      }
    }
  }, [isSoundPlaying, isSound, sessionArr.length]);

  return <div className="pb-3 text-9xl">{emoji}</div>;
}

function getEmoji(sessions: number[], threshold: number) {
  if (isTooLoud(sessions, threshold)) {
    return "🤫";
  } else {
    return "🤓";
  }
}
