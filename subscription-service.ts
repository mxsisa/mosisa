import { auth } from "./firebase";

export interface SubscriptionInfo {
  status: 'trial' | 'active' | 'canceled' | 'expired';
  plan: 'free' | 'individual' | 'clinic';
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

class SubscriptionService {
  private static instance: SubscriptionService;

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  async getSubscriptionInfo(): Promise<SubscriptionInfo> {
    const user = auth.currentUser;
    if (!user) {
      return { status: 'trial', plan: 'free' };
    }

    try {
      const response = await fetch('/api/subscription/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          console.warn('Subscription API returned non-JSON response, using fallback');
        }
      } else {
        console.warn(`Subscription API returned status ${response.status}, using fallback`);
      }
    } catch (error) {
      console.warn('Subscription API not available, using fallback:', error instanceof Error ? error.message : 'Unknown error');
    }

    // Default to trial for new users (fallback)
    console.log('Using fallback subscription info: trial status');
    return { status: 'trial', plan: 'free' };
  }

  async cancelSubscription(): Promise<{ success: boolean; message: string }> {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      console.log('🔴 Canceling subscription for user:', user.uid);
      
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          userId: user.uid,
          reason: 'User requested cancellation'
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Subscription API returned non-JSON response');
        return {
          success: false,
          message: 'Subscription service temporarily unavailable. Please contact support.'
        };
      }

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Subscription canceled successfully');
        return {
          success: true,
          message: result.message || 'Your subscription has been canceled. You\'ll retain access until the end of your current billing period.'
        };
      } else {
        console.error('❌ Subscription cancellation failed:', result);
        return {
          success: false,
          message: result.error || 'Failed to cancel subscription. Please contact support.'
        };
      }
    } catch (error) {
      console.error('❌ Error canceling subscription:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again or contact support.' 
      };
    }
  }

  async createCheckoutSession(priceId: string): Promise<{ url?: string; error?: string }> {
    const user = auth.currentUser;
    if (!user) {
      return { error: 'User not authenticated' };
    }

    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({ 
          priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return { url: result.url };
      } else {
        return { error: result.error || 'Failed to create checkout session' };
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return { error: 'Network error. Please try again.' };
    }
  }
}

export const subscriptionService = SubscriptionService.getInstance();
