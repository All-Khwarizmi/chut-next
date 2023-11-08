/**
 * @description Detects if the browser is Safari
 * @returns {boolean} True if browser is Safari, false otherwise
 */
export default function isSafariBrowser(userAgent: string): boolean {
  const isSafari =
    userAgent.indexOf("Safari") > -1 &&
    userAgent.indexOf("Chrome") <= -1;
  console.log(`Is safari: ${isSafari}`);
  return isSafari;
}
