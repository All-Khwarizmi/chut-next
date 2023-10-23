import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase, storageBucket } from "~/utils/firebase";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import { useStore } from "~/utils/stores";
import { MusicNote } from "@mui/icons-material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import createTheme from "@mui/material/styles/createTheme";
import { ListSubheader, ThemeProvider } from "@mui/material";
import { text } from "stream/consumers";
interface UserSoundsProps {
  pathName: string;
  title: string;
}
export interface SoundOption {
  label: string;
  value: string;
}
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
  ] = useStore((state) => [
    state.soundList,
    state.setSoundRef,
    state.soundRef,
    state.userSounds,
    state.setUserSounds,
    state.userRecords,
    state.setUserRecords,
    state.update,
  ]);

  useEffect(() => {
    const fetchUserSounds = async () => {
      if (user) {
        const soundsRef = ref(
          storageBucket,
          `customers/${user.uid}/${pathName}`,
        );

        try {
          const soundsList = await listAll(soundsRef);
          console.log(`Path name = ${pathName}`);

          soundsList.items.map((item) => {
            getDownloadURL(item).then((url) => {
              const soundObj = { label: item.name, value: url };
              if (pathName == "sounds") {
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
  }, [user, update]);
  const isSoundsOrRecords = () =>
    pathName === "sounds" ? userSounds : userRecords;
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
          <ListItemButton
            key={crypto.randomUUID()}
            selected={ele.label === soundRef}
            onClick={(event) => {}}
          >
            <ListItemIcon>
              <MusicNoteIcon />
            </ListItemIcon>
            <ListItemText primary={ele.label} />
          </ListItemButton>
        );
      })}
    </List>
  );

  return <>{userSoundsBloc}</>;
};

export default UserSounds;
