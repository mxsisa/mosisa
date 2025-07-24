import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Loader2, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export function ProtectedRoute({
  children,
  requireSubscription = true,
}: ProtectedRouteProps) {
  const { currentUser, loading: authLoading } = useAuth();
  const { hasActiveSubscription, loading: subLoading } = useSubscription();
  const location = useLocation();
  const [subscriptionTimeout, setSubscriptionTimeout] = useState(false);

  // Calculate admin status once at the top
  const isAdmin = currentUser?.email?.toLowerCase() === 'mosisasaba04@gmail.com';

  // Add timeout for subscription loading - MUST be called before any returns
  useEffect(() => {
    if (subLoading && requireSubscription && !isAdmin) {
      const timer = setTimeout(() => {
        console.warn('Subscription check timeout - proceeding anyway');
        setSubscriptionTimeout(true);
      }, 15000); // 15 second timeout

      return () => clearTimeout(timer);
    }
  }, [subLoading, requireSubscription, isAdmin]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin bypass - allow access immediately for admin email (after auth is confirmed)
  if (isAdmin && requireSubscription) {
    console.log('Admin user detected - bypassing all subscription checks');
    return <>{children}</>;
  }

  // Show loading while checking subscription (with timeout) - only for non-admin users
  if (requireSubscription && subLoading && !subscriptionTimeout && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Checking your subscription...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment...</p>
        </div>
      </div>
    );
  }

  // If subscription timeout occurred, proceed to subscription required page (non-admin only)
  if (requireSubscription && subscriptionTimeout && !hasActiveSubscription && !isAdmin) {
    console.warn('Subscription check timed out, redirecting to subscription required');
    return <Navigate to="/subscription-required" replace />;
  }

  // Redirect to subscription required page if subscription is needed but not active (non-admin only)
  if (requireSubscription && !hasActiveSubscription && !subscriptionTimeout && !isAdmin) {
    return <Navigate to="/subscription-required" replace />;
  }

  return <>{children}</>;
}
