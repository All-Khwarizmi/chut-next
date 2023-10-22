import { Auth, AuthProvider, signInWithPopup } from "@firebase/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
export const goToAccount = () => {
  useRouter().push("/account");
};

export const signIn = async (
  auth: Auth,
  provider: AuthProvider,
  router: AppRouterInstance,
) => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (user) {
    router.push("/account");
  }
};
