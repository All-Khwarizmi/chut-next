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

export interface WrongDeviceDialogProps {
  open: boolean;
  handleClose: () => void;
}
export function WrongDeviceDialog({
  open,
  handleClose,
}: WrongDeviceDialogProps) {
  const router = useRouter();
  const wrongDevice = (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Safari ou navigateur mobile non supporté"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Pour profiter pleinement de la fonctionnalité de détection sonore,
            nous vous recommandons d'utiliser Chrome, Firefox ou Edge.
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              //   copyLink();
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

export default WrongDeviceDialog;

export function copyLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url);
  displaySuccessToast("Lien copié dans le presse-papier");
}
