import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { AudioRecorder } from "react-audio-voice-recorder";
import { initFirebase, storageBucket } from "~/utils/firebase";
import { getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, uploadBytes } from "firebase/storage";
import { TextField } from "@mui/material";
import { useStore } from "~/utils/stores";

interface VoiceRecorderProps {
  //   onSave: (audioBlob: Blob) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({}) => {
  const [inputField, setInputField] = useState<string | null>(null);
  const [update, setUpdate] = useStore((state) => [
    state.update,
    state.setUpdate,
  ]);
  const app = initFirebase();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  const handleUploadFile = (blob: Blob) => {
    if (blob && inputField && inputField.length !== 0) {
      const storageRef = ref(
        storageBucket,
        `customers/${user?.uid}/records/${inputField}`,
      );
      const uploadResult = uploadBytes(storageRef, blob!)
        .then((result) => {
          console.log("Filed uploaded successfully");
          return result;
        })
        .catch((e) => {
          alert(`The following error occured while uploading file: ${e}`);
        });
      setUpdate(!update);
    }
  };

  return (
    <div
      id="user-records"
      className="bg-mediumGray place flex flex-col place-items-center gap-y-3 rounded-lg p-4"
    >
      <TextField
        InputLabelProps={{ style: { color: "white" } }}
        inputProps={{ style: { color: "white" } }}
        sx={{ pt: 2, pb: 2, input: { color: "white" } }}
        required
        id="filled-required"
        label="Name"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInputField(event.target.value);
        }}
        defaultValue="Silence"
        variant="filled"
      />
      <AudioRecorder
        onRecordingComplete={handleUploadFile}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={false}
        downloadFileExtension="webm"
      />
    </div>
  );
};

export default VoiceRecorder;
