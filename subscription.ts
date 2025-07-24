import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "./firebase";

export interface UserSubscription {
  stripeCustomerId?: string;
  subscriptionId?: string;
  priceId?: string;
  status:
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "incomplete"
    | "none";
  planType: "individual" | "clinic" | "none";
  currentPeriodStart?: number;
  currentPeriodEnd?: number;
  trialEnd?: number;
  cancelAtPeriodEnd?: boolean;
  lastChecked: number;
}

export class SubscriptionService {
  private static instance: SubscriptionService;
  private cache = new Map<
    string,
    { data: UserSubscription; timestamp: number }
  >();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRIES = 2;
  private readonly RETRY_DELAY = 1000; // 1 second

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getUserSubscription(user: User): Promise<UserSubscription> {
    // Admin bypass - return active subscription immediately
    if (user.email?.toLowerCase() === 'mosisasaba04@gmail.com') {
      console.log('Admin user - returning active subscription');
      return {
        status: "active",
        planType: "individual",
        lastChecked: Date.now(),
      };
    }

    const cacheKey = user.uid;
    const cached = this.cache.get(cacheKey);

    // Return cached data if it's still fresh
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Returning cached subscription data for user:', user.email);
      return cached.data;
    }

    // If there's stale cached data, use it as fallback while fetching fresh data
    const fallbackSubscription = cached?.data || {
      status: "none" as const,
      planType: "none" as const,
      lastChecked: Date.now(),
    };

    try {
      console.log('Fetching subscription for user:', user.email);

      const userDocRef = doc(db, "users", user.uid);

      // Increase timeout and add more robust error handling
      const fetchWithTimeout = async (): Promise<UserSubscription> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 15000); // Increased to 15 seconds

        try {
          const userDoc = await getDoc(userDocRef);
          clearTimeout(timeoutId);

          let subscription: UserSubscription;

          if (userDoc.exists()) {
            const data = userDoc.data();
            subscription = {
              stripeCustomerId: data.stripeCustomerId,
              subscriptionId: data.subscriptionId,
              priceId: data.priceId,
              status: data.status || data.subscriptionStatus || "none",
              planType: data.planType || "none",
              currentPeriodStart: data.currentPeriodStart,
              currentPeriodEnd: data.currentPeriodEnd,
              trialEnd: data.trialEnd,
              cancelAtPeriodEnd: data.cancelAtPeriodEnd,
              lastChecked: Date.now(),
            };
          } else {
            // Create new user document with default values
            subscription = {
              status: "none",
              planType: "none",
              lastChecked: Date.now(),
            };

            // Try to create user document in background, don't block on it
            setDoc(userDocRef, {
              email: user.email,
              displayName: user.displayName,
              status: "none",
              planType: "none",
              createdAt: Date.now(),
              lastChecked: Date.now(),
            }).catch(createError => {
              console.warn('Failed to create user document (non-blocking):', createError);
            });
          }

          return subscription;
        } catch (firestoreError) {
          clearTimeout(timeoutId);
          throw firestoreError;
        }
      };

      const subscription = await fetchWithTimeout();

      // Cache the result
      this.cache.set(cacheKey, { data: subscription, timestamp: Date.now() });
      console.log('Successfully fetched and cached subscription for user:', user.email);

      return subscription;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      console.warn("Using fallback subscription data");

      // Return fallback data and update cache with it
      this.cache.set(cacheKey, {
        data: fallbackSubscription,
        timestamp: Date.now() - (this.CACHE_DURATION * 0.9) // Mark as slightly stale so it tries again sooner
      });

      return fallbackSubscription;
    }
  }

  async updateUserSubscription(
    userId: string,
    subscriptionData: Partial<UserSubscription>,
  ): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);

      await updateDoc(userDocRef, {
        ...subscriptionData,
        lastChecked: Date.now(),
      });

      // Clear cache for this user
      this.cache.delete(userId);
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  }

  hasActiveSubscription(subscription: UserSubscription, userEmail?: string): boolean {
    // Give infinite access to admin email
    if (userEmail?.toLowerCase() === 'mosisasaba04@gmail.com') {
      return true;
    }

    const activeStatuses = ["active", "trialing"];
    return activeStatuses.includes(subscription.status);
  }

  isInTrial(subscription: UserSubscription, userEmail?: string): boolean {
    // Admin email gets infinite trial access
    if (userEmail?.toLowerCase() === 'mosisasaba04@gmail.com') {
      return true;
    }

    return (
      subscription.status === "trialing" ||
      (subscription.trialEnd && subscription.trialEnd > Date.now() / 1000)
    );
  }

  getDaysUntilExpiry(subscription: UserSubscription, userEmail?: string): number | null {
    // Admin email gets infinite access
    if (userEmail?.toLowerCase() === 'mosisasaba04@gmail.com') {
      return 999; // Show as 999 days (effectively infinite)
    }

    const endTime = subscription.currentPeriodEnd || subscription.trialEnd;
    if (!endTime) return null;

    const now = Date.now() / 1000;
    const daysLeft = Math.ceil((endTime - now) / (24 * 60 * 60));
    return Math.max(0, daysLeft);
  }

  getPlanDisplayName(planType: string): string {
    switch (planType) {
      case "individual":
        return "Individual Provider";
      case "clinic":
        return "Clinic Team";
      default:
        return "No Plan";
    }
  }

  // Clear cache for user (useful when subscription changes)
  clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }
}

export const subscriptionService = SubscriptionService.getInstance();
