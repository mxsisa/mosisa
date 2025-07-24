import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Shield,
  Stethoscope,
  FileText,
  Users,
  Mic,
  Keyboard,
  Loader2,
  LogIn,
} from "lucide-react";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ClinicCarousel } from "@/components/ui/carousel";

// Interactive Demo Component
const InteractiveDemo = ({
  onStartTrial,
  loading,
}: {
  onStartTrial: (plan: "individual" | "clinic") => void;
  loading: boolean;
}) => {
  const [demoStep, setDemoStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [generatedSOAP, setGeneratedSOAP] = useState("");

  const demoSteps = [
    {
      title: "Step 1: Voice Input",
      description: "Click the microphone to start voice recording",
      action: "record",
    },
    {
      title: "Step 2: AI Processing",
      description: "Watch as AI processes your voice into structured data",
      action: "process",
    },
    {
      title: "Step 3: SOAP Generation",
      description: "See the complete SOAP note with ICD-10 codes",
      action: "generate",
    },
  ];

  const simulateVoiceInput = () => {
    setIsRecording(true);
    setDemoStep(1);

    // Simulate voice transcription
    setTimeout(() => {
      setTranscribedText(
        "35-year-old female presents with a 3-day history of sore throat, fever up to 101.5°F, and difficulty swallowing. Patient reports no cough, no runny nose. Physical exam reveals erythematous throat with tonsillar exudate, tender cervical lymphadenopathy. Vital signs stable.",
      );
      setIsRecording(false);
      setDemoStep(2);
    }, 3000);

    // Simulate AI processing and SOAP generation
    setTimeout(() => {
      setGeneratedSOAP(`**SUBJECTIVE:**
35 y/o female c/o sore throat x3 days, fever (101.5°F), odynophagia. Denies cough, rhinorrhea.

**OBJECTIVE:**
Vitals: stable
HEENT: Erythematous throat, tonsillar exudate, tender cervical LAD

**ASSESSMENT:**
Acute streptococcal pharyngitis

**PLAN:**
- Rapid strep test
- Amoxicillin 500mg BID x10 days
- Analgesics for pain relief
- Follow-up if symptoms worsen

**ICD-10 CODES:**
J02.0 - Acute streptococcal pharyngitis`);
      setDemoStep(3);
    }, 6000);
  };

  const resetDemo = () => {
    setDemoStep(0);
    setIsRecording(false);
    setTranscribedText("");
    setGeneratedSOAP("");
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-teal-50 rounded-2xl p-8 border border-teal-100">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left side - Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Interactive Demo</h3>

            {/* Steps indicator */}
            <div className="space-y-4 mb-6">
              {demoSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 ${demoStep >= index ? "text-primary" : "text-gray-400"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      demoStep > index
                        ? "bg-primary text-white"
                        : demoStep === index
                          ? "bg-primary/20 text-primary border-2 border-primary"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {demoStep > index ? "✓" : index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Controls */}
            <div className="space-y-4">
              {demoStep === 0 && (
                <Button
                  onClick={simulateVoiceInput}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Demo Recording
                </Button>
              )}

              {demoStep === 1 && (
                <div className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-red-500 flex items-center justify-center mb-4 ${isRecording ? "animate-pulse" : ""}`}
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-medium text-red-600">
                    Recording...
                  </p>
                  <p className="text-sm text-gray-500">
                    Listening for medical dictation
                  </p>
                </div>
              )}

              {demoStep >= 2 && (
                <div className="space-y-3">
                  <Button
                    onClick={resetDemo}
                    variant="outline"
                    className="w-full"
                  >
                    Try Demo Again
                  </Button>
                  <Button
                    onClick={() => onStartTrial("individual")}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      "Start Free Trial"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Output */}
        <div className="space-y-6">
          {/* Voice Transcription */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Keyboard className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Voice Transcription</h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
              {transcribedText ? (
                <p className="text-gray-700">{transcribedText}</p>
              ) : (
                <p className="text-gray-400 italic">
                  Voice input will appear here...
                </p>
              )}
            </div>
          </div>

          {/* Generated SOAP Note */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Generated SOAP Note</h4>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 min-h-[200px]">
              {generatedSOAP ? (
                <div className="space-y-3">
                  {generatedSOAP.split("\n\n").map((section, index) => (
                    <div key={index}>
                      {section.startsWith("**") ? (
                        <div className="space-y-1">
                          <p className="font-semibold text-primary">
                            {section.replace(/\*\*/g, "")}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {section}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">
                  AI-generated SOAP note will appear here...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Index() {
  const { startCheckout, loading, error } = useStripeCheckout();
  const { currentUser } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const handleStartTrial = (plan: "individual" | "clinic") => {
    startCheckout(plan, true); // true for trial
  };

  const handleWatchDemo = () => {
    setShowDemo(true);
    // Scroll to demo section
    setTimeout(() => {
      const demoSection = document.getElementById("demo-section");
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Navigation */}
      <nav className="border-b border-teal-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                alt="AutoSOAP AI Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">
                AutoSOAP AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-primary"
                asChild
              >
                <Link to="/pricing">Pricing</Link>
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-primary"
                asChild
              >
                <Link to="/features">Features</Link>
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-primary"
                asChild
              >
                <Link to="/about">About</Link>
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-primary"
                asChild
              >
                <Link to="/contact">Contact</Link>
              </Button>
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  {/* Show admin link for admin users */}
                  {["mosisasaba04@gmail.com", "mosisa@autosoapai.com"].includes(
                    currentUser.email?.toLowerCase() || "",
                  ) && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/admin">Admin</Link>
                    </Button>
                  )}
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link to="/app">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Open App
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-primary"
                    asChild
                  >
                    <Link to="/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Powered by GPT-4
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Eliminate Documentation
              <span className="text-primary"> Burnout</span> for Physicians
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform voice or typed input into structured SOAP notes with
              ICD-10 codes in seconds. No downloads, no EMR integration
              required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
                onClick={() => handleStartTrial("individual")}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Clock className="w-5 h-5 mr-2" />
                )}
                Start 7-Day Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-3 border-primary text-primary hover:bg-primary/10"
                onClick={handleWatchDemo}
              >
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Instant access • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      {showDemo && (
        <section id="demo-section" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                See AutoSOAP AI in Action
              </h2>
              <p className="text-xl text-gray-600">
                Watch how voice input transforms into professional SOAP notes
                instantly
              </p>
            </div>

            <InteractiveDemo
              onStartTrial={handleStartTrial}
              loading={loading}
            />
          </div>
        </section>
      )}

      {/* Demo Preview */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-0 bg-white">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500 ml-2">
                      AutoSOAP AI
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-primary/30">
                    <div className="flex items-center space-x-2 mb-3">
                      <Mic className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-gray-700">
                        Voice Input
                      </span>
                    </div>
                    <p className="text-gray-600 italic">
                      "35-year-old female presents with 3-day history of sore
                      throat, fever, and difficulty swallowing..."
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Generated SOAP Note
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-primary">S:</span>
                      <span className="text-gray-700 ml-2">
                        35 y/o female c/o sore throat x3 days...
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-primary">O:</span>
                      <span className="text-gray-700 ml-2">
                        Vitals stable, erythematous throat...
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-primary">A:</span>
                      <span className="text-gray-700 ml-2">
                        Acute pharyngitis
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-primary">P:</span>
                      <span className="text-gray-700 ml-2">
                        Supportive care, follow up PRN
                      </span>
                    </div>
                    <div className="pt-2 border-t border-primary/20">
                      <span className="font-medium text-primary">ICD-10:</span>
                      <span className="text-gray-700 ml-2">
                        J02.9 - Acute pharyngitis, unspecified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Modern Medical Practice
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed specifically for urgent care providers, concierge
              physicians, and mobile clinics who need fast, accurate
              documentation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Seconds, Not Minutes
                </h3>
                <p className="text-gray-600">
                  Generate complete SOAP notes in under 30 seconds. Reduce
                  charting time by hours each day.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Quick Setup
                </h3>
                <p className="text-gray-600">
                  Browser-based tool with no downloads or EMR integration
                  needed. Just login, open and start documenting.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ICD-10 Integration
                </h3>
                <p className="text-gray-600">
                  Automatic diagnostic code suggestions powered by AI ensure
                  accurate billing and compliance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Voice & Text Input
                </h3>
                <p className="text-gray-600">
                  Dictate naturally or type your notes. Our AI understands
                  medical terminology and context.
                </p>
                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                  🔒 <strong>Privacy Protected:</strong> Voice recordings are
                  destroyed immediately after transcription.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Clinical Accuracy
                </h3>
                <p className="text-gray-600">
                  GPT-4 powered AI trained on medical documentation maintains
                  clinical precision and formatting.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Scalable for Teams
                </h3>
                <p className="text-gray-600">
                  Individual and clinic plans support solo providers to teams of
                  5 with unlimited generations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Medical Practices
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of healthcare providers who have transformed their
              documentation workflow with AutoSOAP AI across diverse medical
              specialties.
            </p>
          </div>

          <ClinicCarousel />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start with a 7-day free trial, then choose the plan that fits your
              practice.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Individual Plan */}
            <Card className="border-0 shadow-xl bg-white relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Individual Provider
                  </h3>
                  <div className="text-4xl font-bold text-primary mb-2">
                    $99<span className="text-lg text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">Perfect for solo physicians</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-gray-700">
                      Unlimited SOAP generations
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-gray-700">
                      AI-powered ICD-10 codes
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-gray-700">Voice & text input</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-gray-700">No setup required</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-gray-700">7-day free trial</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={() => handleStartTrial("individual")}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Clinic Plan */}
            <Card className="border-0 shadow-xl bg-white relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-primary text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Clinic Team
                  </h3>
                  <div className="text-4xl font-bold text-primary mb-2">
                    $399<span className="text-lg text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">Up to 5 providers</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-gray-700">
                      Everything in Individual
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-gray-700">Up to 5 user accounts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-gray-700">
                      Team management dashboard
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span className="text-gray-700">7-day free trial</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={() => handleStartTrial("clinic")}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Eliminate Documentation Burnout?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join hundreds of physicians who have reclaimed hours of their day
            with AutoSOAP AI.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-3 bg-white text-primary hover:bg-gray-50"
            onClick={() => handleStartTrial("individual")}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Clock className="w-5 h-5 mr-2" />
            )}
            Start Your Free Trial Today
          </Button>
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
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                  alt="AutoSOAP AI Logo"
                  className="h-8 w-auto brightness-0 invert"
                />
                <span className="text-lg font-bold text-white">
                  AutoSOAP AI
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Eliminating documentation burnout for modern medical practices.
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
                  <button
                    onClick={handleWatchDemo}
                    className="hover:text-primary transition-colors text-left"
                  >
                    Demo
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            {/* Prominent Logo Section */}
            <div className="text-center mb-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                alt="AutoSOAP AI Logo"
                className="h-12 w-auto mx-auto brightness-0 invert"
              />
              <div className="text-2xl font-bold text-white mt-2">
                AutoSOAP AI
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Professional Medical Documentation
              </div>
            </div>
            <div className="text-center text-sm text-gray-400">
              <p>&copy; 2025&nbsp;AutoSOAP AI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
