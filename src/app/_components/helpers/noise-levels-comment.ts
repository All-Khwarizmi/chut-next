export function noiseLevelComment(decibel: number) {
  if (decibel <= 55) {
    return "Chuchotement";
  } else if (decibel <= 65) {
    return "Une conversation normale";
  } else if (decibel <= 75) {
    return "Une conversation animée";
  } else if (decibel <= 85) {
    return "Le klaxon d'une voiture";
  } else if (decibel <= 95) {
    return "Un train qui passe";
  } else if (decibel > 95) {
    return "Un concert";
  }
}
