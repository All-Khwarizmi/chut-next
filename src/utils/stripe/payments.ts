"use client";

import {
  createCheckoutSession,
  getStripePayments,
} from "@stripe/firestore-stripe-payments";
import { initFirebase } from "~/utils/firebase";

const app = initFirebase();
export const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers",
});
const myPriceId = "price_1O3KeNHIBlFqgcGsU1wezVIp";
const stripeSession = await createCheckoutSession(payments, {
  price: myPriceId,
});

export const sessionURL = stripeSession.url;
