import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Stethoscope,
  Users,
  Star,
  HelpCircle,
  Loader2,
  ArrowRight,
  Building,
  Mail,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import EnterpriseForm from "@/components/EnterpriseForm";

export default function Pricing() {
  const { currentUser } = useAuth();
  const { startCheckout, loading } = useStripeCheckout();
  const navigate = useNavigate();
  const [showEnterpriseForm, setShowEnterpriseForm] = useState(false);

  const handleStartTrial = (plan: "individual" | "clinic") => {
    console.log("🎯 Starting trial for plan:", plan);

    // Direct Stripe payment links with free trials included
    const stripeLinks = {
      individual: "https://buy.stripe.com/bJe28t63i1bsfv0gzR5os01", // Solo Provider
      clinic: "https://buy.stripe.com/cNi00lgHW7zQ5Uqabt5os00" // Clinic Pro
    };

    // Redirect directly to the appropriate Stripe payment link
    const paymentLink = stripeLinks[plan];
    console.log("🎯 Redirecting to Stripe payment link:", paymentLink);
    window.open(paymentLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Navigation */}
      <nav className="border-b border-teal-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                alt="AutoSOAP AI Logo"
                className="h-8 w-auto"
              />
            </Link>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-primary"
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-primary"
                asChild
              >
                <Link to="/features">Features</Link>
              </Button>
              {currentUser ? (
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/app">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Open App
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-primary"
                    asChild
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90" asChild>
                    <Link to="/signup">Start Free Trial</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            7-Day Free Trial
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="text-primary"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your practice. Start with a free trial, no
            credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Individual Plan */}
            <Card className="border-0 shadow-2xl bg-white relative hover:shadow-3xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Individual Provider
                  </h3>
                  <div className="text-5xl font-bold text-primary mb-2">
                    $99<span className="text-xl text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">
                    Perfect for solo physicians and independent practitioners
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center text-green-800">
                      <Clock className="w-5 h-5 mr-2" />
                      <span className="font-semibold">7-Day Free Trial</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Full access to all features, no credit card required
                    </p>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-3">
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          Unlimited SOAP Note Generation
                        </span>
                        <p className="text-sm text-gray-600">
                          Generate as many notes as you need
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          AI-Powered ICD-10 Codes
                        </span>
                        <p className="text-sm text-gray-600">
                          Automatic diagnostic code suggestions
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          Voice & Text Input
                        </span>
                        <p className="text-sm text-gray-600">
                          Dictate or type your patient information
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          Cloud Storage & Sync
                        </span>
                        <p className="text-sm text-gray-600">
                          Access your notes from any device
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          Export to PDF/Word
                        </span>
                        <p className="text-sm text-gray-600">
                          Download notes in multiple formats
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          Email Support
                        </span>
                        <p className="text-sm text-gray-600">
                          Get help when you need it
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={() => handleStartTrial("individual")}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4 mr-2" />
                  )}
                  Start Free Trial
                </Button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  No credit card required • Cancel anytime
                </p>
              </CardContent>
            </Card>

            {/* Clinic Plan */}
            <Card className="border-0 shadow-2xl bg-white relative hover:shadow-3xl transition-all duration-300">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-primary text-white px-4 py-2 text-sm font-semibold flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Clinic Team
                  </h3>
                  <div className="text-5xl font-bold text-primary mb-2">
                    $399<span className="text-xl text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">
                    For clinics and medical groups with up to 5 providers
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center text-green-800">
                      <Clock className="w-5 h-5 mr-2" />
                      <span className="font-semibold">7-Day Free Trial</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Full team access, no credit card required
                    </p>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-3">
                    Everything in Individual, plus:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          Up to 5 Provider Accounts
                        </span>
                        <p className="text-sm text-gray-600">
                          Add multiple team members
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          Team Management Dashboard
                        </span>
                        <p className="text-sm text-gray-600">
                          Manage users and permissions
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          Shared Templates
                        </span>
                        <p className="text-sm text-gray-600">
                          Standardize documentation across your team
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          Usage Analytics
                        </span>
                        <p className="text-sm text-gray-600">
                          Track team productivity and ROI
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          Priority Support
                        </span>
                        <p className="text-sm text-gray-600">
                          Phone and email support with faster response
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-700 font-medium">
                          Advanced Integrations
                        </span>
                        <p className="text-sm text-gray-600">
                          Connect with popular EMR systems
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={() => handleStartTrial("clinic")}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4 mr-2" />
                  )}
                  Start Free Trial
                </Button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  No credit card required • Cancel anytime
                </p>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 relative hover:shadow-3xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Enterprise
                  </h3>
                  <div className="text-4xl font-bold text-gray-700 mb-2">
                    Custom Pricing
                  </div>
                  <p className="text-gray-600">
                    For large healthcare organizations with 25+ providers
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700 font-medium">
                        Unlimited Providers
                      </span>
                      <p className="text-sm text-gray-600">
                        Scale across your entire organization
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700 font-medium">
                        Advanced Analytics & Reporting
                      </span>
                      <p className="text-sm text-gray-600">
                        Executive dashboards and custom reports
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700 font-medium">
                        SSO & Advanced Security
                      </span>
                      <p className="text-sm text-gray-600">
                        Single sign-on and enterprise security features
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700 font-medium">
                        Custom EMR Integrations
                      </span>
                      <p className="text-sm text-gray-600">
                        Tailored integrations with your systems
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700 font-medium">
                        Dedicated Support Manager
                      </span>
                      <p className="text-sm text-gray-600">
                        White-glove implementation and ongoing support
                      </p>
                    </div>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  size="lg"
                  onClick={() => setShowEnterpriseForm(true)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Get Custom Quote
                </Button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Custom pricing based on your organization's needs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about AutoSOAP AI pricing and
              features
            </p>
          </div>

          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      How does the 7-day free trial work?
                    </h3>
                    <p className="text-gray-600">
                      You get full access to all features for 7 days without
                      providing a credit card. If you decide to continue after
                      the trial, you'll be prompted to enter payment
                      information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Can I change plans or cancel anytime?
                    </h3>
                    <p className="text-gray-600">
                      Yes, you can upgrade, downgrade, or cancel your
                      subscription at any time. Changes take effect at your next
                      billing cycle, and you'll only pay for what you use.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Is my patient data secure?
                    </h3>
                    <p className="text-gray-600">
                      Absolutely. AutoSOAP AI is built with enterprise-grade
                      security and is HIPAA compliant. All data is encrypted in
                      transit and at rest, and we never store patient
                      identifiable information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Do you offer discounts for larger practices?
                    </h3>
                    <p className="text-gray-600">
                      For practices with more than 5 providers, we offer custom
                      enterprise plans with volume discounts. Contact our sales
                      team to discuss your specific needs and get a custom
                      quote.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      What payment methods do you accept?
                    </h3>
                    <p className="text-gray-600">
                      We accept all major credit cards (Visa, MasterCard,
                      American Express) and ACH bank transfers for annual
                      subscriptions. All payments are processed securely through
                      Stripe.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start Your Free Trial Today
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of healthcare professionals who save hours every day
            with AutoSOAP AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-50"
              onClick={() => handleStartTrial("individual")}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Clock className="w-5 h-5 mr-2" />
              )}
              Start Individual Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => handleStartTrial("clinic")}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Users className="w-5 h-5 mr-2" />
              )}
              Start Team Trial
            </Button>
          </div>
          <p className="text-sm text-teal-100 mt-4">
            No credit card required • Full access for 7 days • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                  alt="AutoSOAP AI Logo"
                  className="h-8 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 text-sm">
                Transforming medical documentation with AI.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/features"
                    className="hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025&nbsp;AutoSOAP AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Enterprise Form Modal */}
      <EnterpriseForm
        isOpen={showEnterpriseForm}
        onClose={() => setShowEnterpriseForm(false)}
      />
    </div>
  );
}
