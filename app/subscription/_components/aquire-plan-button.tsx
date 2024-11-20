"use client";

import { Button } from "@/app/_components/ui/button";
import { createStripeCheckout } from "../_actions/create-stripe-checkout";
import { loadStripe } from "@stripe/stripe-js";

const handleAquirePlan = async () => {
  const { sessionId } = await createStripeCheckout();
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("Stripe publishable key is not defined");
  }
  const stripe = await loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );

  if (!stripe) {
    throw new Error("Stripe is not loaded");
  }

  await stripe.redirectToCheckout({
    sessionId,
  });
};

const AquirePlanButton = () => {
  return (
    <Button
      onClick={handleAquirePlan}
      className="w-full rounded-full font-bold"
    >
      Adiquirir plano
    </Button>
  );
};

export default AquirePlanButton;
