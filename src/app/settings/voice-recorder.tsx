import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { AudioRecorder } from "react-audio-voice-recorder";
import { initFirebase, storageBucket } from "~/utils/firebase";
import { getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, uploadBytes } from "firebase/storage";

interface VoiceRecorderProps {
  //   onSave: (audioBlob: Blob) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({}) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    handleUploadFile(blob);
  };
  const app = initFirebase();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const handleUploadFile = (blob: Blob) => {
    if (blob) {
      const storageRef = ref(
        storageBucket,
        `customers/${user?.uid}/sounds/${blob!.text().then((e) => e)}`,
      );
      const uploadResult = uploadBytes(storageRef, blob!)
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
        onRecordingComplete={handleUploadFile}
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

export default VoiceRecorder;
