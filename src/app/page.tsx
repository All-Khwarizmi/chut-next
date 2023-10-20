"use client";

import { useRouter } from "next/navigation";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initFirebase } from "./firebase";

export default function Home() {
  const router = useRouter();

  const app = initFirebase();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

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
      <div className="text-5xl font-bold md:text-6xl">
        <span className="bg-gradient-to-tr from-teal-400 to-blue-500 bg-clip-text text-transparent">
          my app
        </span>
      </div>
      <div className="mb-8 text-xl font-light md:text-2xl">
        Welcome! Let&apos;s get started.
      </div>
      <button
        onClick={signIn}
        className="rounded-lg bg-blue-600 p-4 px-6 text-lg shadow-lg hover:bg-blue-700"
      >
        <div className="flex items-center gap-2 align-middle">
          Login With Google {rightArrow}
        </div>
      </button>
    </>
  );
}
