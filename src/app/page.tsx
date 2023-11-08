"use client";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initFirebase } from "../utils/firebase";
import { useEffect, useState } from "react";
import { getPremiumStatus } from "./account/helpers/get-premium-status";
import MeterPlayer from "./_components/meter/meter-player";
import { rightArrow } from "~/shared/helpers-elements";
import { signIn } from "~/shared/helpers-fns";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useStore } from "~/utils/stores/stores";
import { fetchSoundList } from "~/utils/stores/store-helpers";
import { check } from "prettier";
import checkDevice, { isSafari, isSafariDesktop } from "~/utils/device-checker";
import WrongDeviceSnackbar from "~/shared/device-snackbar";
import { WrongDeviceDialog } from "~/shared/wrong-device-dialog";
import SuccessToast from "~/shared/toast";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const app = initFirebase();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [isPremium, setIsPremium] = useState(false);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [soundList, setSoundList] = useStore((state) => [
    state.soundList,
    state.setSoundList,
  ]);

  useEffect(() => {
    const checkPremium = async () => {
      const newPremiumStatus = auth.currentUser
        ? await getPremiumStatus(app)
        : false;

      setIsPremium(newPremiumStatus);

      checkPremium().catch((e) =>
        alert(`Could not get user premium status: ${e}`),
      );
    };
  }, [app, auth.currentUser?.uid]);

  useEffect(() => {
    fetchSoundList();
  }, [soundList]);
  // JSX
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const mainTitle = (title: string) => (
    <div className="px-5 text-xl lg:text-3xl">{title}</div>
  );
  const subTitle = (subTitle: string) => (
    <div
      className=" px-5
     pb-4 text-lg md:pb-8 lg:text-xl"
    >
      {subTitle}
    </div>
  );
  const ctaButton = (text: string) => (
    <button
      onClick={() => alert("Call to action clicked")}
      className="rounded-lg bg-green-500 p-3 px-5 text-base shadow-lg hover:bg-green-600 sm:p-4 sm:px-6 sm:text-lg"
    >
      <div className="flex  items-center gap-2 align-middle">
        {text} {rightArrow}
      </div>
    </button>
  );
  const loginButton = (text: string) => (
    <button
      onClick={() => signIn(auth, provider, router)}
      className="rounded-lg bg-blue-600 p-3 px-5 text-base shadow-lg hover:bg-blue-700 sm:p-4 sm:px-6 sm:text-lg"
    >
      <div className="flex items-center gap-2 align-middle">
        {text} {rightArrow}
      </div>
    </button>
  );
  const leftSide = (
    <div className="flex  grow p-4  lg:flex-1 ">
      <div className="flex  grow flex-col place-items-center  gap-y-4 text-4xl sm:text-5xl md:text-6xl">
        <div className="pt-20 md:pt-12">
          {isSafariDesktop() ? (
            <WrongDeviceSnackbar open={open} handleOpen={handleClickOpen} />
          ) : null}
        </div>
        <MeterPlayer />
      </div>
    </div>
  );
  const rightSide = (
    <div className=" md:pt12 flex place-content-center p-4 pb-8 pt-20 text-white lg:flex-1">
      <div className="place-items-left flex flex-col justify-center gap-y-2 text-4xl sm:text-5xl md:place-items-center md:gap-y-4 ">
        {user ? mainTitle("Chut Premium :") : mainTitle("Chut Premium : ")}
        {user
          ? subTitle("Votre Classe, Vos Sons.")
          : subTitle("Votre Classe, Vos Sons.")}
        {user
          ? ctaButton("Devenir Premium")
          : loginButton("Se Connecter Avec Google")}
      </div>
    </div>
  );
  return (
    <>
      <div className="flex flex-col  lg:flex lg:flex-row ">
        {leftSide}
        {rightSide}
      </div>
      <WrongDeviceDialog open={open} handleClose={handleClose} />
    </>
  );
}
