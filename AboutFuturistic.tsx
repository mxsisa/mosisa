import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Heart, Users, Target, LogIn, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutFuturistic() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <Link
                to="/"
                className="text-sm font-medium transition-colors duration-300 hover:text-blue-400 text-gray-300"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="text-sm font-medium transition-colors duration-300 hover:text-blue-400 text-gray-300"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-sm font-medium transition-colors duration-300 hover:text-blue-400 text-gray-300"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium transition-colors duration-300 hover:text-blue-400 text-blue-400"
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
      <section className="relative py-20 z-10 pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-gradient-to-r from-blue-500/20 to-gray-500/20 border border-blue-500/30 text-blue-300 px-4 py-2 mb-8">
            <Heart className="w-4 h-4 mr-2" />
            Our Mission
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
              AutoSOAP AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Born from a deep love for medicine and a vision to give time back to
            healthcare providers
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="relative py-20 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-blue-500/20 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Our Story
                </h2>
              </div>

              <div className="prose prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
                <p>
                  My name is Mosisa Saba & I created AutoSOAP AI out of a deep
                  love for medicine and a growing fascination with how
                  artificial intelligence is reshaping the world. Throughout my
                  academic journey in biology and public health, I became
                  increasingly aware of the burden that clinical documentation
                  places on providers — especially in small practices.
                </p>

                <p>
                  I saw physicians spending hours after clinic just trying to
                  catch up on notes, often at the expense of their personal
                  lives and the quality of care they could provide. That never
                  sat right with me.
                </p>

                <p>
                  At the same time, I was watching AI being integrated into
                  countless industries, whether that be finance, design,
                  logistics — yet healthcare, the field that matters most to me,
                  was being left behind in terms of accessible, practical tools
                  for everyday clinicians.
                </p>

                <p>
                  AutoSOAP AI was my answer to that gap. I set out to build a
                  tool that isn't just innovative, but actually useful — a
                  product that brings clarity, speed, and ease to one of the
                  most frustrating parts of clinical work.
                </p>

                <p className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                  My mission is simple: give time back to providers, so they can
                  give more of themselves to their patients.
                </p>

                <div className="mt-8 p-6 bg-gradient-to-br from-blue-500/10 to-gray-500/10 rounded-xl border border-blue-500/20">
                  <h3 className="text-xl font-bold text-white mb-4">
                    What is AutoSOAP AI?
                  </h3>
                  <p className="text-gray-300">
                    AutoSOAP AI is a web-based tool that turns clinical speech
                    into clean, structured SOAP notes — instantly. Using
                    advanced natural language processing through GPT-4, our
                    platform captures voice or typed input from providers and
                    transforms it into a fully formatted medical note, complete
                    with ICD-10 diagnostic suggestions. There's no software to
                    install, no steep learning curve, and no integration
                    required. It's fast, accurate, and built specifically for
                    the realities of solo physicians and small clinics. Whether
                    you're documenting a straightforward urgent care visit or
                    managing a complex case, AutoSOAP makes the process
                    seamless, freeing up your time for what actually matters:
                    your patients.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="relative py-20 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Mission & Values
            </h2>
            <p className="text-xl text-gray-300">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Purpose-Driven
                </h3>
                <p className="text-gray-300">
                  Every feature we build serves one goal: reducing the
                  administrative burden on healthcare providers so they can
                  focus on what matters most — patient care.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-500/20 backdrop-blur-sm hover:border-gray-400/40 transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Clinician-First
                </h3>
                <p className="text-gray-300">
                  Built by someone who understands healthcare challenges, for
                  the providers who face them every day. Simple, practical, and
                  effective.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-500 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Quality Care
                </h3>
                <p className="text-gray-300">
                  We believe that by eliminating documentation burnout, we can
                  help providers deliver better, more compassionate care to
                  their patients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 z-10 bg-gradient-to-r from-blue-600/10 to-gray-600/10 border-y border-blue-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Ready to Reclaim Your Time?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of providers who are already saving hours each week
            with AutoSOAP AI.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-gray-800 hover:from-blue-700 hover:to-gray-900 text-white px-8 py-3 text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-500 ring-1 ring-blue-400/30 hover:ring-blue-300/50"
            asChild
          >
            <Link to="/">
              <Rocket className="w-5 h-5 mr-2" />
              Start Your Free Trial
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-gray-800 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                  alt="AutoSOAP AI Logo"
                  className="h-8 w-auto"
                />
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
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
                    className="hover:text-blue-400 transition-colors text-gray-400"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-blue-400 transition-colors text-gray-400"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors text-gray-400"
                  >
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
                    className="hover:text-blue-400 transition-colors text-gray-400"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-blue-400 transition-colors text-gray-400"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-blue-400 transition-colors text-gray-400"
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
                    className="hover:text-blue-400 transition-colors text-gray-400"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-blue-400 transition-colors text-gray-400"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors text-gray-400"
                  >
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
