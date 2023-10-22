"use client";

import { useRouter } from "next/navigation";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initFirebase } from "./firebase";
import Layout from "./_components/LayoutComponent";
import { useEffect, useState } from "react";
import { getPremiumStatus } from "./account/getPremiumStatus";
import MeterPlayer from "./_components/meter-player";

export default function Home() {
  const router = useRouter();

  const app = initFirebase();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const userName = auth.currentUser?.displayName;
  const email = auth.currentUser?.email;
  const [isPremium, setIsPremium] = useState(false);
  const [portalUrl, setPortalUrl] = useState("");
  useEffect(() => {
    const checkPremium = async () => {
      const newPremiumStatus = auth.currentUser
        ? await getPremiumStatus(app)
        : false;

      setIsPremium(newPremiumStatus);
    };
    checkPremium().catch((e) => console.log(e));
  }, [app, auth.currentUser?.uid]);
  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      goToAccount();
    }
  };
  const rightArrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  );

  const goToAccount = () => {
    router.push("/account");
  };

  return (
    <>
      <Layout
        isUserLoggedIn={auth.currentUser ? true : false}
        isPremiumUser={isPremium}
      >
        <div className="grid h-full lg:flex lg:flex-row ">
          <div className="h-full p-4  lg:flex-1 ">
            <div className="flex h-full flex-col place-items-center justify-center gap-y-4 text-4xl sm:text-5xl md:text-6xl">
              <MeterPlayer />
              {/* <button
                onClick={signIn}
                className="rounded-lg bg-blue-600 p-3 px-5 text-base shadow-lg hover:bg-blue-700 sm:p-4 sm:px-6 sm:text-lg"
              >
                <div className="flex items-center gap-2 align-middle">
                  Login With Google {rightArrow}
                </div>
              </button> */}
            </div>
          </div>
          <div className=" h-full bg-slate-300  p-4 lg:flex-1">
            <div className="flex h-full flex-col place-items-center justify-center gap-y-4 text-4xl text-black sm:text-5xl md:text-6xl">
              {/* Your landing page hook with call to action goes here */}
              {/* Example: */}
              <div className="text-4xl sm:text-5xl md:text-6xl">
                Welcome to Our Landing Page
              </div>
              <div className="mb-4 text-base sm:mb-8 sm:text-xl md:text-2xl">
                Explore our amazing features and get started today!
              </div>
              <button
                onClick={() => alert("Call to action clicked")}
                className="rounded-lg bg-green-500 p-3 px-5 text-base shadow-lg hover:bg-green-600 sm:p-4 sm:px-6 sm:text-lg"
              >
                <div className="flex items-center gap-2 align-middle">
                  Get Started {rightArrow}
                </div>
              </button>
            </div>
          </div>
        </div>
      </Layout>

      {/* </Layout> */}
    </>
  );
}
