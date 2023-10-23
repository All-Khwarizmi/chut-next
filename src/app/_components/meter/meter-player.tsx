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
import { SoundOptions, useStore } from "~/utils/stores";
import { SoundSelection } from "./sound-selection";

interface MeterPlayerProps {}

const MeterPlayer = ({}: MeterPlayerProps) => {
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

  const slider = (
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
  );
  const startAndStopRecordingButton = isRecording ? (
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
  );

  const soundSwitch = (
    <FormGroup sx={{ placeItems: "center", paddingBottom: 3 }}>
      <FormControlLabel
        control={
          <Switch onChange={() => setIsSound(!isSound)} checked={isSound} />
        }
        label="Sound"
      />
    </FormGroup>
  );
  return (
    <>
      <div className="flex h-screen space-x-12 pt-20 text-center">
        <div className="">
          {isRecording ? (
            <RequestPermission threshold={threshold} isSound={isSound} />
          ) : (
            <p className="pb-5 text-9xl"> 😴</p>
          )}
          {slider}
          <div className="flex place-content-center pt-5">
            <form className="pb-6">
              {soundSwitch}
              <SoundSelection
                selectedSound={soundUrl}
                onSoundChange={handleSoundChange}
              />
            </form>
          </div>
          {startAndStopRecordingButton}
        </div>
      </div>
    </>
  );
};

export default MeterPlayer;