import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { emailService } from "@/lib/email-service";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Stethoscope,
  LogIn,
  Rocket,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  Users,
  HeadphonesIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ContactFuturistic() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create mailto link that will actually send to your email
    const mailtoLink = `mailto:support@autosoapai.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}

---
Sent from AutoSOAP AI Contact Form
    `)}`;

    // Open default email client
    window.location.href = mailtoLink;

    // Show success message after short delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Ultra Dark Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out bg-black/90 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-500/10">
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
              <Button
                asChild
                variant="ghost"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300"
              >
                <Link to="/">Home</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300"
              >
                <Link to="/features">Features</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300"
              >
                <Link to="/pricing">Pricing</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300"
              >
                <Link to="/about">About</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 transition-all duration-300"
              >
                <Link to="/contact">Contact</Link>
              </Button>
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
      <section className="relative min-h-screen flex items-center justify-center z-10 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-500/20 to-gray-500/20 border border-blue-500/30 text-blue-300 px-4 py-2 mb-8">
              <MessageSquare className="w-4 h-4 mr-2" />
              Support & Communication
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Get in </span>
              <span className="bg-gradient-to-r from-blue-400 to-gray-300 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Ready to transform your medical documentation? Our support team is
              here to help you every step of the way.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Send className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Send Message
                    </h2>
                    <p className="text-gray-400">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Email Client Opened!
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Your default email client should have opened with your
                      message pre-filled. Send it to reach our support team.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                          placeholder="Dr. John Smith"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                          placeholder="doctor@clinic.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-300">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                        placeholder="Question about SOAP generation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-gray-800 hover:from-blue-700 hover:to-gray-900 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 ring-1 ring-blue-400/30 hover:ring-blue-300/50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Transmitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Methods */}
              <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-500/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                      <HeadphonesIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Support Channels
                      </h3>
                      <p className="text-gray-400">Multiple ways to reach us</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Email Support</p>
                        <p className="text-blue-400">support@autosoapai.com</p>
                        <p className="text-gray-400 text-sm">
                          24-48 hour response time
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-600/20 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Live Chat</p>
                        <p className="text-gray-500">Coming Soon</p>
                        <p className="text-gray-500 text-sm">
                          Currently in development
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Phone Support</p>
                        <p className="text-gray-300">
                          Available for Enterprise
                        </p>
                        <p className="text-gray-400 text-sm">
                          Dedicated account manager
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Features */}
              <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Support Promise
                      </h3>
                      <p className="text-gray-400">Our commitment to you</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">Fast response times</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">
                        Medical expertise on team
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">
                        HIPAA-compliant communication
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">
                        Free training & onboarding
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-gray-800 z-10 mt-20">
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
              <Link
                to="/"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                About
              </Link>
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
    </div>
  );
}
