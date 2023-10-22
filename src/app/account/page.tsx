"use client";
import { useEffect, useState } from "react";
import { Auth, getAuth } from "firebase/auth";
import { initFirebase } from "../../utils/firebase";
import { getPortalUrl } from "~/utils/stripe/stripePayment";
import { PremiumPanel } from "./premium-panel";
import { StandardPanel } from "./standard-panel";
import { getPremiumStatus } from "./get-premium-status";
import {
  deleteUser,
  manageSubscription,
  signOut,
  // signOut,
  upgradeToPremium,
} from "./account-helpers";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function AccountPage() {
  const app = initFirebase();
  const auth = getAuth(app);
  const userImage = auth.currentUser?.photoURL;
  const userName = auth.currentUser?.displayName;
  const email = auth.currentUser?.email;
  const [isPremium, setIsPremium] = useState(false);
  const [portalUrl, setPortalUrl] = useState("");
  // const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    const getPortalUrlOnFirstLoad = async () => {
      const portalUrl = await getPortalUrl(app);
      setPortalUrl(portalUrl);
    };

    getPortalUrlOnFirstLoad().catch((e) => console.log(e));
  }, [app]);

  useEffect(() => {
    const checkPremium = async () => {
      const newPremiumStatus = auth.currentUser
        ? await getPremiumStatus(app)
        : false;

      setIsPremium(newPremiumStatus);
    };
    checkPremium().catch((e) => console.log(e));
  }, [app, auth.currentUser?.uid]);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 lg:p-12">
      <div className="text-center">
        <img
          className="mx-auto block    h-auto w-32 rounded-full md:h-auto md:w-48 lg:h-auto lg:w-64"
          src={`${userImage ? userImage : "/chut-carre.png"}`}
          alt="Chut application logo"
        />
      </div>
      <div className="text-center">
        <div className="mb-1 text-slate-500">Signed in as {userName}</div>
        <div className="text-xl text-slate-300">{email}</div>
      </div>
      <div className="flex place-content-center text-center">
        {isPremium ? <PremiumPanel /> : <StandardPanel />}
      </div>
      <div className="text-center">
        <button
          onClick={
            isPremium
              ? () => manageSubscription(portalUrl)
              : () => upgradeToPremium(app)
          }
          className="rounded-lg bg-blue-600 p-4 px-6 text-lg shadow-lg hover:bg-blue-700"
        >
          <div className="flex items-center justify-center gap-2 align-middle">
            {isPremium ? "Manage Subscription" : "Upgrade To Premium"}
          </div>
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={() => signOut(router, auth)}
          className="text-center text-lg text-slate-500 hover:text-slate-300 hover:underline"
        >
          <div className="flex items-center justify-center gap-2 align-middle">
            Sign Out
          </div>
        </button>
        <div className="flex place-content-center pt-12">
          <div className="rounded-lg bg-slate-500 p-12">
            <div className="flex flex-col gap-6">
              <p className="text-2xl">Danger zone</p>
              <button
                onClick={() => deleteUser(user!)}
                className="rounded-lg  bg-red-600 p-4 px-6 text-lg shadow-lg hover:bg-red-700"
              >
                Delete Acccount
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
