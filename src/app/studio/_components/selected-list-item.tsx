import * as React from "react";
import Box from "@mui/material/Box";

import Divider from "@mui/material/Divider";

import { ThemeProvider } from "@mui/material";
import UserSounds from "~/app/studio/_components/user-sounds";
import SoundList from "./soundtheque";
import { theme } from "~/shared/theme";

export default function SelectedListItem() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 370,
          bgcolor: "background.paper",
          borderRadius: 2,
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
