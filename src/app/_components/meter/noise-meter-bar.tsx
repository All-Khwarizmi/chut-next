// import { useEffect, useRef } from "react";

// const NoiseMeterBar: React.FC<{ audioContext: AudioContext }> = ({
//   audioContext,
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const analyzerRef = useRef<AnalyserNode | null>(null);
//   const requestIdRef = useRef<number | null>(null);

//   useEffect(() => {
//     if (audioContext) {
//       // Create an analyzer node and connect it to the audioContext
//       analyzerRef.current = audioContext.createAnalyser();
//       analyzerRef.current.fftSize = 256;
//       audioContext
//         .createMediaStreamSource(audioContext.destination)
//         .connect(analyzerRef.current);

//       const canvas = canvasRef.current;
//       if (canvas) {
//         const canvasContext = canvas.getContext("2d");
//         const bufferLength = analyzerRef.current.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);

//         const drawMeter = () => {
//           if (canvasContext) {
//             analyzerRef.current.getByteFrequencyData(dataArray);

//             const width = canvas.width;
//             const height = canvas.height;

//             canvasContext.clearRect(0, 0, width, height);
//             canvasContext.fillStyle = "rgb(0, 0, 0)";
//             canvasContext.fillRect(0, 0, width, height);

//             const barWidth = (width / bufferLength) * 2;
//             let x = 0;

//             for (let i = 0; i < bufferLength; i++) {
//               const barHeight = dataArray[i];

//               canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
//               canvasContext.fillRect(
//                 x,
//                 height - barHeight / 2,
//                 barWidth,
//                 barHeight / 2,
//               );

//               x += barWidth + 1;
//             }

//             requestIdRef.current = requestAnimationFrame(drawMeter);
//           }
//         };

//         drawMeter();
//       }
//     }

//     return () => {
//       if (requestIdRef.current) {
//         cancelAnimationFrame(requestIdRef.current);
//       }
//     };
//   }, [audioContext]);

//   return <canvas ref={canvasRef} width={400} height={100} />;
// };

// export default NoiseMeterBar;
