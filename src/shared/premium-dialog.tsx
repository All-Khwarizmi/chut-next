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
import { FirebaseApp } from "firebase/app";
import { upgradeToPremium } from "~/app/account/helpers/account-helpers";

export interface GoPremiumDialogProps {
  open: boolean;
  handleClose: () => void;
  app: FirebaseApp;
  message: string;
}
export function GoPremiumDialog({
  open,
  handleClose,
  app,
  message,
}: GoPremiumDialogProps) {
  const router = useRouter();
  const wrongDevice = (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Devenez premium!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              upgradeToPremium(app, router);
              handleClose();
            }}
            autoFocus
          >
            D'accord
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  return wrongDevice;
}
