import React, { useState, useEffect } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import { initFirebase, storageBucket } from "~/utils/firebase";
import { getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { TextField } from "@mui/material";
import { useStore } from "~/utils/stores";

interface VoiceRecorderProps {
  // onSave: (audioBlob: Blob) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({}) => {
  const [inputField, setInputField] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const app = initFirebase();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const [update, setUpdate, setUserRecords] = useStore((state) => [
    state.update,
    state.setUpdate,
    state.setUserRecords,
  ]);

  const handleUploadFile = (blob: Blob) => {
    if (blob && inputField && inputField.length !== 0) {
      const storageRef = ref(
        storageBucket,
        `customers/${user?.uid}/records/${inputField}`,
      );
      const uploadTask = uploadBytesResumable(storageRef, blob!);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          setUploadProgress(progress); // Update the progress state
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Error uploading file:", error);
          alert(`The following error occurred while uploading file: ${error}`);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            // You can use downloadURL here if needed
            setUserRecords({ label: inputField, value: downloadURL });
            setUpdate(!update);
            setUploadProgress(0); // Reset the progress
            setInputField(null);
          });
        },
      );
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
      {isRecording && (
        <div className="mt-2">
          <div className="relative h-2 w-full bg-blue-200">
            <div
              className="h-2 bg-blue-500"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-center text-sm">
            Upload Progress: {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
