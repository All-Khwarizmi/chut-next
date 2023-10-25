"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { theme } from "~/shared/theme";

export default function ButtonAppBar() {
  const router = useRouter();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ bgcolor: theme.palette.secondary.main }} position="fixed">
        <Toolbar>
          <Box
            component="img"
            sx={{
              height: 58,
              p: 1,
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

          <Button onClick={() => router.push("/account")} color="inherit">
            Compte
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
