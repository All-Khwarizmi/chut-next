export async function isAudioFileValid(file: File): Promise<boolean> {
  const maxSizeBytes = 2 * 1024 * 1024; // 2 megabits in bytes
  const maxDurationSeconds = 15; // 15 seconds

  // Check file size
  if (file.size > maxSizeBytes) {
    return false;
  }

  // Check audio duration
  try {
    const audioData = await readFileAsArrayBuffer(file);
    const audioBuffer = await decodeAudioData(audioData);
    const duration = audioBuffer.duration;

    return duration <= maxDurationSeconds;
  } catch (error) {
    // Handle errors when reading or decoding the audio file
    alert(`Error checking audio file: ${error}`);
    return false;
  }
}

// Helper function to read a file as an ArrayBuffer
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as ArrayBuffer"));
      }
    };
    reader.onerror = (event) => {
      reject(new Error("File reading error: " + event.target?.error));
    };
    reader.readAsArrayBuffer(file);
  });
}

// Helper function to decode audio data
function decodeAudioData(data: ArrayBuffer): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(data, resolve, reject);
  });
}

export async function isBlobValid(
  blob: Blob,
  duration: number | null | undefined,
): Promise<boolean> {
  const maxDurationInSeconds = 15; // Maximum duration in seconds
  const maxFileSizeInMegabits = 2; // Maximum file size in megabits

  // Check if the blob is of type 'audio' or 'video'
  if (blob.type.startsWith("audio/")) {
    const fileSizeInBytes = blob.size;
    const fileSizeInMegabits = (fileSizeInBytes * 8) / 1000000; // Convert bytes to megabits
    console.log("File size: ", fileSizeInMegabits);
    console.log("file duration: ", duration);

    if (!duration) {
      console.log("No duration");
      return false;
    }
    return (
      duration <= maxDurationInSeconds &&
      fileSizeInMegabits <= maxFileSizeInMegabits
    );
  } else {
    // Handle other types of files (not audio or video)

    return false;
  }
}

// async function getBlobDuration(blob: Blob): Promise<number> {
//   return new Promise<number>((resolve, reject) => {
//     const audio = new Audio(URL.createObjectURL(blob));
//     audio.onloadedmetadata = () => {
//       console.log("Blob duration: ", audio.duration);
//       resolve(audio.duration);
//     };
//     audio.onerror = (error) => {
//       reject(error);
//     };
//   });
// }
