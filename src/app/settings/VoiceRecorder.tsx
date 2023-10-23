import React, { useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import { initFirebase, storageBucket } from "~/utils/firebase";
import { getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { VoiceRecorderProps } from "./voice-recorder";

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSave }) => {
  const [audioBlob, setAudioBlob] = useState<HTMLAudioElement | null>(null);
  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    setAudioBlob(audio);
  };
  const app = initFirebase();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const handleUploadFile = () => {
    if (audioBlob) {
      const storageRef = ref(
        storageBucket,
        `customers/${user?.uid}/sounds/${audioBlob!.src}`,
      );
      const uploadResult = uploadBytes(storageRef, selectedFile!)
        .then((result) => {
          console.log("Filed uploaded successfully");
          return result;
        })
        .catch((e) => {
          alert(`The following error occured while uploading file: ${e}`);
        });
      uploadResult;
    }
  };
  return (
    <div id="user-records" className="rounded-lg bg-gray-100 p-4 shadow-lg">
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={true}
        downloadFileExtension="webm"
      />
    </div>
  );
};
