import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  Shield,
  Bell,
  FileText,
  Mic,
  Download,
  Globe,
  Clock,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  CreditCard,
} from "lucide-react";
import { subscriptionService, SubscriptionInfo } from "@/lib/subscription-service";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  const { toast } = useToast();

  // Load subscription info when modal opens
  useEffect(() => {
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
          variant: "default",
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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  // Settings state
  const [settings, setSettings] = useState({
    // Profile settings
    fullName: "Dr. Mosisa Saba",
    email: "support@autosoapai.com",
    license: "MD123456",
    specialty: "Internal Medicine",
    npi: "1234567890",
    signature:
      "Dr. Mosisa Saba, MD\nInternal Medicine\nAutoSOAP Medical Practice",

    // SOAP preferences
    defaultTemplate: "general",
    includePatientAge: true,
    includePatientGender: true,
    autoGenerateICD: true,
    includeDiagnosticCodes: true,
    soapFormat: "standard",
    customFields: "",

    // Voice settings
    voiceEnabled: true,
    microphoneGain: "medium",
    autoStart: false,
    voiceLanguage: "en-US",
    punctuation: true,
    medicalTerms: true,

    // Export settings
    defaultExportFormat: "pdf",
    includeHeader: true,
    includeFooter: true,
    includeLogo: true,
    exportEncryption: true,

    // Privacy settings
    dataRetention: "7-years",
    analytics: true,
    crashReports: false,
    usageStatistics: true,

    // Notification settings
    emailNotifications: true,
    teamUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
  });

  const handleSave = async () => {
    setSaveStatus("saving");
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

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
        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex"
          >
            <TabsList className="flex flex-col h-full w-64 p-4 space-y-2 bg-gray-50">
              <TabsTrigger value="profile" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Profile & License
              </TabsTrigger>
              <TabsTrigger value="soap" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                SOAP Preferences
              </TabsTrigger>
              <TabsTrigger value="voice" className="w-full justify-start">
                <Mic className="w-4 h-4 mr-2" />
                Voice & Input
              </TabsTrigger>
              <TabsTrigger value="export" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export & PDF
              </TabsTrigger>
              <TabsTrigger value="privacy" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Privacy & Security
              </TabsTrigger>
              <TabsTrigger value="subscription" className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                Subscription & Billing
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="w-full justify-start"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 p-6 overflow-y-auto">
              {/* Profile & License Tab */}
              <TabsContent value="profile" className="space-y-6">
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
                      <Select
                        value={settings.specialty}
                        onValueChange={(value) =>
                          handleSettingChange("specialty", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Internal Medicine">
                            Internal Medicine
                          </SelectItem>
                          <SelectItem value="Family Medicine">
                            Family Medicine
                          </SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Emergency Medicine">
                            Emergency Medicine
                          </SelectItem>
                          <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="signature">Digital Signature</Label>
                      <Textarea
                        id="signature"
                        placeholder="Your digital signature for SOAP notes..."
                        value={settings.signature}
                        onChange={(e) =>
                          handleSettingChange("signature", e.target.value)
                        }
                        className="h-24"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SOAP Preferences Tab */}
              <TabsContent value="soap" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SOAP Note Generation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="defaultTemplate">Default Template</Label>
                      <Select
                        value={settings.defaultTemplate}
                        onValueChange={(value) =>
                          handleSettingChange("defaultTemplate", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Medical
                          </SelectItem>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="psychiatry">Psychiatry</SelectItem>
                          <SelectItem value="emergency">
                            Emergency Medicine
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="includeAge">Include Patient Age</Label>
                        <Switch
                          id="includeAge"
                          checked={settings.includePatientAge}
                          onCheckedChange={(checked) =>
                            handleSettingChange("includePatientAge", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="includeGender">
                          Include Patient Gender
                        </Label>
                        <Switch
                          id="includeGender"
                          checked={settings.includePatientGender}
                          onCheckedChange={(checked) =>
                            handleSettingChange("includePatientGender", checked)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoICD">
                          Auto-generate ICD-10 Codes
                        </Label>
                        <Switch
                          id="autoICD"
                          checked={settings.autoGenerateICD}
                          onCheckedChange={(checked) =>
                            handleSettingChange("autoGenerateICD", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="includeCodes">
                          Include Diagnostic Codes
                        </Label>
                        <Switch
                          id="includeCodes"
                          checked={settings.includeDiagnosticCodes}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "includeDiagnosticCodes",
                              checked,
                            )
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="customFields">
                        Custom Fields (comma-separated)
                      </Label>
                      <Input
                        id="customFields"
                        placeholder="e.g., Allergies, Current Medications, Social History"
                        value={settings.customFields}
                        onChange={(e) =>
                          handleSettingChange("customFields", e.target.value)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Voice & Input Tab */}
              <TabsContent value="voice" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Recognition Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Voice Input Enabled</Label>
                        <p className="text-sm text-gray-500">
                          Enable speech-to-text functionality
                        </p>
                      </div>
                      <Switch
                        checked={settings.voiceEnabled}
                        onCheckedChange={(checked) =>
                          handleSettingChange("voiceEnabled", checked)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="voiceLanguage">Voice Language</Label>
                      <Select
                        value={settings.voiceLanguage}
                        onValueChange={(value) =>
                          handleSettingChange("voiceLanguage", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                          <SelectItem value="es-ES">Spanish</SelectItem>
                          <SelectItem value="fr-FR">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="micGain">Microphone Sensitivity</Label>
                      <Select
                        value={settings.microphoneGain}
                        onValueChange={(value) =>
                          handleSettingChange("microphoneGain", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>Auto Punctuation</Label>
                        <Switch
                          checked={settings.punctuation}
                          onCheckedChange={(checked) =>
                            handleSettingChange("punctuation", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Medical Term Recognition</Label>
                        <Switch
                          checked={settings.medicalTerms}
                          onCheckedChange={(checked) =>
                            handleSettingChange("medicalTerms", checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Export & PDF Tab */}
              <TabsContent value="export" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Export & PDF Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="exportFormat">
                        Default Export Format
                      </Label>
                      <Select
                        value={settings.defaultExportFormat}
                        onValueChange={(value) =>
                          handleSettingChange("defaultExportFormat", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="docx">Word Document</SelectItem>
                          <SelectItem value="txt">Plain Text</SelectItem>
                          <SelectItem value="hl7">HL7 FHIR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>Include Header</Label>
                        <Switch
                          checked={settings.includeHeader}
                          onCheckedChange={(checked) =>
                            handleSettingChange("includeHeader", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Include Footer</Label>
                        <Switch
                          checked={settings.includeFooter}
                          onCheckedChange={(checked) =>
                            handleSettingChange("includeFooter", checked)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>Include Practice Logo</Label>
                        <Switch
                          checked={settings.includeLogo}
                          onCheckedChange={(checked) =>
                            handleSettingChange("includeLogo", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>PDF Encryption</Label>
                        <Switch
                          checked={settings.exportEncryption}
                          onCheckedChange={(checked) =>
                            handleSettingChange("exportEncryption", checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy & Security Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

                    <div>
                      <Label htmlFor="dataRetention">
                        Data Retention Period
                      </Label>
                      <Select
                        value={settings.dataRetention}
                        onValueChange={(value) =>
                          handleSettingChange("dataRetention", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-year">1 Year</SelectItem>
                          <SelectItem value="3-years">3 Years</SelectItem>
                          <SelectItem value="7-years">
                            7 Years (Recommended)
                          </SelectItem>
                          <SelectItem value="indefinite">Indefinite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Usage Analytics</Label>
                          <p className="text-xs text-gray-500">
                            Anonymous usage data
                          </p>
                        </div>
                        <Switch
                          checked={settings.analytics}
                          onCheckedChange={(checked) =>
                            handleSettingChange("analytics", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Crash Reports</Label>
                          <p className="text-xs text-gray-500">
                            Help improve stability
                          </p>
                        </div>
                        <Switch
                          checked={settings.crashReports}
                          onCheckedChange={(checked) =>
                            handleSettingChange("crashReports", checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Subscription & Billing Tab */}
              <TabsContent value="subscription" className="space-y-6">
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
                                {subscriptionInfo?.currentPeriodEnd && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    {subscriptionInfo.cancelAtPeriodEnd ? 'Ends' : 'Renews'}: {subscriptionInfo.currentPeriodEnd.toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  subscriptionInfo?.status === 'active' ? "bg-green-100 text-green-800" :
                                  subscriptionInfo?.status === 'canceled' ? "bg-red-100 text-red-800" :
                                  "bg-blue-100 text-blue-800"
                                }
                              >
                                {subscriptionInfo?.status === 'active' ? 'Active' :
                                 subscriptionInfo?.status === 'canceled' ? 'Canceled' :
                                 subscriptionInfo?.status === 'expired' ? 'Expired' : 'Trial'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-base font-medium">Usage This Month</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>SOAP Notes Generated</span>
                              <span className="font-semibold">Unlimited</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>API Calls</span>
                              <span className="font-semibold">Unlimited</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium">Billing Information</Label>
                          <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-600">No payment method required for trial</p>
                            <Button
                              variant="outline"
                              className="mt-2"
                              onClick={() => window.location.href = '/pricing'}
                            >
                              Upgrade Plan
                            </Button>
                          </div>
                        </div>

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
                            {subscriptionInfo?.status === 'active' && subscriptionInfo.cancelAtPeriodEnd && (
                              <div className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                <p className="text-sm text-yellow-800">
                                  Subscription will be canceled at the end of the billing period
                                </p>
                              </div>
                            )}
                            {subscriptionInfo?.status === 'trial' && (
                              <Button
                                variant="outline"
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

                    <div className="border-t pt-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                          <div>
                            <h4 className="font-semibold text-yellow-800">Important Notice</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              If you cancel your subscription, you'll retain access until the end of your current billing period.
                              Your data will be preserved for 30 days after cancellation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-xs text-gray-500">
                            General system updates
                          </p>
                        </div>
                        <Switch
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) =>
                            handleSettingChange("emailNotifications", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Team Updates</Label>
                          <p className="text-xs text-gray-500">
                            Team member activity
                          </p>
                        </div>
                        <Switch
                          checked={settings.teamUpdates}
                          onCheckedChange={(checked) =>
                            handleSettingChange("teamUpdates", checked)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Security Alerts</Label>
                          <p className="text-xs text-gray-500">
                            Login and security events
                          </p>
                        </div>
                        <Switch
                          checked={settings.securityAlerts}
                          onCheckedChange={(checked) =>
                            handleSettingChange("securityAlerts", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Marketing Emails</Label>
                          <p className="text-xs text-gray-500">
                            Product updates and tips
                          </p>
                        </div>
                        <Switch
                          checked={settings.marketingEmails}
                          onCheckedChange={(checked) =>
                            handleSettingChange("marketingEmails", checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
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
              {saveStatus === "saving" && (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              )}
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
