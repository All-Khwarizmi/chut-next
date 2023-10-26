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
      <Stack spacing={2} direction="row" sx={{}} alignItems="center">
        <Slider
          aria-label="Threshold"
          sx={{ color: theme.palette.primary.main, width: 350, height: 10 }}
          min={30}
          max={110}
          step={5}
          marks={marks}
          valueLabelDisplay={"auto"}
          value={threshold}
          onChange={(_, val) => {
            setThreshold(Array.isArray(val) ? val[0]! : val);
          }}
        />
      </Stack>
    </ThemeProvider>
  );
  const startAndStopRecordingButton = isRecording ? (
    <div className="">
      <button
        className="w-[350px] rounded-lg  bg-red-500 p-3 px-5 text-base shadow-lg hover:bg-red-600 sm:p-4 sm:px-6 sm:text-lg"
        onClick={() => setRecording(false)}
      >
        Stop
      </button>
    </div>
  ) : (
    <div>
      <button
        className="w-[350px] rounded-lg bg-green-500 p-3 px-5 text-base shadow-lg hover:bg-green-600 sm:p-4 sm:px-6 sm:text-lg"
        onClick={() => setRecording(true)}
      >
        Start Recording
      </button>
    </div>
  );

  const soundSwitch = (
    <FormGroup sx={{ placeItems: "center", paddingBottom: 5, fontSize: 28 }}>
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
      <div className="flex h-full  pt-20 text-center">
        <div className="flex flex-col space-y-8">
          {isRecording ? (
            <RequestPermission threshold={threshold} isSound={isSound} />
          ) : (
            <p className=" text-9xl"> 😴</p>
          )}
          <div className="flex place-content-center pb-4">{slider}</div>
          <form className="">
            {soundSwitch}
            <ThemeProvider theme={theme}>
              <Box
                sx={{
                  width: 350,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                }}
              >
                <SoundList />
              </Box>
            </ThemeProvider>
          </form>

          {startAndStopRecordingButton}
        </div>
      </div>
    </>
  );
};

export default MeterPlayer;
