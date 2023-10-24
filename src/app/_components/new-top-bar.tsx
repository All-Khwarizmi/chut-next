"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { theme } from "../studio/_components/sound-selected-list";
import { useRouter } from "next/navigation";

export default function ButtonAppBar() {
  const router = useRouter();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ bgcolor: theme.palette.background.paper }} position="fixed">
        <Toolbar>
          <Box
            component="img"
            sx={{
              height: 58,
            }}
            alt="Chut logo"
            src={"/chut-carre.png"}
          />
          <Button onClick={() => router.push("/")} color="inherit">
            Accueil
          </Button>
          <Button onClick={() => router.push("/studio")} color="inherit">
            Studio
          </Button>
          <Button onClick={() => router.push("/pricing")} color="inherit">
            Prix
          </Button>
          <Button onClick={() => router.push("/account")} color="inherit">
            Compte
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
