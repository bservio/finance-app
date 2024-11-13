"use server";
// import Stripe from "stripe"
import { auth } from "@clerk/nextjs/server";

export const createStripeCheckout = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
};
