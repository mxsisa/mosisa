import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Settings,
  User,
  Shield,
  Bell,
  FileText,
  Mic,
  Download,
  Save,
  X,
  CheckCircle,
  Info,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { subscriptionService, SubscriptionInfo } from "@/lib/subscription-service";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  const { toast } = useToast();

  // Settings state
  const [settings, setSettings] = useState({
    fullName: "Dr. Mosisa Saba",
    email: "support@autosoapai.com",
    license: "MD123456",
    specialty: "Internal Medicine",
    npi: "1234567890",
    signature:
      "Dr. Mosisa Saba, MD\nInternal Medicine\nAutoSOAP Medical Practice",
    autoGenerateICD: true,
    includePatientAge: true,
    voiceEnabled: true,
    exportFormat: "pdf",
    dataRetention: "7-years",
    emailNotifications: true,
  });

  // Load subscription info when modal opens
  React.useEffect(() => {
    if (isOpen) {
      loadSubscriptionInfo();
    }
  }, [isOpen]);

  const loadSubscriptionInfo = async () => {
    try {
      const info = await subscriptionService.getSubscriptionInfo();
      setSubscriptionInfo(info);
    } catch (error) {
      console.error('Failed to load subscription info:', error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    setCancelingSubscription(true);
    try {
      const result = await subscriptionService.cancelSubscription();

      if (result.success) {
        toast({
          title: "Subscription Canceled",
          description: result.message,
        });
        await loadSubscriptionInfo(); // Reload subscription status
      } else {
        toast({
          title: "Cancellation Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setCancelingSubscription(false);
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "profile", label: "Profile & License", icon: User },
    { id: "soap", label: "SOAP Preferences", icon: FileText },
    { id: "voice", label: "Voice & Input", icon: Mic },
    { id: "export", label: "Export & PDF", icon: Download },
    { id: "subscription", label: "Subscription & Billing", icon: CreditCard },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Settings</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Tab Navigation */}
          <div className="w-64 p-4 bg-gray-50 border-r">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Profile & License Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={settings.fullName}
                          onChange={(e) =>
                            handleSettingChange("fullName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={settings.email}
                          onChange={(e) =>
                            handleSettingChange("email", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="license">Medical License</Label>
                        <Input
                          id="license"
                          value={settings.license}
                          onChange={(e) =>
                            handleSettingChange("license", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="npi">NPI Number</Label>
                        <Input
                          id="npi"
                          value={settings.npi}
                          onChange={(e) =>
                            handleSettingChange("npi", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialty">Medical Specialty</Label>
                      <select
                        id="specialty"
                        value={settings.specialty}
                        onChange={(e) =>
                          handleSettingChange("specialty", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Internal Medicine">
                          Internal Medicine
                        </option>
                        <option value="Family Medicine">Family Medicine</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Emergency Medicine">
                          Emergency Medicine
                        </option>
                        <option value="Psychiatry">Psychiatry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="signature">Digital Signature</Label>
                      <textarea
                        id="signature"
                        placeholder="Your digital signature for SOAP notes..."
                        value={settings.signature}
                        onChange={(e) =>
                          handleSettingChange("signature", e.target.value)
                        }
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* SOAP Preferences Tab */}
            {activeTab === "soap" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SOAP Note Generation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">
                          Auto-generate ICD-10 Codes
                        </Label>
                        <p className="text-sm text-gray-600">
                          Automatically suggest diagnostic codes
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoGenerateICD}
                          onChange={(e) =>
                            handleSettingChange(
                              "autoGenerateICD",
                              e.target.checked,
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">
                          Include Patient Age
                        </Label>
                        <p className="text-sm text-gray-600">
                          Add patient age to SOAP notes
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.includePatientAge}
                          onChange={(e) =>
                            handleSettingChange(
                              "includePatientAge",
                              e.target.checked,
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Voice & Input Tab */}
            {activeTab === "voice" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Recognition Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">
                          Voice Input Enabled
                        </Label>
                        <p className="text-sm text-gray-600">
                          Enable speech-to-text functionality
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.voiceEnabled}
                          onChange={(e) =>
                            handleSettingChange(
                              "voiceEnabled",
                              e.target.checked,
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div>
                      <Label htmlFor="voiceLanguage">Voice Language</Label>
                      <select
                        id="voiceLanguage"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Subscription & Billing Tab */}
            {activeTab === "subscription" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium">Current Plan</Label>
                          <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-blue-900">
                                  {subscriptionInfo?.plan === 'individual' ? 'Individual Provider' :
                                   subscriptionInfo?.plan === 'clinic' ? 'Clinic Plan' : 'Free Trial'}
                                </p>
                                <p className="text-sm text-blue-700">
                                  {subscriptionInfo?.plan === 'individual' ? '$29/month' :
                                   subscriptionInfo?.plan === 'clinic' ? '$99/month' : '$0/month'}
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                subscriptionInfo?.status === 'active' ? 'bg-green-100 text-green-800' :
                                subscriptionInfo?.status === 'canceled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {subscriptionInfo?.status === 'active' ? 'Active' :
                                 subscriptionInfo?.status === 'canceled' ? 'Canceled' :
                                 'Trial'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium">Account Actions</Label>
                          <div className="mt-2 space-y-2">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => window.location.href = '/pricing'}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              View Plans & Pricing
                            </Button>

                            {subscriptionInfo?.status === 'active' && !subscriptionInfo.cancelAtPeriodEnd && (
                              <Button
                                variant="destructive"
                                className="w-full"
                                onClick={handleCancelSubscription}
                                disabled={cancelingSubscription}
                              >
                                <X className="w-4 h-4 mr-2" />
                                {cancelingSubscription ? 'Canceling...' : 'Cancel Subscription'}
                              </Button>
                            )}

                            {subscriptionInfo?.status === 'trial' && (
                              <Button
                                variant="default"
                                className="w-full"
                                onClick={() => window.location.href = '/pricing'}
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Upgrade to Premium
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {subscriptionInfo?.status === 'active' && subscriptionInfo.cancelAtPeriodEnd && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                          <div>
                            <h4 className="font-semibold text-yellow-800">Subscription Ending</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Your subscription will end at the end of your current billing period.
                              You can reactivate anytime before then.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Other tabs with simplified content */}
            {activeTab === "export" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Export & PDF Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="exportFormat">
                        Default Export Format
                      </Label>
                      <select
                        id="exportFormat"
                        value={settings.exportFormat}
                        onChange={(e) =>
                          handleSettingChange("exportFormat", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="pdf">PDF</option>
                        <option value="docx">Word Document</option>
                        <option value="txt">Plain Text</option>
                        <option value="hl7">HL7 FHIR</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-yellow-600" />
                        <p className="text-sm font-medium text-yellow-800">
                          HIPAA Compliance
                        </p>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        All settings are configured to maintain HIPAA compliance
                        and patient privacy.
                      </p>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="dataRetention">
                        Data Retention Period
                      </Label>
                      <select
                        id="dataRetention"
                        value={settings.dataRetention}
                        onChange={(e) =>
                          handleSettingChange("dataRetention", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="1-year">1 Year</option>
                        <option value="3-years">3 Years</option>
                        <option value="7-years">7 Years (Recommended)</option>
                        <option value="indefinite">Indefinite</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-600">
                          General system updates
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) =>
                            handleSettingChange(
                              "emailNotifications",
                              e.target.checked,
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Info className="w-4 h-4" />
            <span>Changes are automatically saved</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSave} disabled={saveStatus === "saving"}>
              {saveStatus === "saved" && (
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              )}
              {saveStatus === "idle" && <Save className="w-4 h-4 mr-2" />}
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                  ? "Saved!"
                  : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
