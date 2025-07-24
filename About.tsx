import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Heart, Users, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
            About <span className="text-primary">AutoSOAP AI</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Born from a deep love for medicine and a vision to give time back to
            healthcare providers
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Story
                </h2>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
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

                <p className="text-xl font-semibold text-primary">
                  My mission is simple: give time back to providers, so they can
                  give more of themselves to their patients.
                </p>

                <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    What is AutoSOAP AI?
                  </h3>
                  <p>
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
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission & Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Purpose-Driven
                </h3>
                <p className="text-gray-600">
                  Every feature we build serves one goal: reducing the
                  administrative burden on healthcare providers so they can
                  focus on what matters most — patient care.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Clinician-First
                </h3>
                <p className="text-gray-600">
                  Built by someone who understands healthcare challenges, for
                  the providers who face them every day. Simple, practical, and
                  effective.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quality Care
                </h3>
                <p className="text-gray-600">
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
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Reclaim Your Time?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of providers who are already saving hours each week
            with AutoSOAP AI.
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
            asChild
          >
            <Link to="/">Start Your Free Trial</Link>
          </Button>
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
