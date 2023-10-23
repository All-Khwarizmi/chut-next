import { getAuth } from "@firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase, storageBucket } from "~/utils/firebase";

const AudioUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const app = initFirebase();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  const handleUploadFile = () => {
    if (selectedFile) {
      const storageRef = ref(
        storageBucket,
        `customers/${user?.uid}/sounds/${selectedFile!.name}`,
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
      console.log(`Input: ${JSON.stringify(file.name)}`);

      setSelectedFile(file);
    }
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="cursor-pointer border-2 border-dashed border-gray-300 p-4 text-center"
      >
        <input
          type="file"
          accept="audio/*"
          className=""
          onChange={handleFileInput}
        />

        {selectedFile && (
          <p className="mt-4">Selected File: {selectedFile.name}</p>
        )}
      </div>
      <div className="py-2"></div>
      <button
        onClick={handleUploadFile}
        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Upload Audio File
      </button>
    </>
  );
};

export default AudioUploader;
