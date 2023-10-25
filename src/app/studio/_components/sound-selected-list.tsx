import * as React from "react";
import Box from "@mui/material/Box";

import Divider from "@mui/material/Divider";

import { ThemeProvider } from "@mui/material";
import UserSounds from "~/app/studio/_components/user-audio-downloader";
import SoundList from "./sound-list";
import { theme } from "~/shared/theme";

export default function SelectedListItem() {
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
        <SoundList />
        <Divider />
        <UserSounds pathName={"sounds"} title={"Téléchargements"} />
        <UserSounds pathName={"records"} title={"Enregistrements"} />
      </Box>
    </ThemeProvider>
  );
}
