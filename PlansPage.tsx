import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import {
  CheckCircle,
  CreditCard,
  Users,
  Star,
  ArrowRight,
  Building,
  Phone,
  Mail,
  UserCheck,
  Stethoscope,
  Loader2,
} from "lucide-react";
import UpdatePaymentPage from "./UpdatePaymentPage";
import DownloadInvoicePage from "./DownloadInvoicePage";
import GetQuoteForm from "./GetQuoteForm";

export default function PlansPage() {
  const [currentView, setCurrentView] = useState<
    "plans" | "payment" | "invoices"
  >("plans");
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [userStats, setUserStats] = useState({
    totalSOAPs: 0,
    monthlySOAPs: 0,
    lastActivity: null as Date | null,
  });

  const { startCheckout, loading } = useStripeCheckout();
  const { currentUser } = useAuth();
  const { subscription, planDisplayName, isInTrial, daysUntilExpiry } =
    useSubscription();

  // Real-time user data
  useEffect(() => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserStats({
          totalSOAPs: data.totalSOAPGenerated || 0,
          monthlySOAPs:
            data.monthlySOAPGenerated || data.totalSOAPGenerated || 0,
          lastActivity: data.lastActivity?.toDate() || null,
        });
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Calculate plan data based on real subscription
  const currentPlan = {
    name: planDisplayName || "Free Trial",
    price:
      subscription?.planType === "clinic"
        ? "$399/month"
        : subscription?.planType === "individual"
          ? "$99/month"
          : "$0/month",
    status: isInTrial
      ? "Trial"
      : subscription?.status === "active"
        ? "Active"
        : "Inactive",
    renewalDate:
      daysUntilExpiry !== null
        ? `${daysUntilExpiry} days remaining`
        : "No renewal date",
    usage: {
      soaps: userStats.totalSOAPs,
      limit: isInTrial ? "Unlimited during trial" : "Unlimited",
    },
  };

  if (currentView === "payment") {
    return <UpdatePaymentPage onBack={() => setCurrentView("plans")} />;
  }

  if (currentView === "invoices") {
    return <DownloadInvoicePage onBack={() => setCurrentView("plans")} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Plan & Billing
        </h2>
        <p className="text-gray-600">
          Manage your subscription and explore upgrade options
        </p>
      </div>

      {/* Current Plan */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Current Plan
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">
              {currentPlan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-lg">{currentPlan.name}</h4>
              <p className="text-2xl font-bold text-primary">
                {currentPlan.price}
              </p>
              <p className="text-sm text-gray-500">
                Renews {currentPlan.renewalDate}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Usage</p>
              <p className="text-lg font-semibold">
                {currentPlan.usage.soaps} SOAPs
              </p>
              <p className="text-sm text-gray-500">
                of {currentPlan.usage.limit}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView("payment")}
              >
                Update Payment
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView("invoices")}
              >
                Download Invoice
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Available Plans
        </h3>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Individual Plan */}
          <Card className="relative">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <UserCheck className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Individual Provider
                  </h3>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  $99<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for solo physicians</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700">
                    Unlimited SOAP generations
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700">AI-powered ICD-10 codes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700">Voice & text input</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700">Export to PDF/EMR</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700">24/7 Support</span>
                </li>
              </ul>

              <Button className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Clinic Team Plan */}
          <Card className="relative border-primary">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-primary text-white px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Stethoscope className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Clinic Team
                  </h3>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  $399<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Up to 5 providers</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700">
                    Everything in Individual
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700">
                    Team management dashboard
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700">
                    Usage analytics per provider
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700">Role-based permissions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>

              <Button
                className="w-full"
                onClick={() =>
                  window.open(
                    "https://buy.stripe.com/cNi00lgHW7zQ5Uqabt5os00",
                    "_blank",
                  )
                }
              >
                Upgrade to Team
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Building className="w-6 h-6 text-gray-700 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Enterprise
                  </h3>
                </div>
                <div className="text-3xl font-bold text-gray-700 mb-2">
                  Custom Pricing
                </div>
                <p className="text-gray-600">
                  For large healthcare organizations
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-700">Unlimited providers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-700">
                    Advanced analytics & reporting
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-700">SSO & advanced security</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-700">Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-700">
                    Dedicated support manager
                  </span>
                </li>
              </ul>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowQuoteForm(true)}
              >
                Get a Quote
                <Mail className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Usage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">89</p>
              <p className="text-sm text-gray-600">SOAPs this month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">47h</p>
              <p className="text-sm text-gray-600">Time saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">98.5%</p>
              <p className="text-sm text-gray-600">Accuracy rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">$3,420</p>
              <p className="text-sm text-gray-600">Value generated</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <Mail className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-gray-600">
                  Get help with billing or technical issues
                </p>
                <p className="text-sm text-primary">support@autosoap.ai</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-gray-600">
                  Talk to our team directly
                </p>
                <p className="text-sm text-primary">1-800-AUTOSOAP</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Get Quote Form Modal */}
      <GetQuoteForm
        isOpen={showQuoteForm}
        onClose={() => setShowQuoteForm(false)}
      />
    </div>
  );
}
