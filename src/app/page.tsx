"use client";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initFirebase } from "../utils/firebase";
import { useEffect, useState } from "react";
import { getPremiumStatus } from "./account/get-premium-status";
import MeterPlayer from "./_components/meter/meter-player";
import { rightArrow } from "~/shared/helpers-elements";
import { signIn } from "~/shared/helpers-fns";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { fetchSoundList, useStore } from "~/utils/stores";

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
    };
    checkPremium().catch((e) => console.log(e));
  }, [app, auth.currentUser?.uid]);

  useEffect(() => {
    fetchSoundList();
  }, [soundList]);
  // JSX

  const mainTitle = (title: string) => (
    <div className="px-5 text-4xl sm:text-4xl lg:text-6xl">{title}</div>
  );
  const subTitle = (subTitle: string) => (
    <div
      className=" px-5
      sm:mb-8 sm:text-xl xl:text-2xl"
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
    <div className="h-full p-4  lg:flex-1 ">
      <div className="flex h-full flex-col place-items-center  gap-y-4 text-4xl sm:text-5xl md:text-6xl">
        <MeterPlayer />
      </div>
    </div>
  );
  const rightSide = (
    <div className=" h-full p-4 text-white lg:flex-1">
      <div className="flex h-full flex-col place-items-center justify-center gap-y-4 text-4xl sm:text-5xl md:text-6xl">
        {user
          ? mainTitle(
              "De la Satisfaction à la Fidélité : Les Histoires de Succès de Chut",
            )
          : mainTitle("Welcome to Our Landing Page")}
        {user
          ? subTitle(
              "Des Utilisateurs Qui ont Fait de la Concentration un Art de Vivre",
            )
          : subTitle("Explore our amazing features and get started today!")}
        {user ? ctaButton("Get Started") : loginButton("Login with Google")}
      </div>
    </div>
  );
  return (
    <>
      <div className=" h-full lg:flex lg:flex-row ">
        {leftSide}
        {rightSide}
      </div>
    </>
  );
}
