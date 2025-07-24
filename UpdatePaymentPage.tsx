import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  ArrowLeft,
  Calendar,
  User,
  Building,
} from "lucide-react";

interface UpdatePaymentPageProps {
  onBack: () => void;
}

export default function UpdatePaymentPage({ onBack }: UpdatePaymentPageProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nameOnCard: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setShowSuccess(true);
    setIsSubmitting(false);

    // Auto redirect back after success
    setTimeout(() => {
      onBack();
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, "");
    // Add spaces every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted;
  };

  if (showSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Method Updated!
          </h2>
          <p className="text-gray-600">
            Your new payment method has been saved securely. You'll be
            redirected back to your plan details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Update Payment Method
          </h2>
          <p className="text-gray-600">
            Securely update your billing information
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Your payment information is encrypted and secured with bank-level
          security. We never store your full credit card details.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(paymentData.cardNumber)}
                      onChange={(e) =>
                        handleInputChange("cardNumber", e.target.value)
                      }
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Month</Label>
                      <select
                        id="expiryMonth"
                        value={paymentData.expiryMonth}
                        onChange={(e) =>
                          handleInputChange("expiryMonth", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option
                            key={i + 1}
                            value={String(i + 1).padStart(2, "0")}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Year</Label>
                      <select
                        id="expiryYear"
                        value={paymentData.expiryYear}
                        onChange={(e) =>
                          handleInputChange("expiryYear", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">YYYY</option>
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i} value={new Date().getFullYear() + i}>
                            {new Date().getFullYear() + i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          handleInputChange("cvv", e.target.value)
                        }
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input
                      id="nameOnCard"
                      placeholder="Dr. John Smith"
                      value={paymentData.nameOnCard}
                      onChange={(e) =>
                        handleInputChange("nameOnCard", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Billing Address
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="billingAddress">Street Address</Label>
                      <Input
                        id="billingAddress"
                        placeholder="123 Medical Drive"
                        value={paymentData.billingAddress}
                        onChange={(e) =>
                          handleInputChange("billingAddress", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Chicago"
                          value={paymentData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="IL"
                          value={paymentData.state}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="60601"
                          value={paymentData.zipCode}
                          onChange={(e) =>
                            handleInputChange("zipCode", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={paymentData.country}
                          onChange={(e) =>
                            handleInputChange("country", e.target.value)
                          }
                          required
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button type="button" variant="outline" onClick={onBack}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Update Payment Method
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Security Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="w-5 h-5 mr-2" />
                Secure Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">SSL Encrypted</p>
                  <p className="text-sm text-gray-600">
                    256-bit encryption protects your data
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">PCI Compliant</p>
                  <p className="text-sm text-gray-600">
                    Meets industry security standards
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">No Storage</p>
                  <p className="text-sm text-gray-600">
                    We never store your full card details
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-2">Current Plan</h4>
              <p className="text-sm text-gray-600 mb-2">Individual Provider</p>
              <p className="text-2xl font-bold text-primary">$99/month</p>
              <p className="text-sm text-gray-500">
                Next billing: January 15, 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
