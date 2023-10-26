import React, { useState, useEffect } from "react";
import { initFirebase, storageBucket } from "~/utils/firebase";
import { getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { TextField } from "@mui/material";
import { useStore } from "~/utils/stores/stores";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { HiPlayPause } from "react-icons/hi2";
import { MdSave } from "react-icons/md";
import { RxReset } from "react-icons/rx";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { theme } from "~/shared/theme";
import { isAudioFileValid, isBlobValid } from "../helpers/audio-helpers";

const VoiceRecorder: React.FC = () => {
  const app = initFirebase();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const [inputField, setInputField] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saveBlob, setSaveBlob] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number | null>();
  const [mediaRecorderLocal, setMediaRecorderLocal] =
    useState<MediaRecorder | null>(null);
  const [update, setUpdate, setUserRecords] = useStore((state) => [
    state.update,
    state.setUpdate,
    state.setUserRecords,
  ]);

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
  useEffect(() => {
    if (mediaRecorder) {
      setMediaRecorderLocal(mediaRecorder);
    }
    if (saveBlob && recordingBlob) {
      handleUploadFile(recordingBlob);
    }
    // setRecordingDuration(recordingTime);
  }, [
    isRecording,
    isPaused,
    recordingTime,
    saveBlob,
    recordingBlob,
    mediaRecorder,
  ]);

  const handleUploadFile = async (blob: Blob) => {
    if (blob && inputField.length !== 0) {
      let isAudioValid = false;
      try {
        isAudioValid = await isBlobValid(blob, recordingDuration);
      } catch (error) {
        alert("L'audio n'est pas valide, veuillez ressayer.");
      }

      if (!isAudioValid) {
        alert(
          "L'audio n'est pas valide, il ne doit pas exceder 15 secondes ou 2mb. Veuillez enregistrer un autre audio puis ressayer.",
        );
        resetRecorder();
        return;
      }
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
            setSaveBlob(false);
            setMediaRecorderLocal(null);
            setRecordingDuration(null);
            alert("Fichier téléchargé avec succès");
          });
        },
      );
    } else {
      setSaveBlob(false);
      alert("Veuillez donner un nom à votre enregistrement et ressayez");
    }
  };

  const resetRecorder = () => {
    stopRecording();
    setMediaRecorderLocal(null);
    setInputField("");
    setSaveBlob(false);
    setRecordingDuration(null);
  };
  const textInput = (
    <TextField
      InputLabelProps={{ style: { color: "white" } }}
      autoFocus={true}
      inputProps={{
        style: {
          color: "white",
          width: 200,
          background: theme.palette.background.paper,
        },
      }}
      sx={{ pt: 2, pb: 2, input: { color: "white" } }}
      required
      id="filled-required"
      label="Name"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setInputField(event.target.value);
      }}
      value={inputField}
      variant="outlined"
    />
  );
  const uploadProgression = uploadProgress !== 0 && (
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

  const recordControls = (
    <div>
      <div className="flex flex-row gap-x-2 py-4">
        <button
          onClick={() => {
            if (!isRecording) {
              startRecording();
              setRecordingDuration(recordingTime);
            } else {
              togglePauseResume();
            }
          }}
          className="flex grow place-content-center rounded-lg bg-slate-800 p-3 text-3xl"
        >
          <HiPlayPause className="text-green-400" />
        </button>

        <button
          onClick={resetRecorder}
          className="flex grow place-content-center rounded-lg bg-slate-800 p-3 text-3xl"
        >
          <RxReset className="text-red-500" />
        </button>
      </div>
      <div className="">
        <button
          onClick={async () => {
            if (!isPaused) {
              togglePauseResume();
            }
            if (inputField.length > 0) {
              if (isRecording) {
                setSaveBlob(true);
                setRecordingDuration(recordingTime);
                stopRecording();
              } else if (!recordingBlob && !isRecording) {
                alert(
                  "Vous devez enregistrer un audio avant de le télécharger",
                );
              } else if (recordingBlob && inputField !== "") {
                await handleUploadFile(recordingBlob);
              }
            } else {
              alert(
                "Veuillez donner un nom à votre enregistrement et ressayez",
              );
            }
          }}
          className="flex w-[230px] place-content-center rounded-lg bg-slate-800 p-3"
        >
          <MdSave className="text-3xl text-blue-600" />
        </button>
      </div>
    </div>
  );
  const audioVisualizer = (
    <div className="flex w-52 flex-row items-center gap-x-2">
      <div className="text-lg  text-slate-800">
        {durationFormatter(recordingTime)}
      </div>
      <LiveAudioVisualizer
        barColor="rgb(15, 23, 42)"
        mediaRecorder={mediaRecorderLocal!}
        width={170}
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
      {mediaRecorderLocal || saveBlob ? audioVisualizer : null}

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
  return `${minutes.toFixed(0).padStart(1, "0")}:${seconds
    .toFixed(0)
    .padStart(2, "0")}`;
};
