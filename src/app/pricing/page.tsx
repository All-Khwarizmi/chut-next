"use client";
import * as React from "react";
import { initFirebase } from "../firebase";
import { getAuth } from "@firebase/auth";
import { getPremiumStatus } from "../account/getPremiumStatus";
import Layout from "../_components/LayoutComponent";
import { env } from "~/env.mjs";

function PricingPage() {
  const app = initFirebase();
  const auth = getAuth(app);
  const [isPremium, setIsPremium] = React.useState(false);
  React.useEffect(() => {
    const checkPremium = async () => {
      const newPremiumStatus = auth.currentUser
        ? await getPremiumStatus(app)
        : false;

      setIsPremium(newPremiumStatus);
    };
    checkPremium().catch((e) => console.log(e));
  }, [app, auth.currentUser?.uid]);
  // Paste the stripe-pricing-table snippet in your React component
  return (
    <>
      <div className=" h-full flex-1 place-items-center justify-center gap-y-12">
        <div className="py-8"></div>
        <div>
          <p className=" py-4 text-center text-5xl">
            Devenez Premium et profitez d'une
          </p>
          <p className="text-center text-5xl">Expérience Personnalisée</p>
        </div>
        <div className="py-8"></div>

        <div className="grid grid-cols-3">
          <div className=" col-start-2">
            <script
              async
              src="https://js.stripe.com/v3/pricing-table.js"
            ></script>
            <stripe-pricing-table
              className="h-screen"
              pricing-table-id={`${env.NEXT_PUBLIC_PRICING_TABLE_ID}`}
              publishable-key={`${env.NEXT_PUBLIC_PRICING_TABLE_KEY}`}
            ></stripe-pricing-table>
          </div>
        </div>
      </div>
    </>
  );
}

// If using TypeScript, add the following snippet to your file as well.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
export default PricingPage;
