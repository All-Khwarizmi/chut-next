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
  const uploadSound = (
    <div className="place flex flex-col items-center gap-y-3 pb-5">
      <div className="text-2xl font-bold">Upload sound</div>
      <AudioUploader />
    </div>
  );
  const recordSound = (
    <div className=" flex place-content-center items-center pt-5">
      <div className="place flex flex-col  items-center gap-y-3">
        <div className="text-2xl font-bold ">Record sound</div>
        <VoiceRecorder />
      </div>
    </div>
  );
  return (
    <>
      <div className="h-full lg:grid lg:grid-cols-2 ">
        <div className=" flex flex-col place-content-start gap-y-5 p-5 pt-12">
          {uploadSound}
          <div className="border"></div>
          {recordSound}
        </div>
        <div className="flex place-content-center p-5 pt-12 text-center">
          <div className="flex flex-1 place-content-center">
            <SelectedListItem />
          </div>
        </div>
      </div>
    </>
  );
}
