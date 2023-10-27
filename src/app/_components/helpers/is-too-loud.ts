export const isTooLoud = (
  measuresArr: number[],
  threshold: number,
): boolean => {
  if (measuresArr.length > 2) {
    const len = measuresArr.length;
    const lastElement = measuresArr[len - 1];
    const secondLastElement = measuresArr[len - 2];
    const isTooLoud =
      lastElement! > threshold && secondLastElement! > threshold;
    return isTooLoud;
  } else {
    return false;
  }
};
