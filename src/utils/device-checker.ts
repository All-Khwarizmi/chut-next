import isSafariBrowser from "~/utils/browser-detector";

export default function checkDevice() {
  const isMobile = /webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
  const isDesktop = window.innerWidth > 768;
  return { isMobile, isDesktop };
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isSafariDesktop() {
  return (
    isSafariBrowser(navigator.userAgent) &&
    checkDevice().isDesktop &&
    !isTouchDevice()
  );
}

export const isTouchDevice = () => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};
