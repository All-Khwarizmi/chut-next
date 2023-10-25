"use client";

import AudioUploader from "./_components/audio-uploader";
import VoiceRecorder from "./_components/voice-recorder";
import SelectedListItem from "./_components/sound-selected-list";

export default function Page() {
  const uploadSound = (
    <div className=" flex flex-col items-center gap-y-3 p-4 py-8">
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
      <div className="flex h-full flex-col lg:grid lg:grid-cols-2 ">
        <div className=" flex flex-col place-content-start gap-y-5 p-8 pt-24 md:px-20 md:pt-12">
          {uploadSound}

          <div className="border "></div>

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
