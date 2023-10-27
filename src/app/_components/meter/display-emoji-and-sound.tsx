import { useStore } from "~/utils/stores/stores";
import { isTooLoud } from "../helpers/is-too-loud";

export interface DisplayEmojiProps {
  threshold: number;
  sound: HTMLAudioElement;
  isSound: boolean;
}
export function DisplayEmoji({ threshold, sound, isSound }: DisplayEmojiProps) {
  const [sessionArr, isSoundPlaying, setIsSoundPlaying] = useStore((state) => [
    state.sessionArr,
    state.isSoundPlaying,
    state.setIsSoundPlaying,
  ]);
  const emoji = getEmoji(sessionArr, threshold);
  if (isTooLoud(sessionArr, threshold) && isSound && !isSoundPlaying) {
    setIsSoundPlaying(true);
    sound
      .play()
      .then(() =>
        setTimeout(
          () => setIsSoundPlaying(false),
          sound.duration * 1000 + 1500,
        ),
      )
      .catch((e) => {
        //!
        alert(`Something wrong happened trying to display the audio: ${e}`);
        setIsSoundPlaying(false);
      });
  }
  return <div className="pb-3 text-9xl">{emoji}</div>;
}

function getEmoji(sessions: number[], threshold: number) {
  if (isTooLoud(sessions, threshold)) {
    return "🤫";
  } else {
    return "🤓";
  }
}
