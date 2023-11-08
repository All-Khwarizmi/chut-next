import { GoogleAuthProvider, getAuth } from "@firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase, storageBucket } from "~/utils/firebase";
import { checkPremiumUsage } from "~/utils/stores/store-helpers";
import { useStore } from "~/utils/stores/stores";
import { isAudioFileValid } from "../helpers/audio-helpers";
import { getPremiumStatus } from "~/app/account/helpers/get-premium-status";
import { GoPremiumDialog } from "~/shared/premium-dialog";
import { NotSignedInDialog } from "~/shared/auth-dialog";
import { set } from "zod";

//
const AudioUploader: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0); // Added progress state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState<string>(crypto.randomUUID());
  const app = initFirebase();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [user] = useAuthState(auth);
  const [
    update,
    setUpdate,
    setUserSounds,
    userSounds,
    userRecords,
    checkSoundName,
  ] = useStore((state) => [
    state.update,
    state.setUpdate,
    state.setUserSounds,
    state.userSounds,
    state.userRecords,
    state.checkSoundName,
  ]);
  const [isConnected, setIsConnected] = useState<boolean>(
    () => auth.currentUser !== null,
  );
  const [openAuhtDialog, setOpenAuthDialog] = useState(false);
  const [openPremiumDialog, setOpenPremiumDialog] = useState(false);
  const handleClickOpen = () => {
    isConnected ? setOpenPremiumDialog(true) : setOpenAuthDialog(true);
  };

  const handleClose = () => {
    isConnected ? setOpenPremiumDialog(false) : setOpenAuthDialog(false);
  };
  /**
   * @description Uploads a file to firebase storage and adds it to the user's collection of sounds
   * @returns
   */
  const handleUploadFile = async () => {
    if (user) {
      if (await getPremiumStatus(app)) {
        if (selectedFile) {
          // Check if user has selected a file
          // Check if user has exceeded the prumim usage limit
          if (checkPremiumUsage(userSounds, userRecords)) {
            alert("Vous avez déjà atteint le nombre de fichiers autorisés");
            setSelectedFile(null);
            setInputKey(crypto.randomUUID());
            return;
          }
          if (!checkSoundName(selectedFile.name)) {
            alert(
              "Le nom du fichier est déjà utilisé, veuillez renommer votre fichier.",
            );
            setSelectedFile(null);
            return;
          }
          let isFileValid: boolean = false;
          try {
            isFileValid = await isAudioFileValid(selectedFile);
          } catch (error) {
            console.log(error);
            alert(
              "Selectionnez un fichier audio valide. Celui-ci ne doit pas exceder 15 secondes ou 2mb",
            );
            setSelectedFile(null);
          }

          if (!isFileValid) {
            alert(
              "Selectionnez un fichier audio valide. Celui-ci ne doit pas exceder 15 secondes ou 2mb",
            );
            setSelectedFile(null);
            return;
          }
          const storageRef = ref(
            storageBucket,
            `customers/${user?.uid}/sounds/${selectedFile!.name}`,
          );

          const uploadTask = uploadBytesResumable(storageRef, selectedFile);

          // Listen for state changes and progress
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
              alert(
                `The following error occurred while uploading file: ${error}`,
              );
            },
            () => {
              // Handle successful uploads on complete
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setUserSounds({
                  label: selectedFile.name,
                  value: downloadURL,
                });
                setUpdate(!update);
                setSelectedFile(null); // Reset the input field
                setUploadProgress(0); // Reset the progress
                alert("Fichier téléchargé avec succès");
              });
            },
          );
        } else {
          alert("Selectionnez un fichier audio");
        }
      } else {
        setOpenPremiumDialog(true);
      }
    } else {
      setOpenAuthDialog(true);
    }
  };
  // Handle drag events on the dropzone element (the whole div)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    console.log(`Dragging over: ${JSON.stringify(e.dataTransfer.getData(""))}`);
  };

  //Check if file is audio format
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Check if any files were dropped
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      // Check if the dropped file is of type 'audio'
      if (file && file!.type.startsWith("audio/")) {
        console.log(`Dropped: ${JSON.stringify(file.name)}`);

        setSelectedFile(file);
        setInputKey(crypto.randomUUID());
      } else {
        // Display an error message or alert if it's not an audio file
        alert("Please drop an audio file (e.g., MP3 or WAV).");
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.files;
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.name === selectedFile?.name) {
        alert("Vous avez déjà sélectionné ce fichier");
        setInputKey(crypto.randomUUID());
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <>
      <div className="flex h-full ">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className=" cursor-pointer place-content-center items-center border-2 border-dashed border-gray-300 p-4 py-4 text-center md:p-4  lg:py-8"
        >
          <input
            type="file"
            accept="audio/*"
            className="w-[320px]  sm:w-auto"
            key={inputKey}
            onChange={handleFileInput}
          />

          {selectedFile && (
            <p className="mt-4">Fichier selectionné: {selectedFile.name}</p>
          )}

          {uploadProgress > 0 && (
            <div className="mt-2">
              <div className="relative h-2 w-full bg-blue-200">
                <div
                  className="h-2 bg-blue-500"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-center text-sm">
                Progression: {uploadProgress}%
              </p>
            </div>
          )}

          <div className="py-2"></div>
          <button
            onClick={handleUploadFile}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Télécharger Fichier Audio
          </button>
        </div>
      </div>
      <GoPremiumDialog
        open={openPremiumDialog}
        handleClose={handleClose}
        app={app}
        message="Vous devez être premium pour télécharger des fichiers audio"
      />
      <NotSignedInDialog
        open={openAuhtDialog}
        handleClose={handleClose}
        auth={auth}
        provider={provider}
        app={app}
        message="Vous devez être connecté pour télécharger des fichiers audio"
      />
    </>
  );
};

export default AudioUploader;
