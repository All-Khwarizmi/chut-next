import isSafariBrowser from "~/app/_components/helpers/browser-detector";

export default function checkDevice() {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  const isDesktop = window.innerWidth > 768;
  return { isMobile, isDesktop };
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function safariOrMobile() {
  return isSafariBrowser(navigator.userAgent) /* || checkDevice().isMobile */;
}
