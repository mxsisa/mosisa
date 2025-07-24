import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Stethoscope,
  Mic,
  MicOff,
  FileText,
  Clock,
  User,
  LogOut,
  Settings,
  History,
  Download,
  Users,
  ArrowRight,
  Copy,
  Check,
  Brain,
  AlertCircle,
  Loader2,
  Sparkles,
  Home,
  BarChart3,
  CreditCard,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { SOAPResult } from "@/lib/soap-service-new";
import { simplifiedSoapService } from "@/lib/soap-service-simple";
import { speechService, SpeechResult } from "@/lib/speech-service";
import { pdfService } from "@/lib/pdf-service";
import { templatesService, SOAPTemplate } from "@/lib/templates-service";
import { collaborationService } from "@/lib/collaboration-service";
import { emrService } from "@/lib/emr-service";
import SettingsModal from "@/components/SettingsSimple";
import AnalyticsPage from "@/components/AnalyticsPage";
import PlansPage from "@/components/PlansPage";
import UserProfile from "@/components/UserProfile";
import LogoutConfirmation from "@/components/LogoutConfirmation";
import Admin from "@/pages/Admin";

export default function AppDashboard() {
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [patientAge, setPatientAge] = useState<number | undefined>();
  const [patientGender, setPatientGender] = useState<
    "male" | "female" | "other" | "not-specified" | undefined
  >();
  const [specialty, setSpecialty] = useState("General Practice");
  const [currentSOAP, setCurrentSOAP] = useState<SOAPResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<SOAPResult[]>([]);
  const [detectedMedicalTerms, setDetectedMedicalTerms] = useState<string[]>(
    [],
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    "app" | "analytics" | "plans" | "admin"
  >("app");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<SOAPTemplate | null>(
    null,
  );
  const [availableTemplates, setAvailableTemplates] = useState<SOAPTemplate[]>(
    [],
  );
  const [useTemplate, setUseTemplate] = useState(false);
  const [totalSOAPsGenerated, setTotalSOAPsGenerated] = useState(0);

  const { currentUser, logout } = useAuth();
  const { subscription, isInTrial, daysUntilExpiry, planDisplayName } =
    useSubscription();
  const navigate = useNavigate();

  // Admin access check (after currentUser is available)
  const isAdmin =
    currentUser?.email?.toLowerCase() === "mosisasaba04@gmail.com";

  // Real-time listener for SOAP count
  useEffect(() => {
    if (!currentUser) return;

    import("@/lib/firebase").then(({ db }) => {
      import("firebase/firestore").then(({ doc, onSnapshot }) => {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribe = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setTotalSOAPsGenerated(data.totalSOAPGenerated || 0);
          }
        });

        return () => unsubscribe();
      });
    });
  }, [currentUser]);

  // Load templates when specialty changes
  useEffect(() => {
    const templates = templatesService.getTemplatesBySpecialty(specialty);
    setAvailableTemplates(templates);

    // Auto-select first template if using templates
    if (useTemplate && templates.length > 0) {
      setSelectedTemplate(templates[0]);
    }
  }, [specialty, useTemplate]);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    console.log("🚪 Starting logout process...");
    setShowLogoutConfirmation(false);

    // Immediately redirect to homepage - no waiting for async operations
    console.log("🏠 Redirecting to main homepage immediately...");

    // Clear all data first
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log("🧹 Cleared local storage");
    } catch (e) {
      console.log("Warning: Could not clear storage");
    }

    // Logout in background but don't wait for it
    logout()
      .then(() => {
        console.log("✅ Firebase logout completed");
      })
      .catch((error) => {
        console.log("❌ Firebase logout error (but still redirecting):", error);
      });

    // Force immediate redirect to the main homepage
    window.location.href = "/";
  };

  const handleVoiceToggle = () => {
    if (!speechService.isRecognitionSupported()) {
      setSpeechError(
        "Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.",
      );
      setSpeechSupported(false);
      return;
    }

    if (!isRecording) {
      // Start recording
      setSpeechError(null);
      setInterimText("");
      setDetectedMedicalTerms([]);

      const success = speechService.startListening(
        (result: SpeechResult) => {
          if (result.isFinal) {
            // Add final result to input text
            setInputText((prev) => {
              const newText = prev + (prev ? " " : "") + result.transcript;
              return newText;
            });
            setInterimText("");

            // Update detected medical terms
            if (result.medicalTermsDetected.length > 0) {
              setDetectedMedicalTerms((prev) => [
                ...new Set([...prev, ...result.medicalTermsDetected]),
              ]);
            }
          } else {
            // Show interim results
            setInterimText(result.transcript);
          }
        },
        (error: string) => {
          setSpeechError(error);
          setIsRecording(false);
          setInterimText("");
        },
        {
          continuous: true,
          interimResults: true,
          medicalMode: true,
        },
      );

      if (success) {
        setIsRecording(true);
      }
    } else {
      // Stop recording
      speechService.stopListening();
      setIsRecording(false);
      setInterimText("");
    }
  };

  // Test function to manually set SOAP note and verify UI works
  const testSOAPDisplay = () => {
    console.log("🧪 Testing manual SOAP display...");
    const testSOAP = {
      soapNote: `**SUBJECTIVE:**
Patient presents with severe headache rated 7/10, accompanied by nausea and vomiting (3 episodes today). Has been taking Tylenol twice daily for the past 2 days with minimal relief. Also reports high blood pressure and chest tightness.

**OBJECTIVE:**
Vital signs: Blood pressure elevated
General appearance: Patient appears uncomfortable, holding head
Neurological: Alert and oriented, no focal neurological deficits noted

**ASSESSMENT:**
1. Severe headache with associated symptoms - rule out secondary causes
2. Hypertension - requires monitoring and management
3. Chest discomfort - further evaluation needed

**PLAN:**
1. Neurological workup including imaging if indicated
2. Blood pressure monitoring and antihypertensive management
3. Symptomatic treatment for headache
4. Follow-up in 24-48 hours if symptoms persist

**ICD-10 DIAGNOSTIC CODES:**
• R51.9 - Headache, unspecified
• I10 - Essential hypertension
• R06.02 - Shortness of breath

**CPT PROCEDURE CODES:**
• 99213 - Office or other outpatient visit for evaluation and management
• 93000 - Electrocardiogram, routine ECG with at least 12 leads

**HCPCS CODES:**
• G0444 - Annual wellness visit; includes a personalized prevention plan`,
      icdCodes: [
        {
          code: "R51.9",
          description: "Headache, unspecified",
          confidence: 0.9,
        },
        { code: "I10", description: "Essential hypertension", confidence: 0.8 },
        { code: "R06.02", description: "Shortness of breath", confidence: 0.7 },
      ],
      cptCodes: [
        {
          code: "99213",
          description:
            "Office or other outpatient visit for evaluation and management",
          confidence: 0.9,
        },
        {
          code: "93000",
          description: "Electrocardiogram, routine ECG with at least 12 leads",
          confidence: 0.8,
        },
      ],
      hcpcsCodes: [
        {
          code: "G0444",
          description:
            "Annual wellness visit; includes a personalized prevention plan",
          confidence: 0.7,
        },
      ],
      generatedAt: new Date().toISOString(),
      wordCount: 150,
    };

    setCurrentSOAP(testSOAP);
    setIsGenerating(false);
    console.log("✅ Test SOAP set manually");
  };

  const generateSOAP = async () => {
    if (!inputText.trim()) {
      setError(
        "Please enter patient information before generating a SOAP note.",
      );
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Removed timeout since SOAP generation is working

    try {
      console.log("🚀 Starting SOAP generation...");

      // Prepare enhanced patient info with template if selected
      let enhancedPatientInfo = inputText;

      if (useTemplate && selectedTemplate) {
        console.log("📋 Using template:", selectedTemplate.name);
        enhancedPatientInfo = templatesService.generateTemplatePrompt(
          selectedTemplate,
          inputText,
          specialty,
        );

        // Update template usage
        templatesService.updateTemplateUsage(selectedTemplate.id);
      }

      console.log("🚀 Starting SIMPLIFIED SOAP generation...");

      const result = await simplifiedSoapService.generateSOAP({
        patientInfo: enhancedPatientInfo,
        specialty,
        patientAge,
        patientGender:
          patientGender === "not-specified" ? undefined : patientGender,
      });

      console.log("��� SOAP note generated:", result);
      console.log(
        "📝 SOAP content preview:",
        result.soapNote?.substring(0, 200),
      );
      console.log("🏷️ ICD codes received:", result.icdCodes);
      console.log("🔧 CPT codes received:", result.cptCodes);
      console.log("📋 HCPCS codes received:", result.hcpcsCodes);
      console.log("🔍 Full result object structure:", {
        hasIcdCodes: !!result.icdCodes,
        hasCptCodes: !!result.cptCodes,
        hasHcpcsCodes: !!result.hcpcsCodes,
        icdLength: result.icdCodes?.length,
        cptLength: result.cptCodes?.length,
        hcpcsLength: result.hcpcsCodes?.length,
      });

      console.log("🎯 Setting current SOAP state...");
      setCurrentSOAP(result);

      console.log("📚 Updating generation history...");
      setGenerationHistory((prev) => [result, ...prev.slice(0, 9)]); // Keep last 10

      // Clear form after successful generation
      setInputText("");
      setPatientAge(undefined);
      setPatientGender(undefined);

      // Clear loading state on success
      console.log("✅ SUCCESS - Clearing loading state");
      console.log("🔄 SOAP generation completed successfully!");
      console.log("📊 Generated:", {
        words: result.wordCount,
        icdCodes: result.icdCodes.length,
        cptCodes: result.cptCodes.length,
        hcpcsCodes: result.hcpcsCodes.length,
      });

      // Force clear loading state and errors immediately
      setIsGenerating(false);
      setError(null);
      setSpeechError(null);

      // Show success message
      setSuccessMessage(
        `SOAP note generated successfully! (${result.wordCount} words, ${result.icdCodes.length} ICD, ${result.cptCodes.length} CPT, ${result.hcpcsCodes.length} HCPCS codes) - Analytics updated.`,
      );

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      console.log("✅ Loading and errors cleared successfully");

      // Additional safety clears to ensure UI updates
      setTimeout(() => {
        setIsGenerating(false);
        setError(null);
        setSpeechError(null);
      }, 50);
    } catch (error) {
      console.error("❌ SOAP generation failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate SOAP note. Please try again.",
      );
    } finally {
      console.log("�� SOAP generation completed, clearing loading state...");
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!currentSOAP) return;

    try {
      const formattedText = soapService.formatForExport(
        currentSOAP.soapNote,
        inputText,
      );
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      setError("Failed to copy to clipboard. Please try again.");
    }
  };

  const downloadSOAP = () => {
    if (!currentSOAP) return;

    try {
      const formattedText = soapService.formatForExport(currentSOAP.soapNote);
      const blob = new Blob([formattedText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SOAP_Note_${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download:", error);
      setError("Failed to download SOAP note. Please try again.");
    }
  };

  const downloadPDF = async () => {
    if (!currentSOAP) return;

    try {
      setError(null);
      await pdfService.exportSOAPToPDF(currentSOAP, {
        includeLetterhead: true,
        includeLogo: true,
        providerName:
          currentUser?.displayName ||
          currentUser?.email ||
          "Healthcare Provider",
        facilityName: "AutoSOAP AI Medical Practice",
        facilityAddress: "Professional Medical Documentation",
        patientInfo: {
          age: patientAge,
          gender: patientGender,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to export PDF:", error);
      setError("Failed to export PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                  alt="AutoSOAP AI Logo"
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold text-gray-900">
                  AutoSOAP AI
                </span>
              </div>

              {/* Navigation Menu */}
              <nav className="flex items-center space-x-1">
                <Button
                  variant={currentPage === "app" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage("app")}
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>SOAP Generator</span>
                </Button>

                <Button
                  variant={currentPage === "analytics" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage("analytics")}
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </Button>

                <Button
                  variant={currentPage === "plans" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage("plans")}
                  className="flex items-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Plans</span>
                </Button>

                {/* Admin button for admin users */}
                {isAdmin && (
                  <Button
                    variant={currentPage === "admin" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage("admin")}
                    className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Button>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Real-time SOAP Counter */}
              <Badge
                variant="outline"
                className="border-green-300 text-green-700 bg-green-50"
              >
                <FileText className="w-3 h-3 mr-1" />
                {totalSOAPsGenerated} SOAPs Generated
              </Badge>

              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setShowUserProfile(true)}
              >
                <User className="w-3 h-3 mr-1" />
                {currentUser?.displayName || currentUser?.email}
              </Badge>

              <Badge
                variant={isInTrial ? "outline" : "default"}
                className={
                  isInTrial
                    ? "border-orange-300 text-orange-700"
                    : "bg-green-100 text-green-800"
                }
              >
                {planDisplayName}
                {isInTrial && daysUntilExpiry !== null && (
                  <span className="ml-1">({daysUntilExpiry} days left)</span>
                )}
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === "analytics" && <AnalyticsPage />}
        {currentPage === "plans" && <PlansPage />}
        {currentPage === "admin" && isAdmin && <Admin />}
        {currentPage === "app" && (
          <>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>AutoSOAP AI SOAP Generation</span>
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {successMessage && (
                    <Alert className="border-green-200 bg-green-50">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {successMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Patient Demographics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="age">Patient Age (optional)</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="e.g., 45"
                        value={patientAge || ""}
                        onChange={(e) =>
                          setPatientAge(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender (optional)</Label>
                      <Select
                        value={patientGender || "not-specified"}
                        onValueChange={(value) =>
                          setPatientGender(value as any)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-specified">
                            Not specified
                          </SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="specialty">Medical Specialty</Label>
                      <Select value={specialty} onValueChange={setSpecialty}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Practice">
                            General Practice
                          </SelectItem>
                          <SelectItem value="Emergency Medicine">
                            Emergency Medicine
                          </SelectItem>
                          <SelectItem value="Internal Medicine">
                            Internal Medicine
                          </SelectItem>
                          <SelectItem value="Family Medicine">
                            Family Medicine
                          </SelectItem>
                          <SelectItem value="Urgent Care">
                            Urgent Care
                          </SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Orthopedics">
                            Orthopedics
                          </SelectItem>
                          <SelectItem value="Dermatology">
                            Dermatology
                          </SelectItem>
                          <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Template Selection */}
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="use-template"
                            checked={useTemplate}
                            onChange={(e) => setUseTemplate(e.target.checked)}
                            className="w-4 h-4 text-primary"
                          />
                          <Label
                            htmlFor="use-template"
                            className="font-medium text-blue-900"
                          >
                            Use SOAP Template
                          </Label>
                        </div>

                        {useTemplate && (
                          <div className="flex-1">
                            <Select
                              value={selectedTemplate?.id || ""}
                              onValueChange={(value) => {
                                const template = availableTemplates.find(
                                  (t) => t.id === value,
                                );
                                setSelectedTemplate(template || null);
                              }}
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Choose a template..." />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTemplates.map((template) => (
                                  <SelectItem
                                    key={template.id}
                                    value={template.id}
                                  >
                                    <div>
                                      <div className="font-medium">
                                        {template.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {template.description}
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {useTemplate && selectedTemplate && (
                        <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                          <h4 className="font-medium text-blue-900 mb-2">
                            �� Template: {selectedTemplate.name}
                          </h4>
                          <p className="text-sm text-blue-700 mb-2">
                            {selectedTemplate.description}
                          </p>
                          <div className="text-xs text-blue-600">
                            <strong>Focus areas:</strong>{" "}
                            {selectedTemplate.commonTerms
                              .slice(0, 5)
                              .join(", ")}
                            {selectedTemplate.commonTerms.length > 5 &&
                              ` +${selectedTemplate.commonTerms.length - 5} more`}
                          </div>
                        </div>
                      )}

                      {useTemplate && availableTemplates.length === 0 && (
                        <div className="mt-3 text-sm text-blue-600">
                          📝 No specific templates available for {specialty}.
                          Using general practice template.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Tabs defaultValue="text" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="text">Text Input</TabsTrigger>
                      <TabsTrigger value="voice">Voice Input</TabsTrigger>
                    </TabsList>

                    <TabsContent value="text" className="space-y-4">
                      <Label htmlFor="patient-info">
                        Patient Information & Clinical Findings
                      </Label>
                      <Textarea
                        id="patient-info"
                        placeholder="Enter detailed patient information:&#10;&#10;• Chief complaint and history of present illness&#10;• Review of systems&#10;• Physical examination findings&#10;• Vital signs&#10;• Laboratory or diagnostic results&#10;• Clinical observations&#10;&#10;Example: 'Patient is a 45-year-old male presenting with chest pain that started 2 hours ago. Pain is described as crushing, 8/10 severity, radiating to left arm. Associated with shortness of breath and diaphoresis. Vital signs: BP 150/90, HR 110, RR 22, SpO2 96% on room air...'"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] text-base"
                      />
                      <div className="text-sm text-gray-500">
                        💡 <strong>Tip:</strong> The more detailed information
                        you provide, the more accurate and comprehensive the
                        SOAP note will be.
                      </div>
                    </TabsContent>

                    <TabsContent value="voice" className="space-y-4">
                      {speechError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{speechError}</AlertDescription>
                        </Alert>
                      )}

                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                          isRecording
                            ? "border-red-400 bg-red-50"
                            : speechSupported
                              ? "border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10"
                              : "border-gray-300 bg-gray-50"
                        }`}
                      >
                        {speechSupported ? (
                          <>
                            <div className="mb-4">
                              <div
                                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all duration-300 ${
                                  isRecording
                                    ? "bg-red-500 shadow-lg shadow-red-500/30 animate-pulse"
                                    : "bg-primary shadow-lg shadow-primary/30"
                                }`}
                              >
                                {isRecording ? (
                                  <MicOff className="w-10 h-10 text-white" />
                                ) : (
                                  <Mic className="w-10 h-10 text-white" />
                                )}
                              </div>
                            </div>

                            <Button
                              size="lg"
                              variant={isRecording ? "destructive" : "default"}
                              onClick={handleVoiceToggle}
                              className={`${isRecording ? "shadow-lg" : "bg-primary hover:bg-primary/90 shadow-lg"} px-8`}
                              disabled={!speechSupported}
                            >
                              {isRecording ? (
                                <>
                                  <MicOff className="w-5 h-5 mr-2" />
                                  Stop Recording
                                </>
                              ) : (
                                <>
                                  <Mic className="w-5 h-5 mr-2" />
                                  Start Voice Input
                                </>
                              )}
                            </Button>

                            {isRecording && (
                              <div className="mt-6">
                                <div className="flex justify-center space-x-2 mb-3">
                                  <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                                  <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-100"></div>
                                  <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-200"></div>
                                </div>
                                <p className="text-red-700 font-medium">
                                  🎤 Listening... Speak clearly about the
                                  patient
                                </p>
                                <p className="text-xs text-red-600 mt-1">
                                  Say medical terms like "blood pressure",
                                  "chest pain", "medication names"
                                </p>
                              </div>
                            )}

                            {!isRecording && (
                              <div className="mt-4 text-sm text-gray-600 max-w-md mx-auto">
                                <p className="mb-2">
                                  🎤{" "}
                                  <strong>Voice Recognition Features:</strong>
                                </p>
                                <ul className="text-xs space-y-1 text-left">
                                  <li>• Optimized for medical terminology</li>
                                  <li>
                                    • Real-time transcription with medical
                                    spell-check
                                  </li>
                                  <li>
                                    • Supports dictation of symptoms, exam
                                    findings, and plans
                                  </li>
                                  <li>• Works best in quiet environment</li>
                                  <li className="text-green-700 font-medium">
                                    🔒 Voice recordings destroyed immediately
                                    after transcription
                                  </li>
                                </ul>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-500">
                            <MicOff className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-lg font-medium mb-2">
                              Voice Input Not Available
                            </p>
                            <p className="text-sm">
                              Speech recognition is not supported in this
                              browser. Please use Chrome, Safari, or Edge for
                              voice functionality.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Interim Results */}
                      {interimText && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                            <Mic className="w-4 h-4 mr-2" />
                            Speaking... (interim)
                          </h4>
                          <p className="text-yellow-800 italic">
                            {interimText}
                          </p>
                        </div>
                      )}

                      {/* Final Transcribed Text */}
                      {inputText && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2 flex items-center">
                            <Check className="w-4 h-4 mr-2" />
                            Transcribed Patient Information:
                          </h4>
                          <div className="bg-white rounded p-3 border border-green-200">
                            <p className="text-gray-800 whitespace-pre-wrap">
                              {inputText}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Detected Medical Terms */}
                      {detectedMedicalTerms.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                            <Brain className="w-4 h-4 mr-2" />
                            Medical Terms Detected:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {detectedMedicalTerms.map((term, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-blue-100 text-blue-800"
                              >
                                {term}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-gray-500 text-center">
                        💡 <strong>Pro Tip:</strong> Speak naturally and include
                        patient age, symptoms, vital signs, physical exam
                        findings, and your clinical assessment for the most
                        comprehensive SOAP note.
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button
                    onClick={generateSOAP}
                    disabled={!inputText.trim() || isGenerating}
                    className={`w-full shadow-lg ${
                      useTemplate && selectedTemplate
                        ? "bg-gradient-to-r from-blue-600 to-primary hover:from-blue-700 hover:to-primary/90"
                        : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    }`}
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        AI is analyzing and generating your SOAP note
                        {useTemplate && selectedTemplate && " using template"}
                        ...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Generate SOAP Note with AI
                        {useTemplate && selectedTemplate && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-white/20 text-white border-white/30"
                          >
                            📋 {selectedTemplate.name}
                          </Badge>
                        )}
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  {isGenerating && (
                    <div className="text-center text-sm text-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                      </div>
                      <p className="mt-2">
                        Processing with GPT-4 medical AI...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <span>AI-Generated SOAP Note</span>
                      </CardTitle>
                      {currentSOAP && (
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>📝 {currentSOAP.wordCount} words</span>
                          <span>
                            🏷️ {currentSOAP.icdCodes.length} ICD codes
                          </span>
                          {currentSOAP.cptCodes &&
                            currentSOAP.cptCodes.length > 0 && (
                              <span>
                                🔧 {currentSOAP.cptCodes.length} CPT codes
                              </span>
                            )}
                          {currentSOAP.hcpcsCodes &&
                            currentSOAP.hcpcsCodes.length > 0 && (
                              <span>
                                📋 {currentSOAP.hcpcsCodes.length} HCPCS codes
                              </span>
                            )}
                          <span>
                            ⏰{" "}
                            {new Date(
                              currentSOAP.generatedAt,
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {currentSOAP && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyToClipboard}
                          disabled={copied}
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          {copied ? "Copied!" : "Copy"}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadSOAP}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Text
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadPDF}
                          className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          PDF
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              const formats = emrService.getSupportedFormats();
                              const format = formats[0]; // Default to first format
                              const result = await emrService.exportToEMR(
                                currentSOAP,
                                format.name,
                              );
                              emrService.downloadEMRExport(
                                result.content,
                                result.filename,
                                result.mimeType,
                              );
                            } catch (error) {
                              setError("Failed to export to EMR format");
                            }
                          }}
                          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        >
                          <ArrowRight className="w-4 h-4 mr-1" />
                          EMR
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {currentSOAP ? (
                    <div className="space-y-4">
                      {/* SOAP Note Display */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                            {currentSOAP.soapNote
                              .split("**")
                              .map((part, index) => {
                                if (index % 2 === 0) {
                                  return <span key={index}>{part}</span>;
                                } else {
                                  return (
                                    <strong
                                      key={index}
                                      className="text-primary font-semibold"
                                    >
                                      {part}
                                    </strong>
                                  );
                                }
                              })}
                          </div>
                        </div>
                      </div>

                      {/* ICD Codes Section */}
                      {currentSOAP.icdCodes.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            ICD-10 Diagnostic Codes
                          </h4>
                          <div className="space-y-2">
                            {currentSOAP.icdCodes.map((code, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-white rounded p-3 border border-blue-200"
                              >
                                <div>
                                  <span className="font-mono text-sm font-bold text-blue-800">
                                    {code.code}
                                  </span>
                                  <span className="text-gray-700 ml-2">
                                    {code.description}
                                  </span>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-800"
                                >
                                  {Math.round(code.confidence * 100)}%
                                  confidence
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CPT Codes Section */}
                      {currentSOAP.cptCodes &&
                        currentSOAP.cptCodes.length > 0 && (
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              CPT Procedure Codes
                            </h4>
                            <div className="space-y-2">
                              {currentSOAP.cptCodes.map((code, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-white rounded p-3 border border-green-200"
                                >
                                  <div>
                                    <span className="font-mono text-sm font-bold text-green-800">
                                      {code.code}
                                    </span>
                                    <span className="text-gray-700 ml-2">
                                      {code.description}
                                    </span>
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800"
                                  >
                                    {Math.round(code.confidence * 100)}%
                                    confidence
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* HCPCS Codes Section */}
                      {currentSOAP.hcpcsCodes &&
                        currentSOAP.hcpcsCodes.length > 0 && (
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              HCPCS Codes
                            </h4>
                            <div className="space-y-2">
                              {currentSOAP.hcpcsCodes.map((code, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-white rounded p-3 border border-purple-200"
                                >
                                  <div>
                                    <span className="font-mono text-sm font-bold text-purple-800">
                                      {code.code}
                                    </span>
                                    <span className="text-gray-700 ml-2">
                                      {code.description}
                                    </span>
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="bg-purple-100 text-purple-800"
                                  >
                                    {Math.round(code.confidence * 100)}%
                                    confidence
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Generation Info */}
                      <div className="text-xs text-gray-500 border-t pt-3">
                        Generated by AutoSOAP AI using GPT-4 medical
                        intelligence • Please review and modify as clinically
                        appropriate • Generated:{" "}
                        {new Date(currentSOAP.generatedAt).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
                      <div className="text-gray-500 max-w-md">
                        <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium mb-2">
                          Ready for AI Generation
                        </p>
                        <p className="text-sm leading-relaxed">
                          Enter patient information and clinical findings above,
                          then click "Generate SOAP Note with AI" to create a
                          professional, structured documentation with ICD-10
                          codes powered by GPT-4.
                        </p>
                        <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-400">
                          <Sparkles className="w-3 h-3" />
                          <span>Powered by OpenAI GPT-4</span>
                          <Sparkles className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent History */}
            <Card className="mt-8 shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-primary" />
                  <span>Recent SOAP Notes</span>
                  {generationHistory.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {generationHistory.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generationHistory.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {generationHistory.map((note, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-gray-900">
                                  SOAP Note #{generationHistory.length - index}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {note.wordCount} words
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500">
                                Generated:{" "}
                                {new Date(note.generatedAt).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCurrentSOAP(note)}
                              className="text-primary hover:text-primary/80"
                            >
                              View
                            </Button>
                          </div>

                          {/* Preview of SOAP content */}
                          <div className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {note.soapNote
                              .replace(/\*\*/g, "")
                              .substring(0, 150)}
                            ...
                          </div>

                          {/* Medical Codes preview */}
                          <div className="flex flex-wrap gap-1">
                            {/* ICD Codes */}
                            {note.icdCodes
                              .slice(0, 2)
                              .map((code, codeIndex) => (
                                <Badge
                                  key={`icd-${codeIndex}`}
                                  variant="secondary"
                                  className="text-xs bg-blue-100 text-blue-800"
                                >
                                  ICD: {code.code}
                                </Badge>
                              ))}

                            {/* CPT Codes */}
                            {note.cptCodes &&
                              note.cptCodes
                                .slice(0, 2)
                                .map((code, codeIndex) => (
                                  <Badge
                                    key={`cpt-${codeIndex}`}
                                    variant="secondary"
                                    className="text-xs bg-green-100 text-green-800"
                                  >
                                    CPT: {code.code}
                                  </Badge>
                                ))}

                            {/* HCPCS Codes */}
                            {note.hcpcsCodes &&
                              note.hcpcsCodes
                                .slice(0, 1)
                                .map((code, codeIndex) => (
                                  <Badge
                                    key={`hcpcs-${codeIndex}`}
                                    variant="secondary"
                                    className="text-xs bg-purple-100 text-purple-800"
                                  >
                                    HCPCS: {code.code}
                                  </Badge>
                                ))}

                            {/* More codes indicator */}
                            {note.icdCodes.length +
                              (note.cptCodes?.length || 0) +
                              (note.hcpcsCodes?.length || 0) >
                              5 && (
                              <Badge variant="secondary" className="text-xs">
                                +
                                {note.icdCodes.length +
                                  (note.cptCodes?.length || 0) +
                                  (note.hcpcsCodes?.length || 0) -
                                  5}{" "}
                                more
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-500">No SOAP notes generated yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Your AI-generated notes will appear here for quick access
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        onLogout={handleLogout}
        user={currentUser}
        planDisplayName={planDisplayName}
        isInTrial={isInTrial}
        daysUntilExpiry={daysUntilExpiry}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirmation(false)}
      />
    </div>
  );
}
