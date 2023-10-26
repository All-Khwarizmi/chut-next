"use client";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Slider,
  Stack,
  Switch,
  ThemeProvider,
} from "@mui/material";
import React, { useState } from "react";
import { RequestPermission } from "./meter";
import { useStore } from "~/utils/stores/stores";
import SoundList from "~/app/studio/_components/sound-list";
import { theme } from "~/shared/theme";

const MeterPlayer = () => {
  const [isSound, setIsSound] = useState(false);
  const [threshold, setThreshold] = useStore((state) => [
    state.threshold,
    state.setThreshold,
  ]);

  const [isRecording, setRecording] = useStore((state) => [
    state.isRecording,
    state.setRecording,
  ]);

  const marks = [
    {
      value: 40,
      label: "40 dB",
    },

    {
      value: 60,
      label: "60 dB",
    },

    {
      value: 80,
      label: "80 dB",
    },

    {
      value: 100,
      label: "100 dB",
    },
  ];

  const slider = (
    <ThemeProvider theme={theme}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <Slider
          aria-label="Threshold"
          sx={{ color: theme.palette.primary.main }}
          min={30}
          max={110}
          step={5}
          size="medium"
          marks={marks}
          valueLabelDisplay={"auto"}
          value={threshold}
          onChange={(_, val) => {
            console.log(`Threshold is ${val}`);
            setThreshold(Array.isArray(val) ? val[0]! : val);
          }}
        />
      </Stack>
    </ThemeProvider>
  );
  const startAndStopRecordingButton = isRecording ? (
    <div className="">
      <button
        className="w-[370px] rounded-lg  bg-red-500 p-3 px-5 text-base shadow-lg hover:bg-red-600 sm:p-4 sm:px-6 sm:text-lg"
        onClick={() => setRecording(false)}
      >
        Stop
      </button>
    </div>
  ) : (
    <div>
      <button
        className="w-[370px] rounded-lg bg-green-500 p-3 px-5 text-base shadow-lg hover:bg-green-600 sm:p-4 sm:px-6 sm:text-lg"
        onClick={() => setRecording(true)}
      >
        Start Recording
      </button>
    </div>
  );

  const soundSwitch = (
    <FormGroup sx={{ placeItems: "center", paddingBottom: 3, fontSize: 20 }}>
      <FormControlLabel
        control={
          <Switch onChange={() => setIsSound(!isSound)} checked={isSound} />
        }
        label="Activer Son"
      />
    </FormGroup>
  );
  return (
    <>
      <div className="flex h-full space-x-12 pt-20 text-center">
        <div className="flex flex-col place-content-center">
          {isRecording ? (
            <RequestPermission threshold={threshold} isSound={isSound} />
          ) : (
            <p className="pb-8 text-9xl"> 😴</p>
          )}
          {slider}
          <div className="flex place-content-center pt-8">
            <form className="pb-6">
              {soundSwitch}
              <ThemeProvider theme={theme}>
                <Box
                  sx={{
                    width: 370,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                  }}
                >
                  <SoundList />
                </Box>
              </ThemeProvider>
            </form>
          </div>
          {startAndStopRecordingButton}
        </div>
      </div>
    </>
  );
};

export default MeterPlayer;
