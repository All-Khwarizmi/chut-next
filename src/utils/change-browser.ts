import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { isSafari } from "./device-checker";
// Check if the user has already visited the website and has been warned about the browser
export default function checkSessioStorage() {
  const warning = sessionStorage.getItem("browserWarning");
  if (warning) {
    return true;
  } else {
    return false;
  }
}

export function setSessionStorage() {
  sessionStorage.setItem("browserWarning", "true");
}