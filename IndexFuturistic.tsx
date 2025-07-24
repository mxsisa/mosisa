import React, { useState, useEffect, useRef } from "react";
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
  Loader2,
  LogIn,
  Zap,
  Cpu,
  Brain,
  Sparkles,
  ArrowRight,
  Star,
  Play,
  Bot,
  Rocket,
  Globe,
  Database,
  X,
} from "lucide-react";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import GetQuoteForm from "@/components/GetQuoteForm";

export default function Index() {
  const { currentUser } = useAuth();
  const { startCheckout, loading } = useStripeCheckout();
  const [scrollY, setScrollY] = useState(0);
  const [headerStyle, setHeaderStyle] = useState("transparent");
  const [activeSection, setActiveSection] = useState("hero");
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Intersection Observer for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Update header style based on scroll position
      if (currentScrollY > 100) {
        setHeaderStyle("solid");
      } else {
        setHeaderStyle("transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveSection(sectionId);
    }
  };

  const handleStartTrial = (plan: "individual" | "clinic") => {
    // Always redirect to signup, regardless of auth status
    localStorage.setItem("pendingPlan", plan);
    if (!currentUser) {
      window.location.href = `/signup?plan=${plan}`;
    } else {
      // If already logged in, redirect directly to Stripe
      const stripeLinks = {
        individual: "https://buy.stripe.com/bJe28t63i1bsfv0gzR5os01",
        clinic: "https://buy.stripe.com/cNi00lgHW7zQ5Uqabt5os00",
      };
      window.open(stripeLinks[plan], "_blank");
    }
  };

  const handleWatchDemo = () => {
    setShowDemo(true);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Ultra Dark Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black"></div>
      </div>

      {/* Sticky Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          headerStyle === "solid"
            ? "bg-black/90 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-500/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                alt="AutoSOAP AI Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                AutoSOAP AI
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("hero")}
                className={`text-sm font-medium transition-colors duration-300 hover:text-blue-400 ${
                  activeSection === "hero" ? "text-blue-400" : "text-gray-300"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className={`text-sm font-medium transition-colors duration-300 hover:text-blue-400 ${
                  activeSection === "features"
                    ? "text-blue-400"
                    : "text-gray-300"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className={`text-sm font-medium transition-colors duration-300 hover:text-blue-400 ${
                  activeSection === "pricing"
                    ? "text-blue-400"
                    : "text-gray-300"
                }`}
              >
                Pricing
              </button>
              <Link
                to="/about"
                className="text-sm font-medium transition-colors duration-300 hover:text-blue-400 text-gray-300"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium transition-colors duration-300 hover:text-blue-400 text-gray-300"
              >
                Contact
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                asChild
                variant="ghost"
                className="text-gray-300 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-300"
              >
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-gray-800 hover:from-blue-700 hover:to-gray-900 text-white shadow-lg shadow-blue-500/25 transition-all duration-300"
              >
                <Link to="/signup">
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Hero Badge */}
            <Badge className="bg-gradient-to-r from-blue-500/20 to-gray-500/20 border border-blue-500/30 text-blue-300 px-4 py-2 transition-all duration-500">
              <Sparkles className="w-4 h-4 mr-2" />
              Next-Gen Medical AI
            </Badge>

            {/* Hero Title */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="block bg-gradient-to-r from-blue-400 via-gray-300 to-white bg-clip-text text-transparent">
                Eliminate Documentation Burnout
              </span>
              <span className="block text-white">for Physicians</span>
            </h1>

            {/* Hero Description */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Generate professional SOAP notes instantly using advanced AI.
              Voice-to-text, ICD-10 coding, and intelligent documentation for
              the future of healthcare.
            </p>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                onClick={() => handleStartTrial("individual")}
                className="bg-gradient-to-r from-blue-600 to-gray-800 hover:from-blue-700 hover:to-gray-900 text-white px-8 py-4 text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-500 ring-1 ring-blue-400/30 hover:ring-blue-300/50"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleWatchDemo}
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 px-8 py-4 text-lg transition-all duration-300 ring-1 ring-blue-400/30 hover:ring-blue-300/50"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-12 flex flex-wrap justify-center items-center gap-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-gray-400" />
                <span>Real-time Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-white" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-transparent rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-500/20 to-gray-500/20 border border-blue-500/30 text-blue-300 px-4 py-2 mb-8">
              <Cpu className="w-4 h-4 mr-2" />
              Advanced Capabilities
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-gray-300 bg-clip-text text-transparent">
                Quantum Leap
              </span>
              <span className="text-white"> in Medical AI</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of medical documentation with our
              cutting-edge AI technology
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Voice AI Feature */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-500 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-gray-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Mic className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Neural Voice Processing
                </h3>
                <p className="text-gray-300 mb-6">
                  Advanced speech recognition optimized for medical terminology
                  with quantum-level accuracy
                </p>
                <ul className="space-y-2 text-sm text-blue-300">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Medical voice recognition
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Real-time transcription
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Voice recordings destroyed immediately
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Generation Feature */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-500/20 backdrop-blur-sm hover:border-gray-400/40 transition-all duration-500 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-700/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Brain className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Quantum SOAP Engine
                </h3>
                <p className="text-gray-300 mb-6">
                  AI-powered documentation that understands medical context and
                  generates professional notes
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Instant SOAP generation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    ICD-10 auto-coding
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Medical intelligence
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Security Feature */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-500 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-gray-300/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Cyber Security Matrix
                </h3>
                <p className="text-gray-300 mb-6">
                  Military-grade encryption and HIPAA compliance for maximum
                  data protection
                </p>
                <ul className="space-y-2 text-sm text-white">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    HIPAA compliant
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Zero data retention
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-500/20 to-gray-500/20 border border-blue-500/30 text-blue-300 px-4 py-2 mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Quantum Pricing
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Choose Your </span>
              <span className="bg-gradient-to-r from-blue-400 to-gray-300 bg-clip-text text-transparent">
                Power Level
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Scale from individual practitioner to galactic medical empire
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Individual Plan */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-gray-600/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Stethoscope className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Solo Practitioner
                </h3>
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  $99<span className="text-lg text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 mb-8">
                  Perfect for individual physicians
                </p>

                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                    Unlimited SOAP generation
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                    Neural voice processing
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                    ICD-10 auto-coding
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                    Quantum security
                  </li>
                </ul>

                <Button
                  onClick={() => handleStartTrial("individual")}
                  className="w-full bg-gradient-to-r from-blue-600 to-gray-800 hover:from-blue-700 hover:to-gray-900 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 ring-1 ring-blue-400/30 hover:ring-blue-300/50"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Trial
                </Button>
              </CardContent>
            </Card>

            {/* Clinic Plan */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-500/30 backdrop-blur-sm hover:border-gray-400/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-gray-500/20 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 py-2">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-700/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Clinic Squadron
                </h3>
                <div className="text-4xl font-bold text-gray-400 mb-2">
                  $399<span className="text-lg text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 mb-8">
                  Up to 5 medical practitioners
                </p>

                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-gray-400 mr-3" />
                    Everything in Solo
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-gray-400 mr-3" />
                    Team command center
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-gray-400 mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-gray-400 mr-3" />
                    Priority support
                  </li>
                </ul>

                <Button
                  onClick={() => handleStartTrial("clinic")}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white shadow-lg shadow-gray-500/25 transition-all duration-300 ring-1 ring-gray-400/30 hover:ring-gray-300/50"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Squadron
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-gray-300/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Medical Enterprise
                </h3>
                <div className="text-4xl font-bold text-white mb-2">Custom</div>
                <p className="text-gray-400 mb-8">Unlimited practitioners</p>

                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-white mr-3" />
                    Galactic scale
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-white mr-3" />
                    Custom integrations
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-white mr-3" />
                    Dedicated support
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-white mr-3" />
                    White-label options
                  </li>
                </ul>

                <Button
                  onClick={() => setIsQuoteFormOpen(true)}
                  className="w-full bg-gradient-to-r from-white to-gray-300 hover:from-gray-200 hover:to-gray-400 text-black shadow-lg shadow-white/25 transition-all duration-300 ring-1 ring-white/40 hover:ring-white/60"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Get a Quote
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Continuous AI Output Carousel */}
      <section className="relative py-20 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-500/20 to-gray-500/20 border border-blue-500/30 text-blue-300 px-4 py-2 mb-8">
              <FileText className="w-4 h-4 mr-2" />
              AI-Generated Outputs
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">See What Our </span>
              <span className="bg-gradient-to-r from-blue-400 to-gray-300 bg-clip-text text-transparent">
                AI Creates
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From voice recordings to comprehensive medical documentation
            </p>
          </div>

          {/* Continuous Scrolling Carousel */}
          <div className="relative">
            <div className="overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/50 border border-blue-500/20 rounded-xl">
              <div className="carousel-scroll flex animate-scroll">
                {/* First set of cards */}
                <div className="carousel-item flex-shrink-0 w-96 p-6 m-4">
                  <div className="bg-black/30 rounded-lg p-6 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          SOAP Note
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Complete documentation
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm font-mono space-y-2">
                      <div>
                        <span className="text-blue-400">S:</span> Patient
                        reports chest pain...
                      </div>
                      <div>
                        <span className="text-blue-400">O:</span> Vital signs
                        stable, BP 120/80...
                      </div>
                      <div>
                        <span className="text-blue-400">A:</span> Likely
                        musculoskeletal...
                      </div>
                      <div>
                        <span className="text-blue-400">P:</span> NSAIDs,
                        follow-up in 1 week...
                      </div>
                    </div>
                  </div>
                </div>

                <div className="carousel-item flex-shrink-0 w-96 p-6 m-4">
                  <div className="bg-black/30 rounded-lg p-6 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                        <Database className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          ICD-10 Code
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Automated coding
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                        <div className="font-mono text-blue-400 font-bold">
                          M79.3
                        </div>
                        <div className="text-gray-300 text-sm">
                          Panniculitis, unspecified
                        </div>
                        <div className="text-gray-400 text-xs">
                          Confidence: 92%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="carousel-item flex-shrink-0 w-96 p-6 m-4">
                  <div className="bg-black/30 rounded-lg p-6 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Clinical Summary
                        </h3>
                        <p className="text-gray-400 text-sm">AI insights</p>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <div>
                        <strong>Assessment:</strong> Low-risk presentation
                      </div>
                      <div>
                        <strong>Recommendations:</strong> Conservative
                        management
                      </div>
                      <div>
                        <strong>Follow-up:</strong> PRN or 1 week
                      </div>
                    </div>
                  </div>
                </div>

                <div className="carousel-item flex-shrink-0 w-96 p-6 m-4">
                  <div className="bg-black/30 rounded-lg p-6 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Mic className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Voice Transcript
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Real-time conversion
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm italic">
                      "Patient presents with a three-day history of lower back
                      pain following lifting heavy objects at work. Pain is
                      localized to the lumbar region..."
                    </div>
                  </div>
                </div>

                <div className="carousel-item flex-shrink-0 w-96 p-6 m-4">
                  <div className="bg-black/30 rounded-lg p-6 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Quality Check
                        </h3>
                        <p className="text-gray-400 text-sm">AI validation</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-green-400 text-sm">
                        <CheckCircle className="w-3 h-3 mr-2" />
                        All required fields completed
                      </div>
                      <div className="flex items-center text-green-400 text-sm">
                        <CheckCircle className="w-3 h-3 mr-2" />
                        ICD-10 codes validated
                      </div>
                      <div className="flex items-center text-green-400 text-sm">
                        <CheckCircle className="w-3 h-3 mr-2" />
                        Ready for submission
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="carousel-item flex-shrink-0 w-96 p-6 m-4">
                  <div className="bg-black/30 rounded-lg p-6 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          SOAP Note
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Complete documentation
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm font-mono space-y-2">
                      <div>
                        <span className="text-blue-400">S:</span> Patient
                        reports chest pain...
                      </div>
                      <div>
                        <span className="text-blue-400">O:</span> Vital signs
                        stable, BP 120/80...
                      </div>
                      <div>
                        <span className="text-blue-400">A:</span> Likely
                        musculoskeletal...
                      </div>
                      <div>
                        <span className="text-blue-400">P:</span> NSAIDs,
                        follow-up in 1 week...
                      </div>
                    </div>
                  </div>
                </div>

                <div className="carousel-item flex-shrink-0 w-96 p-6 m-4">
                  <div className="bg-black/30 rounded-lg p-6 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                        <Database className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          ICD-10 Code
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Automated coding
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                        <div className="font-mono text-blue-400 font-bold">
                          M79.3
                        </div>
                        <div className="text-gray-300 text-sm">
                          Panniculitis, unspecified
                        </div>
                        <div className="text-gray-400 text-xs">
                          Confidence: 92%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="carousel-item flex-shrink-0 w-96 p-6 m-4">
                  <div className="bg-black/30 rounded-lg p-6 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Clinical Summary
                        </h3>
                        <p className="text-gray-400 text-sm">AI insights</p>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm space-y-2">
                      <div>
                        <strong>Assessment:</strong> Low-risk presentation
                      </div>
                      <div>
                        <strong>Recommendations:</strong> Conservative
                        management
                      </div>
                      <div>
                        <strong>Follow-up:</strong> PRN or 1 week
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About/CTA Section */}
      <section id="about" ref={aboutRef} className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <Badge className="bg-gradient-to-r from-blue-500/20 to-gray-500/20 border border-blue-500/30 text-blue-300 px-4 py-2">
              <Bot className="w-4 h-4 mr-2" />
              The Future is Now
            </Badge>

            <h2 className="text-4xl md:text-6xl font-bold">
              <span className="text-white">Ready to </span>
              <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                Transcend
              </span>
              <span className="text-white"> Medical Documentation?</span>
            </h2>

            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Join thousands of medical professionals who have already stepped
              into the future of healthcare documentation. Experience the
              quantum leap in efficiency and accuracy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                onClick={() => handleStartTrial("individual")}
                className="bg-gradient-to-r from-blue-600 to-gray-800 hover:from-blue-700 hover:to-gray-900 text-white px-12 py-4 text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-500 ring-1 ring-blue-400/30 hover:ring-blue-300/50"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Begin Your Journey
              </Button>
            </div>

            <p className="text-sm text-gray-400 mt-8">
              7-day free trial • No credit card required • HIPAA compliant
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-gray-800 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                alt="AutoSOAP AI Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                AutoSOAP AI
              </span>
            </div>

            <div className="flex space-x-6 text-gray-400">
              <button
                onClick={() => scrollToSection("hero")}
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Home
              </button>
              <Link
                to="/privacy"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Terms
              </Link>
            </div>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400">
              © 2025 AutoSOAP AI. All rights reserved. Transforming healthcare
              documentation across the galaxy.
            </p>
          </div>
        </div>
      </footer>

      {/* Interactive Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
          <div className="h-full flex flex-col">
            {/* Demo Header */}
            <div className="flex justify-between items-center p-6 border-b border-blue-500/20">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  AutoSOAP AI Process Demo
                </h2>
                <p className="text-gray-400">Step-by-step walkthrough</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowDemo(false);
                  setCurrentStep(0);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Demo Content */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-4xl">
                {/* Step Indicator */}
                <div className="flex justify-center mb-8">
                  {[0, 1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          currentStep >= step
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-600 text-gray-600"
                        }`}
                      >
                        {step + 1}
                      </div>
                      {step < 3 && (
                        <div
                          className={`w-16 h-0.5 transition-all duration-300 ${
                            currentStep > step ? "bg-blue-600" : "bg-gray-600"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-blue-500/20 min-h-[400px]">
                  <CardContent className="p-8">
                    {currentStep === 0 && (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Mic className="w-10 h-10 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                          Step 1: Voice Recording
                        </h3>
                        <p className="text-gray-300 mb-6 text-lg">
                          Simply speak naturally about your patient encounter.
                          Our AI understands medical terminology and context.
                        </p>
                        <div className="bg-black/30 rounded-lg p-6 text-left">
                          <div className="text-blue-400 mb-2 font-bold">
                            🎤 Example Recording:
                          </div>
                          <p className="text-gray-300 italic">
                            "Patient is a 45-year-old male presenting with chest
                            pain that started this morning. Pain is described as
                            sharp, located in the left chest, worsens with deep
                            breathing. No shortness of breath, no nausea. Vital
                            signs are stable..."
                          </p>
                        </div>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Brain className="w-10 h-10 text-gray-400 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                          Step 2: AI Processing
                        </h3>
                        <p className="text-gray-300 mb-6 text-lg">
                          Our advanced AI analyzes your speech, extracting
                          medical information and organizing it into proper
                          categories.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <div className="text-blue-400 font-bold mb-2">
                              🧠 AI Analysis
                            </div>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li>✓ Speech-to-text conversion</li>
                              <li>✓ Medical terminology recognition</li>
                              <li>✓ Context understanding</li>
                              <li>✓ Information categorization</li>
                            </ul>
                          </div>
                          <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-4">
                            <div className="text-gray-400 font-bold mb-2">
                              ⚡ Processing Speed
                            </div>
                            <div className="text-gray-300 text-sm space-y-1">
                              <div>Average: 3-5 seconds</div>
                              <div>Accuracy: 95%+</div>
                              <div>Medical vocabulary: 50,000+ terms</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FileText className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                          Step 3: SOAP Generation
                        </h3>
                        <p className="text-gray-300 mb-6 text-lg">
                          Professional SOAP note automatically generated with
                          proper medical formatting and ICD-10 suggestions.
                        </p>
                        <div className="bg-black/30 rounded-lg p-6 text-left text-sm">
                          <div className="space-y-3">
                            <div>
                              <span className="text-blue-400 font-bold">
                                SUBJECTIVE:
                              </span>
                              <p className="text-gray-300 mt-1">
                                45-year-old male presents with acute onset chest
                                pain...
                              </p>
                            </div>
                            <div>
                              <span className="text-blue-400 font-bold">
                                OBJECTIVE:
                              </span>
                              <p className="text-gray-300 mt-1">
                                Vital signs stable. Physical exam reveals...
                              </p>
                            </div>
                            <div>
                              <span className="text-blue-400 font-bold">
                                ASSESSMENT:
                              </span>
                              <p className="text-gray-300 mt-1">
                                Likely pleuritic chest pain, rule out...
                              </p>
                            </div>
                            <div>
                              <span className="text-blue-400 font-bold">
                                PLAN:
                              </span>
                              <p className="text-gray-300 mt-1">
                                ECG, chest X-ray, follow-up...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                          Step 4: Ready to Use
                        </h3>
                        <p className="text-gray-300 mb-6 text-lg">
                          Your professional SOAP note is ready! Copy to your
                          EMR, make edits, or export as needed.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <Database className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                            <div className="text-white font-semibold">
                              ICD-10 Codes
                            </div>
                            <div className="text-gray-400 text-sm">
                              Auto-suggested
                            </div>
                          </div>
                          <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-4">
                            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <div className="text-white font-semibold">
                              Export Options
                            </div>
                            <div className="text-gray-400 text-sm">
                              PDF, Word, Copy
                            </div>
                          </div>
                          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                            <Shield className="w-8 h-8 text-white mx-auto mb-2" />
                            <div className="text-white font-semibold">
                              HIPAA Secure
                            </div>
                            <div className="text-gray-400 text-sm">
                              Data protected
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setShowDemo(false);
                            setCurrentStep(0);
                          }}
                          className="mt-6 bg-gradient-to-r from-blue-600 to-gray-800 hover:from-blue-700 hover:to-gray-900 text-white px-8 py-3"
                        >
                          Start Your Free Trial
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-6">
                  <Button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    Previous
                  </Button>

                  <div className="text-gray-400 text-sm">
                    Step {currentStep + 1} of 4
                  </div>

                  <Button
                    onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                    disabled={currentStep === 3}
                    className="bg-gradient-to-r from-blue-600 to-gray-800 hover:from-blue-700 hover:to-gray-900 text-white"
                  >
                    {currentStep === 3 ? "Done" : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Form Modal */}
      <GetQuoteForm
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
      />
    </div>
  );
}
