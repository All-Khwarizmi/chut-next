import { Auth, User } from "@firebase/auth";
import { FirebaseApp } from "firebase/app";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { getCheckoutUrl } from "~/utils/stripe/stripePayment";

export const deleteUser = (user: User) => {
  const isUserSure = window.confirm("Are you sure? \nAny data will be lost");
  if (isUserSure) {
    const confirmationMsg = "Delete my account";
    const userDeleteConfirmation = window.prompt(
      `To confirm please type: \n\"${confirmationMsg}\"`,
    );
    if (userDeleteConfirmation && userDeleteConfirmation === confirmationMsg) {
      user
        .delete()
        .then(() => {
          alert("Your account has been deleted");
          useRouter().push("/");
        })
        .catch((e) =>
          alert(`Error happened trying to delete user:
      Error: ${e}
      Please signout and, then sign in and try to delete your account back again.
      `),
        );
    }
  }
};

export const manageSubscription = (
  portalUrl: string,
  router: AppRouterInstance,
) => {
  // console.log(`manage subscription...`);
  // console.log(`manage subscription ${portalUrl}`);
  router.push(portalUrl);
};

export const upgradeToPremium = async (
  app: FirebaseApp,
  router: AppRouterInstance,
) => {
  const myPriceId = "price_1O5B7HHIBlFqgcGsQxmQifoQ";
  const checkoutUrl = await getCheckoutUrl(app, myPriceId);
  router.push(checkoutUrl);
  // console.log("upgrade to premium");
};
export const signOut = (router: AppRouterInstance, auth: Auth) => {
  auth.signOut().catch(() => console.log("Error signing out"));
  router.push("/");
};
