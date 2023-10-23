import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { useStore } from "~/utils/stores";
import { MusicNote } from "@mui/icons-material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { ListSubheader, ThemeProvider } from "@mui/material";

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
      }}
    >
      <ListSubheader
        sx={{ color: "text.primary", fontWeight: "bold", fontSize: 16 }}
      >{`Sounds`}</ListSubheader>
      {soundOptions.map((ele) => {
        return (
          <ListItemButton
            key={crypto.randomUUID()}
            selected={ele.value === soundRef}
            onClick={(event) => setSoundRef(ele.value)}
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
