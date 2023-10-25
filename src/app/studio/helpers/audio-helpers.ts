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
