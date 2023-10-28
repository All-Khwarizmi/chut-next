import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase, storageBucket } from "~/utils/firebase";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { SoundOptions, useStore } from "~/utils/stores/stores";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { styled } from "@mui/material/styles";
import { IconButton, ListSubheader, ListItem, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { PlayArrow } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";

interface AudioTestProps {
  audioUrl: string | null;
  isOpen: boolean;
  handleClose: () => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function AudioTest({
  audioUrl,
  isOpen: open,
  handleClose,
}: AudioTestProps) {
  const playSoundDialog = (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        sx={{ m: 0, p: 4 }}
        id="customized-dialog-title"
      ></DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {" "}
        <Button
          sx={{
            paddingTop: 5,
            paddingBottom: 5,
            paddingRight: 8,
            paddingLeft: 8,
          }}
          autoFocus
          onClick={() => {
            if (audioUrl) {
              console.log(audioUrl);
              const sampleAudio = new Audio(audioUrl);
              //   sampleAudio.load();
              sampleAudio
                .play()
                .then(() => {})
                .catch((e) => {
                  console.log(`Error happened playing user sound: ${e}`);
                  alert(`Error happened playing user sound: ${e}`);
                });
            }
          }}
        >
          <PlayArrow />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          close
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
  return playSoundDialog;
}
