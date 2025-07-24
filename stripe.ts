import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
);

// Stripe Price IDs - configured via environment variables
export const STRIPE_PRICES = {
  individual: {
    monthly:
      import.meta.env.VITE_STRIPE_PRICE_INDIVIDUAL_MONTHLY ||
      "price_1RmsdpRp9WfR1T0dKVFhyml1",
    trial:
      import.meta.env.VITE_STRIPE_PRICE_INDIVIDUAL_TRIAL ||
      "price_1RmsdpRp9WfR1T0dKVFhyml1",
  },
  clinic: {
    monthly:
      import.meta.env.VITE_STRIPE_PRICE_CLINIC_MONTHLY ||
      "price_1RmseBRp9WfR1T0dufgzjZM0",
    trial:
      import.meta.env.VITE_STRIPE_PRICE_CLINIC_TRIAL ||
      "price_1RmseBRp9WfR1T0dufgzjZM0",
  },
} as const;

export type PricingPlan = "individual" | "clinic";
export type PricingInterval = "monthly" | "trial";

export const createCheckoutSession = async (
  priceId: string,
  plan: PricingPlan,
  successUrl?: string,
  cancelUrl?: string,
) => {
  try {
    console.log("🚀 Creating checkout session for:", { priceId, plan });

    const requestBody = {
      priceId,
      plan,
      successUrl: successUrl || `${window.location.origin}/success`,
      cancelUrl: cancelUrl || `${window.location.origin}/pricing`,
    };

    console.log("📝 Request payload:", requestBody);

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📡 Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ API Error:", errorData);

      throw new Error(
        errorData.details ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const responseData = await response.json();
    const { sessionId, demo, message } = responseData;

    if (demo) {
      console.log("⚠️ Demo mode active:", message);
      // In demo mode, simulate successful checkout
      alert(
        "🎯 AutoSOAP AI Demo\n\n" +
          message +
          "\n\nTo enable real payments, please contact:\n" +
          "📧 support@autosoapai.com",
      );
      return null; // Return null to prevent redirect
    }

    console.log("✅ Checkout session created:", sessionId);
    return sessionId;
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    throw error;
  }
};

export const redirectToCheckout = async (sessionId: string | null) => {
  if (!sessionId) {
    console.log("⚠️ No session ID provided (demo mode)");
    return;
  }

  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error("Stripe failed to load");
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) {
    console.error("Error redirecting to checkout:", error);
    throw error;
  }
};
