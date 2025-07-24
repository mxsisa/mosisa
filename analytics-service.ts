import {
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserActivity {
  soapGenerated?: boolean;
  planSelected?: "individual" | "clinic";
  subscriptionStarted?: boolean;
  subscriptionCancelled?: boolean;
  trialStarted?: boolean;
  trialEnded?: boolean;
}

class AnalyticsService {
  private async updateUserDocument(userId: string, updates: any) {
    try {
      const userRef = doc(db, "users", userId);

      // First try to update the document
      await updateDoc(userRef, {
        ...updates,
        lastActivity: serverTimestamp(),
      });

      console.log("📊 Analytics - User document updated successfully");
    } catch (error) {
      console.error("❌ Analytics - Error updating user document:", error);

      // If document doesn't exist, create it first
      if (
        error instanceof Error &&
        error.message.includes("No document to update")
      ) {
        console.log(
          "📊 Analytics - User document doesn't exist, creating it...",
        );
        try {
          const userRef = doc(db, "users", userId);
          await setDoc(userRef, {
            email: auth.currentUser?.email || "",
            displayName: auth.currentUser?.displayName || "",
            createdAt: serverTimestamp(),
            totalSOAPGenerated: 0,
            subscriptionStatus: "none",
            planType: "none",
            ...updates,
            lastActivity: serverTimestamp(),
          });
          console.log("✅ Analytics - User document created successfully");
        } catch (createError) {
          console.error(
            "❌ Analytics - Failed to create user document:",
            createError,
          );
          throw createError;
        }
      } else {
        throw error;
      }
    }
  }

  async trackSOAPGeneration() {
    const user = auth.currentUser;
    if (!user) {
      console.warn(
        "📊 Analytics - No authenticated user, skipping SOAP tracking",
      );
      return;
    }

    console.log("📊 Analytics - Tracking SOAP generation for user:", user.uid);

    try {
      // First, ensure user document exists
      await this.initializeUserIfNotExists(user.uid, {
        email: user.email,
        displayName: user.displayName,
      });

      await this.updateUserDocument(user.uid, {
        totalSOAPGenerated: increment(1),
        lastSOAPGenerated: serverTimestamp(),
      });
      console.log("✅ Analytics - SOAP generation tracked successfully");
    } catch (error) {
      console.error("❌ Analytics - Failed to track SOAP generation:", error);

      // Try a fallback approach with direct document creation and update
      try {
        const userRef = doc(db, "users", user.uid);

        // First try to create the document
        await setDoc(
          userRef,
          {
            email: user.email || "",
            displayName: user.displayName || "",
            totalSOAPGenerated: 1,
            lastSOAPGenerated: serverTimestamp(),
            lastActivity: serverTimestamp(),
            createdAt: serverTimestamp(),
            subscriptionStatus: "none",
            planType: "none",
          },
          { merge: true },
        );

        console.log(
          "✅ Analytics - SOAP generation tracked with fallback document creation",
        );
      } catch (fallbackError) {
        console.error(
          "❌ Analytics - Fallback tracking also failed:",
          fallbackError,
        );
      }
    }
  }

  async trackTrialStarted(plan: "individual" | "clinic") {
    const user = auth.currentUser;
    if (!user) return;

    await this.updateUserDocument(user.uid, {
      trialStarted: serverTimestamp(),
      plan: plan,
      subscriptionStatus: "trial",
    });
  }

  async trackSubscriptionStarted(
    plan: "individual" | "clinic",
    stripeSubscriptionId?: string,
  ) {
    const user = auth.currentUser;
    if (!user) return;

    await this.updateUserDocument(user.uid, {
      subscriptionStarted: serverTimestamp(),
      subscriptionStatus: "active",
      plan: plan,
      stripeSubscriptionId: stripeSubscriptionId,
    });
  }

  async trackSubscriptionCancelled() {
    const user = auth.currentUser;
    if (!user) return;

    await this.updateUserDocument(user.uid, {
      subscriptionCancelled: serverTimestamp(),
      subscriptionStatus: "cancelled",
    });
  }

  async trackTrialEnded() {
    const user = auth.currentUser;
    if (!user) return;

    await this.updateUserDocument(user.uid, {
      trialEnded: serverTimestamp(),
      subscriptionStatus: "expired",
    });
  }

  async trackUserActivity(activity: UserActivity) {
    const user = auth.currentUser;
    if (!user) return;

    let updates: any = {};

    if (activity.soapGenerated) {
      updates.totalSOAPGenerated = increment(1);
      updates.lastSOAPGenerated = serverTimestamp();
    }

    if (activity.planSelected) {
      updates.plan = activity.planSelected;
    }

    if (activity.subscriptionStarted) {
      updates.subscriptionStarted = serverTimestamp();
      updates.subscriptionStatus = "active";
    }

    if (activity.subscriptionCancelled) {
      updates.subscriptionCancelled = serverTimestamp();
      updates.subscriptionStatus = "cancelled";
    }

    if (activity.trialStarted) {
      updates.trialStarted = serverTimestamp();
      updates.subscriptionStatus = "trial";
    }

    if (activity.trialEnded) {
      updates.trialEnded = serverTimestamp();
      updates.subscriptionStatus = "expired";
    }

    if (Object.keys(updates).length > 0) {
      await this.updateUserDocument(user.uid, updates);
    }
  }

  async getUserAnalytics(userId: string) {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      return null;
    }
  }

  async initializeUserIfNotExists(userId: string, userData: any) {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("📊 Analytics - Creating new user document for:", userId);
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp(),
          lastActivity: serverTimestamp(),
          totalSOAPGenerated: 0,
          subscriptionStatus: "none",
          planType: "none",
        });
        console.log("✅ Analytics - User document created successfully");
      } else {
        console.log("📊 Analytics - User document already exists");
      }
    } catch (error) {
      console.error("❌ Analytics - Error initializing user analytics:", error);
    }
  }

  async forceCreateUserDocument() {
    const user = auth.currentUser;
    if (!user) {
      console.warn("📊 Analytics - No authenticated user for force create");
      return false;
    }

    try {
      console.log("📊 Analytics - Force creating user document for:", user.uid);
      const userRef = doc(db, "users", user.uid);

      const userData = {
        email: user.email || "",
        displayName: user.displayName || "",
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp(),
        totalSOAPGenerated: 0,
        subscriptionStatus: "none",
        planType: "none",
        lastSOAPGenerated: null,
        // Add some initial analytics data
        monthlySOAPGenerated: 0,
        weeklySOAPGenerated: 0,
        dailySOAPGenerated: 0,
      };

      await setDoc(userRef, userData, { merge: true });

      console.log("✅ Analytics - User document force created successfully");
      return true;
    } catch (error) {
      console.error("❌ Analytics - Force create failed:", error);
      return false;
    }
  }
}

export const analyticsService = new AnalyticsService();
