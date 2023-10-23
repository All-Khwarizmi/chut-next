import * as React from "react";
import Box from "@mui/material/Box";
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
import { ThemeProvider } from "@mui/material";

export default function SelectedListItem() {
  const [soundOptions, setSoundRef, soundRef] = useStore((state) => [
    state.soundList,
    state.setSoundRef,
    state.soundRef,
  ]);

  const theme = createTheme({
    palette: {
      background: {
        paper: "#6b7280",
      },
      text: {
        primary: "#173A5E",
        secondary: "#46505A",
      },
      action: {
        active: "#001E3C",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <List component="nav" aria-label="main mailbox folders">
          {soundOptions.map((ele) => {
            return (
              <ListItemButton
                key={crypto.randomUUID()}
                selected={ele.label === soundRef}
                onClick={(event) => setSoundRef(ele.label)}
              >
                <ListItemIcon>
                  <MusicNoteIcon />
                </ListItemIcon>
                <ListItemText primary={ele.label} />
              </ListItemButton>
            );
          })}
        </List>
        <Divider />
      </Box>
    </ThemeProvider>
  );
}
