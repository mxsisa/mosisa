import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { UserSubscription, subscriptionService } from "@/lib/subscription";

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  loading: boolean;
  hasActiveSubscription: boolean;
  isInTrial: boolean;
  daysUntilExpiry: number | null;
  planDisplayName: string;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
}

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const refreshSubscription = async () => {
    if (!currentUser) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Admin bypass - skip Firestore entirely for admin user
    if (currentUser.email?.toLowerCase() === 'mosisasaba04@gmail.com') {
      console.log('Admin user detected - bypassing subscription check');
      setSubscription({
        status: "active",
        planType: "individual",
        lastChecked: Date.now(),
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Refreshing subscription for user:', currentUser.email);
      setLoading(true);

      // The subscription service now handles timeouts internally
      // and provides fallback data, so we don't need additional timeout here
      const sub = await subscriptionService.getUserSubscription(currentUser);
      setSubscription(sub);

      console.log('Subscription refreshed successfully:', {
        status: sub.status,
        planType: sub.planType,
        email: currentUser.email
      });
    } catch (error) {
      console.error("Failed to fetch subscription:", error);

      // Use more graceful fallback - keep existing subscription if we have one
      // Only set to "none" if we don't have any existing subscription data
      if (!subscription) {
        console.log('Setting default subscription (no existing data)');
        setSubscription({
          status: "none",
          planType: "none",
          lastChecked: Date.now(),
        });
      } else {
        console.log('Keeping existing subscription data due to fetch error');
        // Keep existing subscription but mark it as potentially stale
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [currentUser]);

  const hasActiveSubscription = subscription
    ? subscriptionService.hasActiveSubscription(subscription, currentUser?.email || undefined)
    : false;

  const isInTrial = subscription
    ? subscriptionService.isInTrial(subscription, currentUser?.email || undefined)
    : false;

  const daysUntilExpiry = subscription
    ? subscriptionService.getDaysUntilExpiry(subscription, currentUser?.email || undefined)
    : null;

  const planDisplayName = subscription?.planType
    ? subscriptionService.getPlanDisplayName(subscription.planType)
    : "No Plan";

  const value: SubscriptionContextType = {
    subscription,
    loading,
    hasActiveSubscription,
    isInTrial,
    daysUntilExpiry,
    planDisplayName,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
