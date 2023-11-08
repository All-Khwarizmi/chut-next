import { useStore } from "~/utils/stores/stores";
import { isTooLoud } from "../helpers/is-too-loud";
import { useEffect } from "react";

export interface DisplayEmojiProps {
  threshold: number;

  isSound: boolean;
}
export function DisplayEmoji({ threshold, isSound }: DisplayEmojiProps) {
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
    console.log("display emoji and sound");
    if (isTooLoud(sessionArr, threshold) && isSound && !isSoundPlaying) {
      setIsSoundPlaying(true);
      const audio = new Audio();
      audio.src = soundRef;
      audio
        .play()
        .then(() => {
          setTimeout(
            () => setIsSoundPlaying(false),
            audio.duration * 1000 + 2000,
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
