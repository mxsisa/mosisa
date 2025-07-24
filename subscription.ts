import { RequestHandler } from "express";
import { auth } from "../firebase-admin";

// Get subscription status
export const getSubscriptionStatus: RequestHandler = async (req, res) => {
  try {
    console.log("📋 Subscription status request received");
    
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    console.log("📋 Getting subscription status for user:", userId);

    // For now, return trial status for all users
    // In production, this would check Stripe for actual subscription status
    const subscriptionInfo = {
      status: 'trial',
      plan: 'free',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false
    };

    console.log("📋 Returning subscription info:", subscriptionInfo);
    res.json(subscriptionInfo);

  } catch (error) {
    console.error("❌ Error getting subscription status:", error);
    res.status(500).json({ 
      error: "Failed to get subscription status",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Cancel subscription
export const cancelSubscription: RequestHandler = async (req, res) => {
  try {
    console.log("🔴 Subscription cancellation request received");
    
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { reason } = req.body;

    console.log("🔴 Canceling subscription for user:", userId, "Reason:", reason);

    // For now, simulate cancellation
    // In production, this would call Stripe to cancel the subscription
    console.log("🔴 Simulated subscription cancellation successful");

    res.json({ 
      success: true,
      message: "Your subscription has been canceled. You'll retain access until the end of your current billing period."
    });

  } catch (error) {
    console.error("❌ Error canceling subscription:", error);
    res.status(500).json({ 
      error: "Failed to cancel subscription",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Create checkout session (placeholder)
export const createCheckoutSession: RequestHandler = async (req, res) => {
  try {
    console.log("💳 Create checkout session request received");
    
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const { priceId, successUrl, cancelUrl } = req.body;

    console.log("💳 Creating checkout session for price:", priceId);

    // For now, redirect to pricing page
    // In production, this would create a real Stripe checkout session
    res.json({ 
      url: '/pricing',
      message: 'Redirecting to pricing page'
    });

  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    res.status(500).json({ 
      error: "Failed to create checkout session",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
