import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { useStore } from "~/utils/stores/stores";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { ListSubheader } from "@mui/material";
import { logEvent } from "firebase/analytics";
import { analytics } from "~/utils/firebase";

export default function SoundList() {
  const [soundOptions, setSoundRef, soundRef] = useStore((state) => [
    state.soundList,
    state.setSoundRef,
    state.soundRef,
  ]);

  return (
    <List
      component="nav"
      subheader={<li />}
      aria-label="Sounds selector list"
      sx={{
        p: 2,
        alignItems: "center",
      }}
    >
      <ListSubheader
        sx={{ color: "text.primary", fontWeight: "bold", fontSize: 16 }}
      >{`Bibliothèque`}</ListSubheader>
      {soundOptions.map((ele) => {
        return (
          <ListItemButton
            key={crypto.randomUUID()}
            selected={ele.value === soundRef}
            onClick={(_) => {
              console.log("Event: select_content");
              // logEvent(analytics, "select_content", {
              //   content_type: "sound",
              //   content_id: ele.label,
              // });
              setSoundRef(ele.value);
            }}
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
}
