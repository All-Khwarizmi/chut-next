"use client";
import AudioUploader from "./_components/audio-uploader";
import VoiceRecorder from "./_components/voice-recorder";
import SelectedListItem from "./_components/selected-list-item";
import { useState } from "react";
import WrongDeviceSnackbar from "~/shared/device-snackbar";
import { WrongDeviceDialog } from "~/shared/wrong-device-dialog";
import SuccessToast from "~/shared/toast";
import { isSafariDesktop } from "~/utils/device-checker";

export default function Page() {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const uploadSound = (
    <div className=" flex flex-col items-center gap-y-3 p-4 py-8">
      <div className="text-2xl  font-bold">Télécharger Un Son</div>
      <AudioUploader />
    </div>
  );
  const recordSound = (
    <div className=" flex place-content-center items-center pt-5">
      <div className="place flex flex-col  items-center gap-y-3">
        <div className="text-2xl font-bold ">Enregistrer Un Son </div>
        <VoiceRecorder />
      </div>
    </div>
  );
  return (
    <>
      <div className="flex flex-col lg:grid lg:grid-cols-2">
        <div className="flex flex-col place-content-start gap-y-5 p-8 pt-24 md:px-20 md:pt-12">
          <div className="flex place-content-center">
            {isSafariDesktop() ? (
              <WrongDeviceSnackbar open={open} handleOpen={handleClickOpen} />
            ) : null}
          </div>

          {uploadSound}
          <div className="border"></div>
          {recordSound}
        </div>
        <div className="flex place-content-center p-5 pt-12 text-center md:pt-24">
          <div className="flex flex-1 place-content-center">
            <SelectedListItem />
          </div>
        </div>
      </div>
      <WrongDeviceDialog open={open} handleClose={handleClose} />
      <SuccessToast />
    </>
  );
}
