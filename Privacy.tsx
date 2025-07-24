import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Shield, Lock, Eye, Database } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
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
          <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your trust is paramount. Here's how we protect your data and
            privacy.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-12">
              <div className="prose prose-lg max-w-none">
                {/* Introduction */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <Eye className="w-6 h-6 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 m-0">
                      Introduction
                    </h2>
                  </div>
                  <p className="text-gray-700">
                    AutoSOAP AI ("we," "our," or "us") is committed to
                    protecting your privacy and the confidentiality of your
                    medical information. This Privacy Policy explains how we
                    collect, use, disclose, and safeguard your information when
                    you use our medical documentation platform.
                  </p>
                </div>

                {/* Information We Collect */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <Database className="w-6 h-6 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 m-0">
                      Information We Collect
                    </h2>
                  </div>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Account Information
                      </h3>
                      <p>
                        We collect information you provide when creating an
                        account, including your name, email address, and
                        professional credentials.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Voice Recordings & Audio Data
                      </h3>
                      <p>
                        <strong>Important:</strong> When you use our
                        voice-to-text feature, audio recordings are processed in
                        real-time and{" "}
                        <strong>
                          immediately destroyed after transcription is complete
                        </strong>
                        . We do not store, retain, or have access to your voice
                        recordings. Audio data is only used momentarily for
                        speech-to-text conversion and is permanently deleted
                        within seconds of processing.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Medical Documentation Data
                      </h3>
                      <p>
                        We process the medical information you input into our
                        platform to generate SOAP notes and medical
                        documentation. This may include patient information,
                        clinical observations, and treatment plans.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Usage Data
                      </h3>
                      <p>
                        We collect information about how you use our platform,
                        including features accessed, time spent, and system
                        performance data to improve our services.
                      </p>
                    </div>
                  </div>
                </div>

                {/* How We Use Information */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <Lock className="w-6 h-6 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 m-0">
                      How We Use Your Information
                    </h2>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      • Provide and maintain our medical documentation services
                    </li>
                    <li>
                      • Process and generate SOAP notes and medical
                      documentation
                    </li>
                    <li>
                      • Improve our AI algorithms and platform functionality
                    </li>
                    <li>• Provide customer support and respond to inquiries</li>
                    <li>
                      • Ensure platform security and prevent unauthorized access
                    </li>
                    <li>
                      • Comply with legal obligations and healthcare regulations
                    </li>
                  </ul>
                </div>

                {/* HIPAA Compliance */}
                <div className="mb-8 bg-primary/5 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    HIPAA Compliance
                  </h2>
                  <p className="text-gray-700">
                    AutoSOAP AI is designed to be HIPAA compliant. We implement
                    appropriate administrative, physical, and technical
                    safeguards to protect protected health information (PHI).
                    All medical data is encrypted in transit and at rest, and
                    access is strictly controlled on a need-to-know basis.
                  </p>
                </div>

                {/* Data Security */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Data Security
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Encryption:</strong> All data is encrypted using
                      industry-standard AES-256 encryption both in transit and
                      at rest.
                    </p>
                    <p>
                      <strong>Access Controls:</strong> We implement strict
                      access controls and authentication measures to ensure only
                      authorized personnel can access your data.
                    </p>
                    <p>
                      <strong>Regular Audits:</strong> Our security practices
                      are regularly audited and updated to meet the latest
                      healthcare security standards.
                    </p>
                    <p>
                      <strong>Secure Infrastructure:</strong> Our platform is
                      hosted on secure, HIPAA-compliant cloud infrastructure
                      with 24/7 monitoring.
                    </p>
                  </div>
                </div>

                {/* Data Sharing */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Data Sharing and Disclosure
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We do not sell, trade, or otherwise transfer your medical
                    information to third parties except in the following
                    circumstances:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• With your explicit consent</li>
                    <li>• To comply with legal obligations or court orders</li>
                    <li>
                      • To protect the rights, property, or safety of AutoSOAP
                      AI, our users, or others
                    </li>
                    <li>
                      • To our trusted service providers who assist in operating
                      our platform (under strict confidentiality agreements)
                    </li>
                  </ul>
                </div>

                {/* Data Retention */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Data Retention
                  </h2>
                  <p className="text-gray-700">
                    We retain your information only as long as necessary to
                    provide our services and comply with legal obligations. Upon
                    account deletion, we will securely delete your data within
                    30 days, except where retention is required by law.
                  </p>
                </div>

                {/* Your Rights */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Your Rights
                  </h2>
                  <p className="text-gray-700 mb-4">You have the right to:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Access and review your personal information</li>
                    <li>• Request corrections to inaccurate information</li>
                    <li>
                      • Request deletion of your account and associated data
                    </li>
                    <li>• Export your data in a portable format</li>
                    <li>
                      • Withdraw consent for data processing (where applicable)
                    </li>
                  </ul>
                </div>

                {/* Contact Information */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Contact Us
                  </h2>
                  <p className="text-gray-700">
                    If you have any questions about this Privacy Policy or our
                    data practices, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Email:</strong> support@autosoapai.com
                      <br />
                      <strong>Subject:</strong> Privacy Policy Inquiry
                    </p>
                  </div>
                </div>

                {/* Changes to Policy */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Changes to This Policy
                  </h2>
                  <p className="text-gray-700">
                    We may update this Privacy Policy from time to time. We will
                    notify you of any material changes by posting the new
                    Privacy Policy on this page and updating the "Last updated"
                    date. Your continued use of our services after any changes
                    constitutes acceptance of the updated policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
