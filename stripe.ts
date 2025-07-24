import { RequestHandler } from "express";
import {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from "@shared/api";
import admin from "firebase-admin";

// Lazy load Stripe to avoid config issues
let stripe: any = null;

const getStripe = async () => {
  if (!stripe) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey || stripeSecretKey.trim() === "") {
      throw new Error(
        "STRIPE_SECRET_KEY environment variable is not set. Please configure your Stripe secret key.",
      );
    }

    const Stripe = (await import("stripe")).default;
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-06-30.basil",
    });

    console.log("✅ Stripe initialized successfully");
  }
  return stripe;
};

// Initialize Firebase Admin safely
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || "autosoapai",
    });
    console.log("✅ Firebase Admin initialized successfully");
  } catch (error) {
    console.warn(
      "⚠️ Firebase Admin initialization failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    console.log(
      "🔄 Continuing without Firebase Admin (Stripe will still work)",
    );
  }
}

// Get Firestore instance safely
const getFirestore = () => {
  try {
    return admin.firestore();
  } catch (error) {
    console.warn(
      "⚠️ Firestore access failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return null;
  }
};

// Helper function to update user subscription in Firebase
const updateUserSubscription = async (
  email: string,
  subscriptionData: {
    stripeCustomerId?: string;
    subscriptionId?: string;
    priceId?: string;
    status: string;
    planType: "individual" | "clinic" | "none";
    currentPeriodStart?: number;
    currentPeriodEnd?: number;
    trialEnd?: number;
    cancelAtPeriodEnd?: boolean;
  },
) => {
  try {
    const db = getFirestore();
    if (!db) {
      console.log(
        "⚠️ Firestore not available, skipping user subscription update",
      );
      return;
    }

    // Find user by email
    const usersRef = db.collection("users");
    const userQuery = await usersRef.where("email", "==", email).limit(1).get();

    if (userQuery.empty) {
      console.log(`No user found with email: ${email}`);
      return;
    }

    const userDoc = userQuery.docs[0];
    await userDoc.ref.update({
      ...subscriptionData,
      lastChecked: Date.now(),
      updatedAt: Date.now(),
    });

    console.log(`✅ Updated subscription for user: ${email}`);
  } catch (error) {
    console.error("❌ Error updating user subscription:", error);
  }
};

// Helper function to determine plan type from price ID
const getPlanTypeFromPriceId = (
  priceId: string,
): "individual" | "clinic" | "none" => {
  if (
    priceId.includes("individual") ||
    priceId === "price_1RmsdpRp9WfR1T0dKVFhyml1"
  ) {
    return "individual";
  } else if (
    priceId.includes("clinic") ||
    priceId === "price_1RmseBRp9WfR1T0dufgzjZM0"
  ) {
    return "clinic";
  }
  return "none";
};

export const createCheckoutSession: RequestHandler = async (req, res) => {
  try {
    console.log("🚀 Creating checkout session request received");
    console.log("📝 Request body:", JSON.stringify(req.body, null, 2));

    const {
      priceId,
      plan,
      successUrl,
      cancelUrl,
    }: CreateCheckoutSessionRequest = req.body;

    if (!priceId || !plan || !successUrl || !cancelUrl) {
      console.error("❌ Missing required fields:", {
        priceId,
        plan,
        successUrl,
        cancelUrl,
      });
      return res.status(400).json({
        error: "Missing required fields: priceId, plan, successUrl, cancelUrl",
      });
    }

    // Check if we're in demo mode (no real Stripe keys)
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey || stripeSecretKey === "sk_test_placeholder_key") {
      console.log("⚠️ Demo mode: Stripe not configured");
      return res.status(200).json({
        sessionId: "demo_session_" + Math.random().toString(36).substr(2, 9),
        demo: true,
        message:
          "Demo mode: Add your Stripe secret key to .env file to enable payments",
      });
    }

    console.log("🔑 Initializing Stripe...");
    const stripeInstance = await getStripe();

    console.log("💳 Creating checkout session with:", { priceId, plan });

    // Create Stripe checkout session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan: plan,
      },
      // For subscription mode, customer is automatically created
      billing_address_collection: "required",
      // Add trial period configuration if needed
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          plan: plan,
        },
      },
      // Collect customer email for account creation
      customer_email: undefined, // Let customer enter their email
      allow_promotion_codes: true, // Allow discount codes
    });

    console.log("✅ Checkout session created successfully:", session.id);

    const response: CreateCheckoutSessionResponse = {
      sessionId: session.id,
    };

    res.json(response);
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);

    if (error instanceof Error) {
      console.error("🔍 Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      // Handle specific Stripe errors
      if (error.message.includes("STRIPE_SECRET_KEY")) {
        return res.status(500).json({
          error: "Stripe configuration error. Please contact support.",
          details: "Missing or invalid Stripe configuration",
        });
      }

      // Handle Stripe API errors
      if (error.message.includes("customer_creation")) {
        return res.status(500).json({
          error: "Stripe configuration error",
          details: "Invalid checkout session configuration",
        });
      }
    }

    res.status(500).json({
      error: "Failed to create checkout session",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Webhook handler for Stripe events
export const handleStripeWebhook: RequestHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    return res.status(400).json({ error: "Webhook secret not configured" });
  }

  try {
    const stripeInstance = await getStripe();
    const event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret,
    );

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as any;
        console.log("Checkout session completed:", session.id);

        if (session.customer_email && session.subscription) {
          // Get subscription details
          const stripeInstance = await getStripe();
          const subscription = await stripeInstance.subscriptions.retrieve(
            session.subscription,
          );

          await updateUserSubscription(session.customer_email, {
            stripeCustomerId: session.customer,
            subscriptionId: subscription.id,
            priceId: subscription.items.data[0]?.price.id,
            status: subscription.status,
            planType: getPlanTypeFromPriceId(
              subscription.items.data[0]?.price.id || "",
            ),
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            trialEnd: subscription.trial_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          });
        }
        break;

      case "customer.subscription.created":
        const createdSubscription = event.data.object as any;
        console.log("Subscription created:", createdSubscription.id);

        if (createdSubscription.customer) {
          const stripeInstance = await getStripe();
          const customer = await stripeInstance.customers.retrieve(
            createdSubscription.customer,
          );

          if (customer && !customer.deleted && customer.email) {
            await updateUserSubscription(customer.email, {
              stripeCustomerId: customer.id,
              subscriptionId: createdSubscription.id,
              priceId: createdSubscription.items.data[0]?.price.id,
              status: createdSubscription.status,
              planType: getPlanTypeFromPriceId(
                createdSubscription.items.data[0]?.price.id || "",
              ),
              currentPeriodStart: createdSubscription.current_period_start,
              currentPeriodEnd: createdSubscription.current_period_end,
              trialEnd: createdSubscription.trial_end,
              cancelAtPeriodEnd: createdSubscription.cancel_at_period_end,
            });
          }
        }
        break;

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as any;
        console.log("Subscription updated:", updatedSubscription.id);

        if (updatedSubscription.customer) {
          const stripeInstance = await getStripe();
          const customer = await stripeInstance.customers.retrieve(
            updatedSubscription.customer,
          );

          if (customer && !customer.deleted && customer.email) {
            await updateUserSubscription(customer.email, {
              stripeCustomerId: customer.id,
              subscriptionId: updatedSubscription.id,
              priceId: updatedSubscription.items.data[0]?.price.id,
              status: updatedSubscription.status,
              planType: getPlanTypeFromPriceId(
                updatedSubscription.items.data[0]?.price.id || "",
              ),
              currentPeriodStart: updatedSubscription.current_period_start,
              currentPeriodEnd: updatedSubscription.current_period_end,
              trialEnd: updatedSubscription.trial_end,
              cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
            });
          }
        }
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as any;
        console.log("Subscription canceled:", deletedSubscription.id);

        if (deletedSubscription.customer) {
          const stripeInstance = await getStripe();
          const customer = await stripeInstance.customers.retrieve(
            deletedSubscription.customer,
          );

          if (customer && !customer.deleted && customer.email) {
            await updateUserSubscription(customer.email, {
              stripeCustomerId: customer.id,
              subscriptionId: deletedSubscription.id,
              status: "canceled",
              planType: "none",
            });
          }
        }
        break;

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as any;
        console.log(
          "Payment failed for subscription:",
          failedInvoice.subscription,
        );

        if (failedInvoice.customer_email) {
          await updateUserSubscription(failedInvoice.customer_email, {
            status: "past_due",
            planType: "none", // Disable access on payment failure
          });
        }
        break;

      case "invoice.payment_succeeded":
        const succeededInvoice = event.data.object as any;
        console.log(
          "Payment succeeded for subscription:",
          succeededInvoice.subscription,
        );

        if (succeededInvoice.customer_email && succeededInvoice.subscription) {
          const stripeInstance = await getStripe();
          const subscription = await stripeInstance.subscriptions.retrieve(
            succeededInvoice.subscription,
          );

          await updateUserSubscription(succeededInvoice.customer_email, {
            status: subscription.status,
            planType: getPlanTypeFromPriceId(
              subscription.items.data[0]?.price.id || "",
            ),
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
          });
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({
      error: "Webhook error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
