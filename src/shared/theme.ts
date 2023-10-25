import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    background: {
      paper: "#6b7280",
    },
    primary: {
      main: "#0f172as",
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