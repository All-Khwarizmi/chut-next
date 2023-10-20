"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { initFirebase } from "../firebase";
import { getCheckoutUrl, getPortalUrl } from "~/stripe/stripePayment";
import { PremiumPanel } from "./premiumPanel";
import { StandardPanel } from "./standardPanel";
import { getPremiumStatus } from "./getPremiumStatus";

export default function AccountPage() {
  const app = initFirebase();
  const auth = getAuth(app);

  const userName = auth.currentUser?.displayName;
  const email = auth.currentUser?.email;
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [portalUrl, setPortalUrl] = useState("");

  useEffect(() => {
    const getPortalUrlOnFirstLoad = async () => {
      const portalUrl = await getPortalUrl(app);
      setPortalUrl(portalUrl);
    };
    getPortalUrlOnFirstLoad();
  }, [app]);

  useEffect(() => {
    const checkPremium = async () => {
      const newPremiumStatus = auth.currentUser
        ? await getPremiumStatus(app)
        : false;

      setIsPremium(newPremiumStatus);
    };
    checkPremium();
  }, [app, auth.currentUser?.uid]);

  const upgradeToPremium = async () => {
    const myPriceId = "price_1O3KUlHIBlFqgcGsEJHDPxj6";
    const checkoutUrl = await getCheckoutUrl(app, myPriceId);
    router.push(checkoutUrl);
    console.log("upgrade to premium");
  };
  const manageSubscription = () => {
    console.log(`manage subscription...`);

    // const portalUrl = await getPortalUrl(app);
    console.log(`manage subscription ${portalUrl}`);
    router.push(portalUrl);
  };

  const signOut = () => {
    auth.signOut();
    router.push("/");
  };

  const upgradeToPremiumButton = (
    <button
      onClick={upgradeToPremium}
      className="rounded-lg bg-blue-600 p-4 px-6 text-lg shadow-lg hover:bg-blue-700"
    >
      <div className="flex items-center justify-center gap-2 align-middle">
        Upgrade To Premium
      </div>
    </button>
  );

  const managePortalButton = (
    <button
      onClick={() => {
        manageSubscription();
      }}
      className="rounded-lg bg-blue-600 p-4 px-6 text-lg shadow-lg hover:bg-blue-700"
    >
      <div className="flex items-center justify-center gap-2 align-middle">
        Manage Subscription
      </div>
    </button>
  );

  const signOutButton = (
    <button
      onClick={signOut}
      className="text-center text-lg text-slate-500 hover:text-slate-300 hover:underline"
    >
      <div className="flex items-center justify-center gap-2 align-middle">
        Sign Out
      </div>
    </button>
  );
  //   const pricingButton = (
  //     <button
  //       onClick={() => {
  //         // router.push(stripeSession.url);
  //         // console.log(sessionURL);
  //       }}
  //       className="rounded-lg bg-orange-600 p-4 px-6 text-lg shadow-lg hover:bg-blue-700"
  //     >
  //       {" "}
  //       Pricing
  //     </button>
  //   );

  const accountSummary = (
    <div>
      <div className="mb-1 text-slate-500">Signed in as {userName}</div>
      <div className="text-xl text-slate-300">{email}</div>
    </div>
  );
  const statusPanel = isPremium ? <PremiumPanel /> : <StandardPanel />;
  const memberButton = isPremium ? managePortalButton : upgradeToPremiumButton;

  return (
    <div className="flex flex-col gap-8">
      {accountSummary}
      {statusPanel}
      {memberButton}
      {signOutButton}
    </div>
  );
}
