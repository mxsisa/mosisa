import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building,
  User,
  Mail,
  Phone,
  Users,
  MapPin,
  FileText,
  Send,
  CheckCircle,
  X,
} from "lucide-react";

interface EnterpriseFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnterpriseForm({
  isOpen,
  onClose,
}: EnterpriseFormProps) {
  const [formData, setFormData] = useState({
    // Organization Information
    organizationName: "",
    organizationType: "",
    contactName: "",
    title: "",
    email: "",
    phone: "",

    // Location & Scale
    address: "",
    city: "",
    state: "",
    zipCode: "",
    numberOfPhysicians: "",
    numberOfLocations: "",
    totalStaff: "",

    // Current Setup
    currentEMR: "",
    currentDocumentationMethod: "",
    monthlyPatientVolume: "",
    specialties: "",

    // Requirements
    integrationNeeds: "",
    securityRequirements: "",
    timeline: "",
    budget: "",
    additionalRequirements: "",

    // Use Case
    primaryUseCase: "",
    expectedBenefits: "",
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
      // Simulate sending email to support@autosoapai.com
      await sendEnterpriseInquiry(formData);
      setSubmitStatus("success");

      // Close form after 3 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus("idle");
        setFormData({
          organizationName: "",
          organizationType: "",
          contactName: "",
          title: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          numberOfPhysicians: "",
          numberOfLocations: "",
          totalStaff: "",
          currentEMR: "",
          currentDocumentationMethod: "",
          monthlyPatientVolume: "",
          specialties: "",
          integrationNeeds: "",
          securityRequirements: "",
          timeline: "",
          budget: "",
          additionalRequirements: "",
          primaryUseCase: "",
          expectedBenefits: "",
        });
      }, 3000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendEnterpriseInquiry = async (data: typeof formData) => {
    // In production, this would send to your backend which forwards to support@autosoapai.com
    console.log("📧 Enterprise Inquiry Submitted:");
    console.log("📬 Sending to: support@autosoapai.com");
    console.log("📋 Form Data:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Log email content that would be sent
    const emailContent = `
🏥 NEW ENTERPRISE INQUIRY - AutoSOAP AI

ORGANIZATION DETAILS:
• Organization: ${data.organizationName}
• Type: ${data.organizationType}
• Contact: ${data.contactName} (${data.title})
• Email: ${data.email}
• Phone: ${data.phone}

LOCATION & SCALE:
• Address: ${data.address}, ${data.city}, ${data.state} ${data.zipCode}
• Number of Physicians: ${data.numberOfPhysicians}
• Number of Locations: ${data.numberOfLocations}
• Total Staff: ${data.totalStaff}

CURRENT SETUP:
• Current EMR: ${data.currentEMR}
• Documentation Method: ${data.currentDocumentationMethod}
• Monthly Patient Volume: ${data.monthlyPatientVolume}
• Specialties: ${data.specialties}

REQUIREMENTS:
• Integration Needs: ${data.integrationNeeds}
• Security Requirements: ${data.securityRequirements}
• Timeline: ${data.timeline}
• Budget Range: ${data.budget}

USE CASE:
• Primary Use Case: ${data.primaryUseCase}
• Expected Benefits: ${data.expectedBenefits}
• Additional Requirements: ${data.additionalRequirements}

---
This inquiry was submitted through AutoSOAP AI Enterprise form.
Please follow up within 24 hours.
    `;

    console.log("📧 Email Content:", emailContent);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Building className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Enterprise Inquiry</h2>
              <p className="text-gray-600">
                Get a custom quote for your organization
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {submitStatus === "success" ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-4">
                Your enterprise inquiry has been submitted successfully.
              </p>
              <p className="text-sm text-gray-500">
                We'll contact you within 24 hours to discuss your requirements.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Organization Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Organization Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organizationName">
                        Organization Name *
                      </Label>
                      <Input
                        id="organizationName"
                        placeholder="e.g., Metro Health System"
                        value={formData.organizationName}
                        onChange={(e) =>
                          handleInputChange("organizationName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="organizationType">
                        Organization Type *
                      </Label>
                      <select
                        id="organizationType"
                        value={formData.organizationType}
                        onChange={(e) =>
                          handleInputChange("organizationType", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">Select type...</option>
                        <option value="Hospital System">Hospital System</option>
                        <option value="Medical Group">Medical Group</option>
                        <option value="Health Network">Health Network</option>
                        <option value="Academic Medical Center">
                          Academic Medical Center
                        </option>
                        <option value="Government Healthcare">
                          Government Healthcare
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">
                        Primary Contact Name *
                      </Label>
                      <Input
                        id="contactName"
                        placeholder="Full name"
                        value={formData.contactName}
                        onChange={(e) =>
                          handleInputChange("contactName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Title/Role *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., CIO, Medical Director"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
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
                        placeholder="contact@organization.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scale & Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Scale & Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <option value="10-25">10-25 physicians</option>
                        <option value="26-50">26-50 physicians</option>
                        <option value="51-100">51-100 physicians</option>
                        <option value="101-250">101-250 physicians</option>
                        <option value="251-500">251-500 physicians</option>
                        <option value="500+">500+ physicians</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="numberOfLocations">
                        Number of Locations
                      </Label>
                      <Input
                        id="numberOfLocations"
                        placeholder="e.g., 5 clinics"
                        value={formData.numberOfLocations}
                        onChange={(e) =>
                          handleInputChange("numberOfLocations", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalStaff">Total Clinical Staff</Label>
                      <Input
                        id="totalStaff"
                        placeholder="e.g., 500 staff members"
                        value={formData.totalStaff}
                        onChange={(e) =>
                          handleInputChange("totalStaff", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">
                        Primary Location (City, State)
                      </Label>
                      <Input
                        id="city"
                        placeholder="e.g., Chicago, IL"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyPatientVolume">
                        Monthly Patient Volume
                      </Label>
                      <select
                        id="monthlyPatientVolume"
                        value={formData.monthlyPatientVolume}
                        onChange={(e) =>
                          handleInputChange(
                            "monthlyPatientVolume",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select range...</option>
                        <option value="1,000-5,000">
                          1,000-5,000 patients
                        </option>
                        <option value="5,001-10,000">
                          5,001-10,000 patients
                        </option>
                        <option value="10,001-25,000">
                          10,001-25,000 patients
                        </option>
                        <option value="25,001-50,000">
                          25,001-50,000 patients
                        </option>
                        <option value="50,000+">50,000+ patients</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Setup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Current Setup & Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <Label htmlFor="timeline">Implementation Timeline</Label>
                      <select
                        id="timeline"
                        value={formData.timeline}
                        onChange={(e) =>
                          handleInputChange("timeline", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select timeline...</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6-12 months">6-12 months</option>
                        <option value="12+ months">12+ months</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialties">
                      Primary Medical Specialties
                    </Label>
                    <Input
                      id="specialties"
                      placeholder="e.g., Internal Medicine, Cardiology, Pediatrics"
                      value={formData.specialties}
                      onChange={(e) =>
                        handleInputChange("specialties", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="budget">
                      Estimated Annual Budget Range
                    </Label>
                    <select
                      id="budget"
                      value={formData.budget}
                      onChange={(e) =>
                        handleInputChange("budget", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select range...</option>
                      <option value="$50,000-$100,000">$50,000-$100,000</option>
                      <option value="$100,000-$250,000">
                        $100,000-$250,000
                      </option>
                      <option value="$250,000-$500,000">
                        $250,000-$500,000
                      </option>
                      <option value="$500,000-$1,000,000">
                        $500,000-$1,000,000
                      </option>
                      <option value="$1,000,000+">$1,000,000+</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="primaryUseCase">
                      Primary Use Case & Goals
                    </Label>
                    <Textarea
                      id="primaryUseCase"
                      placeholder="Describe how you plan to use AutoSOAP AI and what outcomes you're hoping to achieve..."
                      value={formData.primaryUseCase}
                      onChange={(e) =>
                        handleInputChange("primaryUseCase", e.target.value)
                      }
                      className="h-24"
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalRequirements">
                      Additional Requirements or Questions
                    </Label>
                    <Textarea
                      id="additionalRequirements"
                      placeholder="Any specific integration needs, security requirements, or other considerations..."
                      value={formData.additionalRequirements}
                      onChange={(e) =>
                        handleInputChange(
                          "additionalRequirements",
                          e.target.value,
                        )
                      }
                      className="h-24"
                    />
                  </div>
                </CardContent>
              </Card>

              {submitStatus === "error" && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    There was an error submitting your inquiry. Please try again
                    or contact us directly.
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
                * Required fields. We'll contact you within 24 hours.
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
                    !formData.organizationName ||
                    !formData.email
                  }
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Inquiry
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
