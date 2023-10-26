import React, { useState, useEffect, useRef } from "react";
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
import { useStore } from "~/utils/stores/stores";
import { useAudioRecorder, AudioRecorder } from "react-audio-voice-recorder";
import { HiPlayPause } from "react-icons/hi2";
import { MdStopCircle } from "react-icons/md";
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";

interface VoiceRecorderProps {
  // onSave: (audioBlob: Blob) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({}) => {
  const [inputField, setInputField] = useState<string>("");
  const [isRecordingOld, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaRecorderLocal, setMediaRecorderLocal] =
    useState<MediaRecorder | null>(null);
  const app = initFirebase();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const [update, setUpdate, setUserRecords] = useStore((state) => [
    state.update,
    state.setUpdate,
    state.setUserRecords,
  ]);

  // new
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder();
  const recorderControls = useAudioRecorder();
  useEffect(() => {
    console.log("Is recording: ", isRecording);
    console.log("Is paused: ", isPaused);
    console.log("recoding time: ", recordingTime);
    console.log("Media recorder: ", mediaRecorder);
    if (!mediaRecorderLocal && mediaRecorder) {
      setMediaRecorderLocal(mediaRecorder);
    }
  }, [isRecording, isPaused, recordingTime]);

  const handleUploadFile = (blob: Blob) => {
    if (blob && inputField.length !== 0) {
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
            setInputField("");
          });
        },
      );
    }
  };

  const oldRecorder = (
    <div
      id="user-records"
      className="place flex w-[360px] flex-col place-items-center gap-y-3 rounded-lg bg-mediumGray p-4"
    >
      <TextField
        InputLabelProps={{ style: { color: "white" } }}
        inputProps={{ width: 300, style: { color: "white" } }}
        sx={{ width: 300, pt: 2, pb: 2, input: { color: "white" } }}
        required
        id="filled-required"
        label="Name"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInputField(event.target.value);
        }}
        value={inputField}
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
      {isRecordingOld && (
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

  const textInput = (
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
      value={inputField}
      variant="filled"
    />
  );
  const uploadProgression = isRecordingOld && (
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
  );
  const recorderBloc = (
    <AudioRecorder
      onRecordingComplete={handleUploadFile}
      audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }}
      downloadOnSavePress={false}
      downloadFileExtension="webm"
      recorderControls={recorderControls}
      showVisualizer={true}
    />
  );
  const recordControls = (
    <div>
      <div className="flex flex-row gap-x-2 py-4">
        <button
          onClick={() => {
            if (!isRecording) {
              startRecording();
            } else {
              togglePauseResume();
            }
          }}
          className="flex grow place-content-center rounded-lg bg-green-400 p-4 text-3xl"
        >
          <HiPlayPause />
        </button>

        <button
          onClick={() => {
            stopRecording();
          }}
          className="flex grow place-content-center rounded-lg bg-red-500 p-4 text-3xl"
        >
          <MdStopCircle />
        </button>
      </div>
      <div className="">
        <button
          onClick={() => {
            console.log("Saving file", recordingBlob);

            if (isRecording) {
              stopRecording();
            }
            if (recordingBlob) {
              handleUploadFile(recordingBlob);
            } else {
              alert("Vous devez enregistrer un audio avant de le télécharger");
            }
          }}
          className="w-[230px] rounded-lg bg-blue-500 p-4"
        >
          Save
        </button>
      </div>
    </div>
  );
  const audioVisualizer = mediaRecorderLocal && (
    <div className="flex flex-row items-center gap-x-2">
      <div className="text-lg  text-slate-200">
        {durationFormatter(recordingTime)}
      </div>
      <LiveAudioVisualizer
        mediaRecorder={mediaRecorderLocal}
        width={200}
        height={30}
      />
    </div>
  );
  const newRecorder = (
    <div
      id="user-records"
      className="place flex w-[360px] flex-col place-items-center gap-y-3 rounded-lg bg-mediumGray p-4"
    >
      {textInput}
      {audioVisualizer}
      {recordControls}
      {uploadProgression}
    </div>
  );

  return newRecorder;
};

export default VoiceRecorder;

export const durationFormatter = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes.toFixed(0).padStart(2, "0")}:${seconds
    .toFixed(0)
    .padStart(2, "0")}`;
};
