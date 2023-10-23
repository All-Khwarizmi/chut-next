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
import { ListSubheader, ThemeProvider } from "@mui/material";
import { text } from "stream/consumers";
import UserSounds from "~/app/studio/user-audio-downloader";

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
      secondary: {
        main: "#1B262C",
      },

      text: {
        primary: "#FFFFFF",
        secondary: "#46505A",
      },
      action: {
        active: "#001E3C",
      },
    },
    components: {
      MuiListItemButton: {
        // defaultProps: {
        //   selected: true
        // },
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            ":hover": {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.main,

              ".MuiListItemIcon-root": {
                color: theme.palette.primary.main,
              },
            },

            "&.Mui-selected": {
              "&:hover": {
                backgroundColor: theme.palette.secondary.main,
              },
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.main,

              ".MuiListItemIcon-root": {
                color: theme.palette.primary.main,
              },
            },
            borderRadius: theme.spacing(2),
          }),

          // selected: ({ ownerState, theme }) => ({
          //   backgroundColor: theme.palette.secondary.main,
          //   color: theme.palette.primary.main,

          //   ".MuiListItemIcon-root": {
          //     color: theme.palette.primary.main
          //   },

          //   borderRadius: theme.spacing(2)
          // })
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          borderRadius: 5,
        }}
      >
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
        <UserSounds pathName={"sounds"} title={"Your Sounds"} />
        <UserSounds pathName={"records"} title={"Your Sounds Recorded"} />
      </Box>
    </ThemeProvider>
  );
}