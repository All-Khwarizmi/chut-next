"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { initFirebase } from "./firebase";
import { User, getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const HOME_ROUTE = "/";
const ACCOUNT_ROUTE = "/account";

const AuthRouter = (props: any) => {
  const app = initFirebase();
  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathName = usePathname();

  const redirect = (
    isLoading: boolean,
    firebaseUser: User | null | undefined,
  ) => {
    if (!isLoading) {
      if (firebaseUser) {
        router.push(ACCOUNT_ROUTE);
      } else {
        router.push(HOME_ROUTE);
      }
    }
  };
  const redirectSwitch = (
    isLoading: boolean,
    firebaseUser: User | null | undefined,
  ) => {
    if (!isLoading) {
      console.log(`Path name: ${pathName}`);

      switch (pathName) {
        case "/account":
          if (!firebaseUser) {
            console.log(`Is user?: ${!!firebaseUser}`);

            router.push(HOME_ROUTE);
          }
      }
    }
  };

  useEffect(() => {
    redirectSwitch(loading, user);
  }, [loading, user, pathName]);

  if (loading) {
    return null;
  } else {
    return <>{props.children}</>;
  }
};

export default AuthRouter;
