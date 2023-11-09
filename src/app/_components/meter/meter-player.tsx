"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Slider,
  Stack,
  Switch,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStore } from "~/utils/stores/stores";
import SoundList from "~/app/studio/_components/soundtheque";
import { theme } from "~/shared/theme";
import { SoundContextCreator } from "./sound-context-creator";
import { isSafariDesktop } from "~/utils/device-checker";
import { WrongDeviceDialog } from "~/shared/wrong-device-dialog";
import { set } from "zod";

const MeterPlayer = () => {
  const [isSound, setIsSound] = useState(false);
  const [sound, setSound] = useState<HTMLAudioElement | undefined>();
  const [threshold, setThreshold, soundRef] = useStore((state) => [
    state.threshold,
    state.setThreshold,
    state.soundRef,
  ]);

  useEffect(() => {
    setSound(new Audio(soundRef));
  }, [soundRef]);
  const [isRecording, setRecording] = useStore((state) => [
    state.isRecording,
    state.setRecording,
  ]);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          sx={{ color: theme.palette.primary.main, width: 340, height: 10 }}
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
        className="w-[340px] rounded-lg  bg-red-500 p-3 px-5 text-base shadow-lg hover:bg-red-600 sm:p-4 sm:px-6 sm:text-lg"
        onClick={() => {
          if (!isSafariDesktop()) {
            setRecording(false);
          } else {
            setOpen(false);
          }
        }}
      >
        Stop
      </button>
    </div>
  ) : (
    <div>
      <button
        className="w-[340px] rounded-lg bg-green-500 p-3 px-5 text-base shadow-lg hover:bg-green-600 sm:p-4 sm:px-6 sm:text-lg"
        onClick={() => {
          if (!isSafariDesktop()) {
            setRecording(true);
          } else {
            setOpen(true);
          }
        }}
      >
        Start Recording
      </button>
    </div>
  );

  const soundSwitch = (
    <FormGroup sx={{ placeItems: "center", paddingBottom: 5, fontSize: 28 }}>
      <FormControlLabel
        control={
          <Switch
            onChange={() => {
              setIsSound(!isSound);
              setSound(new Audio(soundRef));
            }}
            checked={isSound}
          />
        }
        sx={{ fontSize: 28 }}
        label="Activer Son"
      />
    </FormGroup>
  );

  return (
    <>
      <div className="flex h-full  pt-20 text-center">
        <div className="flex flex-col space-y-5">
          <SoundContextCreator
            threshold={threshold}
            isSound={isSound}
            sound={sound}
          />

          <div className="flex place-content-center pb-4">{slider}</div>
          <form className="flex flex-col place-content-center">
            {soundSwitch}
            <ThemeProvider theme={theme}>
              <Box
                sx={{
                  width: 340,
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
      <WrongDeviceDialog open={open} handleClose={handleClose} />
    </>
  );
};

export default MeterPlayer;
