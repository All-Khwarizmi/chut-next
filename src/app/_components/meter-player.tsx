"use client";
import {
  FormControlLabel,
  FormGroup,
  Slider,
  Stack,
  Switch,
} from "@mui/material";
import React, { useState } from "react";
import { RequestPermission } from "./meter";
import { useStore } from "~/utils/stores";

const MeterPlayer: React.FC = () => {
  const [isSound, setIsSound] = useState(false);
  const [threshold, setThreshold] = useStore((state) => [
    state.threshold,
    state.setThreshold,
  ]);
  const [soundUrl, setSoundRef] = useStore((state) => [
    state.soundRef,
    state.setSoundRef,
  ]);

  const isRecording = useStore((state) => state.isRecording);
  const setRecording = useStore((state) => state.setRecording);
  const handleSoundChange = (sound: string) => {
    setSoundRef(sound);
  };

  const soundOptions = [
    { label: "Sound 1", value: "./shhh.mp3" },
    { label: "Sound 2", value: "./arcade.wav" },
    // Add more sound options as needed
  ];

  return (
    <>
      <div className="flex h-screen space-x-12 pt-20 text-center">
        <div className="">
          {isRecording ? (
            <RequestPermission threshold={threshold} isSound={isSound} />
          ) : (
            <p className="pb-5 text-9xl"> 😴</p>
          )}
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <Slider
              className=""
              aria-label="Threshold"
              sx={{ width: 300, height: 10 }}
              min={30}
              max={110}
              step={5}
              valueLabelDisplay={"auto"}
              value={threshold}
              onChange={(_, val) => {
                console.log(`Threshold is ${val}`);
                setThreshold(Array.isArray(val) ? val[0]! : val);
              }}
            />
          </Stack>
          <div className="flex place-content-center pt-5">
            <form className="pb-6">
              <FormGroup sx={{ placeItems: "center", paddingBottom: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      onChange={() => setIsSound(!isSound)}
                      checked={isSound}
                    />
                  }
                  label="Sound"
                />
              </FormGroup>
              <SoundSelection
                soundOptions={soundOptions}
                selectedSound={soundUrl}
                onSoundChange={handleSoundChange}
              />
            </form>
          </div>
          {isRecording ? (
            <div>
              <button
                className="rounded-lg  bg-red-500 p-3 px-5 text-base shadow-lg hover:bg-red-600 sm:p-4 sm:px-6 sm:text-lg"
                onClick={() => setRecording(false)}
              >
                Stop
              </button>
            </div>
          ) : (
            <div>
              <button
                className="rounded-lg bg-green-500 p-3 px-5 text-base shadow-lg hover:bg-green-600 sm:p-4 sm:px-6 sm:text-lg"
                onClick={() => setRecording(true)}
              >
                Start Recording
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MeterPlayer;

interface SoundOption {
  label: string;
  value: string;
}

interface SoundSelectionProps {
  soundOptions: SoundOption[];
  selectedSound: string;
  onSoundChange: (sound: string) => void;
}

const SoundSelection: React.FC<SoundSelectionProps> = ({
  soundOptions,
  selectedSound,
  onSoundChange,
}) => {
  return (
    <div className=" flex place-content-center pb-6">
      <select
        className="rounded-lg bg-slate-500 p-3 px-5 text-base shadow-lg  sm:p-4 sm:px-6 sm:text-lg"
        value={selectedSound}
        onChange={(e) => {
          console.log(e.target.value);
          onSoundChange(e.target.value);
        }}
      >
        {soundOptions.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
