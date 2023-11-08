import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import changeBrowser from "~/utils/change-browser";
import SuccessToast, { displaySuccessToast } from "./toast";
import { signIn } from "./helpers-fns";
import { Auth, AuthProvider } from "@firebase/auth";
import { FirebaseApp } from "firebase/app";

export interface NotSignedInDialogProps {
  open: boolean;
  handleClose: () => void;
  auth: Auth;
  provider: AuthProvider;
  app: FirebaseApp;
  message: string;
}
export function NotSignedInDialog({
  open,
  handleClose,
  auth,
  provider,
  message,
}: NotSignedInDialogProps) {
  const router = useRouter();
  const wrongDevice = (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Connectez-vous!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              signIn(auth, provider, router);
              handleClose();
            }}
            autoFocus
          >
            Se connecter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  return wrongDevice;
}
