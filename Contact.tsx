import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

    // Create mailto link
    const mailtoLink = `mailto:support@autosoapai.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
    `)}`;

    // Open default email client
    window.location.href = mailtoLink;

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
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
                <Link to="/">Home</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/login">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact <span className="text-primary">& Support</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're here to help you get the most out of AutoSOAP AI
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-3 text-primary" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <Send className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Your default email client should have opened with your
                        message. We'll get back to you as soon as possible.
                      </p>
                      <Button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            subject: "",
                            message: "",
                          });
                        }}
                        variant="outline"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                            placeholder="Dr. Jane Smith"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                            placeholder="jane@clinic.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="mt-1 min-h-32"
                          placeholder="Please describe your question or issue in detail..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Send className="w-4 h-4 mr-2 animate-pulse" />
                            Sending...
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
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Get in Touch
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Email Support
                        </h4>
                        <p className="text-gray-600 text-sm">
                          support@autosoapai.com
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          We typically respond within 24 hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Phone Support
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Available for Enterprise customers
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Monday - Friday, 9 AM - 5 PM EST
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        How does the free trial work?
                      </h4>
                      <p className="text-gray-600 text-sm">
                        7 days of full access, no credit card required. Cancel
                        anytime.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Is my patient data secure?
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Yes, we're HIPAA compliant with enterprise-grade
                        security.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Can I integrate with my EMR?
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Yes, we support exports to all major EMR systems.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
                  <Link to="/" className="hover:text-primary transition-colors">
                    Demo
                  </Link>
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 AutoSOAP AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
