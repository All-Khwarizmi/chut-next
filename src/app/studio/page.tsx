"use client";

import { useStore } from "~/utils/stores";
import MeterPlayer from "../_components/meter/meter-player";
import { SoundSelection } from "../_components/meter/sound-selection";
import AudioUploader from "./audio-uploader";
import UserSounds from "./user-audio-downloader";
import VoiceRecorder from "./voice-recorder";
import SelectedListItem from "../_components/meter/sound-list/sound-selected-list";

export default function Page() {
  const [soundSelected, setSoundRef] = useStore((state) => [
    state.soundRef,
    state.setSoundRef,
  ]);
  return (
    <>
      <div className="grid h-full grid-cols-2">
        <div className="flex place-content-center items-center">
          <div>
            <div className="py-3 text-2xl font-bold"> List of sounds</div>
            <SoundSelection
              selectedSound={soundSelected}
              onSoundChange={setSoundRef}
            />
            <UserSounds />
          </div>
        </div>
        <div className=" flex place-content-center items-center">
          <div className="place flex flex-col items-center gap-y-3">
            <div className="text-2xl font-bold">Upload sound</div>
            <AudioUploader />
          </div>
        </div>
        <div className=" flex place-content-center items-center">
          <div className="place flex flex-col items-center gap-y-3">
            <div className="text-2xl font-bold">Record sound</div>
            <VoiceRecorder />
          </div>
        </div>
        <div className="">
          <SelectedListItem />
        </div>
      </div>
    </>
  );
}
