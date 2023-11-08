import { Stack, SnackbarContent, Button } from "@mui/material";

export interface WrongDeviceSnackbarProps {
  open: boolean;
  handleOpen: () => void;
}
export default function WrongDeviceSnackbar({
  open,
  handleOpen,
}: WrongDeviceSnackbarProps) {
  const action = (
    <Button onClick={handleOpen} color="secondary" size="small">
      En savoir plus
    </Button>
  );
  return (
    <Stack spacing={2} sx={{ maxWidth: 600 }}>
      <SnackbarContent
        message="Safari ou navigateur mobile non supporté"
        action={action}
      />
    </Stack>
  );
}
