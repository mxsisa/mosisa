import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calculator,
  User,
  Mail,
  Phone,
  Users,
  MessageSquare,
  Send,
  CheckCircle,
  X,
} from "lucide-react";

interface GetQuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetQuoteForm({ isOpen, onClose }: GetQuoteFormProps) {
  const [formData, setFormData] = useState({
    contactName: "",
    organizationName: "",
    email: "",
    phone: "",
    numberOfPhysicians: "",
    currentEMR: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate sending quote request to support@autosoapai.com
      await sendQuoteRequest(formData);
      setSubmitStatus("success");

      // Close form after 3 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus("idle");
        setFormData({
          contactName: "",
          organizationName: "",
          email: "",
          phone: "",
          numberOfPhysicians: "",
          currentEMR: "",
          message: "",
        });
      }, 3000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendQuoteRequest = async (data: typeof formData) => {
    // In production, this would send to your backend which forwards to support@autosoapai.com
    console.log("📧 Quote Request Submitted:");
    console.log("📬 Sending to: support@autosoapai.com");
    console.log("📋 Form Data:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Log email content that would be sent
    const emailContent = `
🏥 NEW QUOTE REQUEST - AutoSOAP AI

CONTACT INFORMATION:
• Name: ${data.contactName}
• Organization: ${data.organizationName}
• Email: ${data.email}
• Phone: ${data.phone}

PRACTICE DETAILS:
• Number of Physicians: ${data.numberOfPhysicians}
• Current EMR: ${data.currentEMR || "Not specified"}

MESSAGE:
${data.message || "No additional message provided"}

---
This quote request was submitted through AutoSOAP AI.
Please follow up within 24 hours with a custom quote.
    `;

    console.log("📧 Email Content:", emailContent);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Calculator className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Get a Quote</h2>
              <p className="text-gray-600">
                Tell us about your practice and we'll create a custom quote
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {submitStatus === "success" ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Quote Request Sent!
              </h3>
              <p className="text-gray-600 mb-4">
                Thank you for your interest in AutoSOAP AI.
              </p>
              <p className="text-sm text-gray-500">
                We'll email you a custom quote within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">Your Name *</Label>
                      <Input
                        id="contactName"
                        placeholder="Dr. John Smith"
                        value={formData.contactName}
                        onChange={(e) =>
                          handleInputChange("contactName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="organizationName">
                        Organization Name *
                      </Label>
                      <Input
                        id="organizationName"
                        placeholder="Smith Medical Group"
                        value={formData.organizationName}
                        onChange={(e) =>
                          handleInputChange("organizationName", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@practice.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Practice Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Users className="w-5 h-5 mr-2" />
                    Practice Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="numberOfPhysicians">
                        Number of Physicians *
                      </Label>
                      <select
                        id="numberOfPhysicians"
                        value={formData.numberOfPhysicians}
                        onChange={(e) =>
                          handleInputChange(
                            "numberOfPhysicians",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">Select range...</option>
                        <option value="1">1 physician</option>
                        <option value="2-5">2-5 physicians</option>
                        <option value="6-10">6-10 physicians</option>
                        <option value="11-25">11-25 physicians</option>
                        <option value="26-50">26-50 physicians</option>
                        <option value="51+">51+ physicians</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="currentEMR">Current EMR System</Label>
                      <Input
                        id="currentEMR"
                        placeholder="e.g., Epic, Cerner, AllScripts"
                        value={formData.currentEMR}
                        onChange={(e) =>
                          handleInputChange("currentEMR", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="message">Tell us about your needs</Label>
                    <Textarea
                      id="message"
                      placeholder="Any specific requirements, questions, or additional information you'd like us to know..."
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      className="h-24"
                    />
                  </div>
                </CardContent>
              </Card>

              {submitStatus === "error" && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    There was an error submitting your quote request. Please try
                    again or contact us directly.
                  </AlertDescription>
                </Alert>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {submitStatus !== "success" && (
          <div className="border-t bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                * Required fields. We'll respond within 24 hours.
              </p>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !formData.contactName ||
                    !formData.email ||
                    !formData.numberOfPhysicians
                  }
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Get Quote
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
