import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "invoice.paid": {
      //Atualizar o usuário com o seu novo plano
      const { customer, subscription, subscription_details } =
        event.data.object;

      const clerckUserId = subscription_details?.metadata?.clerk_user_id;

      if (!clerckUserId) {
        return NextResponse.error();
      }

      console.log(subscription, customer);

      await clerkClient().users.updateUser(clerckUserId, {
        publicMetadata: {
          subscriptionPlan: "premium",
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
};
