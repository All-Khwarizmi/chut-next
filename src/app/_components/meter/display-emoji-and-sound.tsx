import { useStore } from "~/utils/stores/stores";
import { isTooLoud } from "../helpers/is-too-loud";
import { useEffect } from "react";

export interface DisplayEmojiProps {
  threshold: number;
  sound: HTMLAudioElement;
  isSound: boolean;
}
export function DisplayEmoji({ threshold, sound, isSound }: DisplayEmojiProps) {
  const [sessionArr, isSoundPlaying, setIsSoundPlaying, setRecording] =
    useStore((state) => [
      state.sessionArr,
      state.isSoundPlaying,
      state.setIsSoundPlaying,
      state.setRecording,
    ]);

  const emoji = getEmoji(sessionArr, threshold);

  useEffect(() => {
    if (isTooLoud(sessionArr, threshold) && isSound && !isSoundPlaying) {
      setIsSoundPlaying(true);
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
