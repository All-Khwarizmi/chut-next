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
interface UserSoundsProps {
  pathName: string;
  title: string;
}
export interface SoundOption {
  label: string;
  value: string;
}
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const UserSounds: React.FC<UserSoundsProps> = ({ title, pathName }) => {
  const app = initFirebase();
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const [
    soundOptions,
    setSoundRef,
    soundRef,
    userSounds,
    setUserSounds,
    userRecords,
    setUserRecords,
    update,
    setUpdate,
    getUserRecord,
    getUserSound,
    deleteUserRecords,
    deleteUserSounds,
    setSoundList,
    removeFromSoundList,
    isSoundPlaying,
    setIsSoundPlaying,
  ] = useStore((state) => [
    state.soundList,
    state.setSoundRef,
    state.soundRef,
    state.userSounds,
    state.setUserSounds,
    state.userRecords,
    state.setUserRecords,
    state.update,
    state.setUpdate,
    state.getUserRecord,
    state.getUserSound,
    state.deleteUserRecords,
    state.deleteUserSounds,
    state.setSoundList,
    state.removeFromSoundList,
    state.isSoundPlaying,
    state.setIsSoundPlaying,
  ]);
  const [checkUserSoundList, setCheckUserSoundList] = useState<SoundOptions[]>(
    [],
  );

  useEffect(() => {
    // Get user sounds from firebase storage
    const fetchUserSounds = async () => {
      if (user) {
        const soundsRef = ref(
          storageBucket,
          `customers/${user.uid}/${pathName}`,
        );

        try {
          const soundsList = await listAll(soundsRef);

          soundsList.items.map((item) => {
            getDownloadURL(item).then((url) => {
              const soundObj = { label: item.name, value: url };
              if (pathName == "sounds") {
                // Add to local state to check later if global state is up to date
                setCheckUserSoundList((prev) => [...prev, soundObj]);

                // Add to global state
                useStore.setState((prev) => {
                  if (
                    !prev.userSounds.some(
                      (sound) => sound.label === soundObj.label,
                    )
                  ) {
                    prev.userSounds = [...prev.userSounds, soundObj];
                    return {
                      ...prev,
                    };
                  } else {
                    return prev;
                  }
                });
              } else if (pathName == "records") {
                // Add to local state to check later if global state is up to date
                useStore.setState((prev) => {
                  if (
                    !prev.userRecords.some(
                      (sound) => sound.label === soundObj.label,
                    )
                  ) {
                    prev.userRecords = [...prev.userRecords, soundObj];
                    return {
                      ...prev,
                    };
                  } else {
                    return prev;
                  }
                });
              }
            });
          });
        } catch (error) {
          console.error("Error fetching user sounds:", error);
        }
      }
    };

    fetchUserSounds();

    // Update global state if it is outdated (a premium sound is no longer selected)
    useStore.setState((prev) => {
      if (pathName === "sounds") {
        const filteredSoundList = prev.userSounds.filter((globalStateItem) =>
          checkUserSoundList.some(
            (localStateItem) => globalStateItem.label === localStateItem.label,
          ),
        );
        prev.userSounds = filteredSoundList;
        return { ...prev };
      } else if (pathName === "records") {
        const filteredSoundList = prev.userRecords.filter((globalStateItem) =>
          checkUserSoundList.some(
            (localStateItem) => globalStateItem.label === localStateItem.label,
          ),
        );
        prev.userRecords = filteredSoundList;
        return { ...prev };
      } else {
        return prev;
      }
    });
  }, [user, update]);

  // Delete user sound from firebase storage
  const handleDeleteUserSound = (
    pathName: string,
    fileName: string,
    update: boolean,
  ) => {
    const path =
      pathName === "sounds"
        ? `customers/${user?.uid}/sounds/${fileName}`
        : `customers/${user?.uid}/records/${fileName}`;
    // Reference to the file you want to delete
    const fileRef = ref(storageBucket, path);

    // Delete the file
    deleteObject(fileRef)
      .then(() => {
        console.log("File deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });

    // Delete user record from global state
    const record =
      pathName === "sounds" ? getUserSound(fileName) : getUserRecord(fileName);
    if (record) {
      if (pathName === "sounds") {
        deleteUserSounds(record);
      } else if (pathName === "records") {
        deleteUserRecords(record);
      }
    }
  };
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const isSoundsOrRecords = () =>
    pathName === "sounds" ? userSounds : userRecords;

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
              const sampleAudio = new Audio(audioUrl);
              sampleAudio.load();
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
  const userSoundsBloc = (
    <List
      sx={{ p: 2 }}
      component="nav"
      subheader={<li />}
      aria-label="main mailbox folders"
    >
      <ListSubheader
        sx={{ color: "text.primary", fontWeight: "bold", fontSize: 16 }}
      >
        {title}
      </ListSubheader>
      {isSoundsOrRecords().map((ele) => {
        return (
          <ListItem key={crypto.randomUUID()}>
            <ListItemButton
              selected={ele.label === soundRef}
              onClick={(_) => {
                console.log("Event: select_content");
                // logEvent(analytics, "select_content", {
                //   content_type: "sound",
                //   content_id: ele.label,
                // });
                if (soundRef !== ele.value) {
                  setSoundRef(ele.value);
                  if (!soundOptions.some((e) => e.value === ele.value)) {
                    setSoundList(ele);
                  }
                }
              }}
            >
              <ListItemIcon>
                <MusicNoteIcon />
              </ListItemIcon>
              <ListItemText primary={ele.label} />
            </ListItemButton>
            <IconButton
              onClick={() => {
                console.log("click open and open is:", open);
                setAudioUrl(ele.value);
                handleClickOpen();
              }}
            >
              <PlayArrow />
            </IconButton>
            <IconButton
              onClick={() => {
                handleDeleteUserSound(pathName, ele.label, update);
              }}
              aria-label="comment"
            >
              <DeleteIcon sx={{ color: "red" }} />
            </IconButton>
          </ListItem>
        );
      })}
      {playSoundDialog}
    </List>
  );

  return <>{userSoundsBloc}</>;
};

export default UserSounds;
