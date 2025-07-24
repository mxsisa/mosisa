import { useState } from "react";
import {
  createCheckoutSession,
  redirectToCheckout,
  PricingPlan,
  STRIPE_PRICES,
} from "@/lib/stripe";
import { analyticsService } from "@/lib/analytics-service";

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (plan: PricingPlan, isTrial: boolean = true) => {
    console.log("💳 Starting checkout for:", { plan, isTrial });
    setLoading(true);
    setError(null);

    try {
      // Track trial start if this is a trial
      if (isTrial) {
        await analyticsService.trackTrialStarted(plan);
      }

      // Get the appropriate price ID
      const priceId = isTrial
        ? STRIPE_PRICES[plan].trial
        : STRIPE_PRICES[plan].monthly;

      console.log("💳 Using price ID:", priceId, "for plan:", plan, "isTrial:", isTrial);
      console.log("💳 Available prices:", STRIPE_PRICES);

      // Create checkout session
      const sessionId = await createCheckoutSession(
        priceId,
        plan,
        `${window.location.origin}/success?plan=${plan}`,
        `${window.location.origin}/?checkout=cancelled`,
      );

      console.log("💳 Created session:", sessionId);

      // Redirect to Stripe Checkout
      await redirectToCheckout(sessionId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    startCheckout,
    loading,
    error,
  };
}
