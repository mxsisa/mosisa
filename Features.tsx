import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Shield,
  FileText,
  Mic,
  Stethoscope,
  Users,
  Star,
  Quote,
  CheckCircle,
  ArrowRight,
  Zap,
  Brain,
  Globe,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Features() {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Lightning Fast Generation",
      description:
        "Generate complete SOAP notes in under 30 seconds. Our AI processes your input instantly and delivers structured, professional documentation.",
      benefits: [
        "30-second generation time",
        "Real-time processing",
        "Instant ICD-10 suggestions",
        "No waiting queues",
      ],
    },
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "GPT-4 Powered Intelligence",
      description:
        "Built on the latest GPT-4 technology, specifically trained on medical terminology and documentation standards.",
      benefits: [
        "Medical terminology accuracy",
        "Clinical context understanding",
        "Evidence-based suggestions",
        "Continuous learning",
      ],
    },
    {
      icon: <Mic className="w-8 h-8 text-primary" />,
      title: "Voice & Text Input",
      description:
        "Dictate naturally or type your notes. Our advanced speech recognition understands medical terminology and converts speech to text accurately.",
      benefits: [
        "Medical voice recognition",
        "Natural language processing",
        "Flexible input methods",
        "Multi-language support",
        "Voice recordings destroyed immediately",
      ],
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Structured SOAP Format",
      description:
        "Automatically organizes your input into proper SOAP format with Subjective, Objective, Assessment, and Plan sections.",
      benefits: [
        "Professional formatting",
        "Consistent structure",
        "Industry standards",
        "Export ready",
      ],
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "ICD-10 Code Integration",
      description:
        "Intelligent diagnostic code suggestions based on your assessment, ensuring accurate billing and compliance.",
      benefits: [
        "Automatic code suggestions",
        "Billing accuracy",
        "Compliance support",
        "Regular updates",
      ],
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Browser-Based Access",
      description:
        "No downloads or installations required. Access your documentation tool from any device with an internet connection.",
      benefits: [
        "Cross-device compatibility",
        "No IT requirements",
        "Instant access",
        "Cloud-based reliability",
      ],
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Team Collaboration",
      description:
        "Clinic plans support multiple providers with shared templates and standardized documentation practices.",
      benefits: [
        "Multi-user support",
        "Shared templates",
        "Team management",
        "Unified workflows",
      ],
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Privacy & Security",
      description:
        "Enterprise-grade security with HIPAA-compliant infrastructure to protect patient information.",
      benefits: [
        "HIPAA compliance",
        "End-to-end encryption",
        "Secure data handling",
        "Regular audits",
      ],
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Smart Templates",
      description:
        "AI learns from your documentation patterns to suggest personalized templates and improve efficiency over time.",
      benefits: [
        "Personalized suggestions",
        "Learning algorithms",
        "Template optimization",
        "Workflow improvement",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Emergency Medicine Physician",
      clinic: "Metropolitan Emergency Center",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
      content:
        "AutoSOAP AI has completely transformed my documentation process. What used to take 15-20 minutes per patient now takes just 2-3 minutes. The AI understands medical terminology perfectly and generates notes that are more comprehensive than I could write manually.",
      rating: 5,
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Family Practice Physician",
      clinic: "Riverside Family Health",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
      content:
        "The voice recognition is incredibly accurate for medical terms. I can dictate my findings while examining patients, and the AI structures everything perfectly. It's like having a medical scribe that never makes mistakes.",
      rating: 5,
    },
    {
      name: "Dr. Jennifer Park",
      role: "Urgent Care Director",
      clinic: "QuickCare Medical Group",
      image:
        "https://images.unsplash.com/photo-1594824862107-ed2f8e1c1f8c?w=100&h=100&fit=crop&crop=face",
      content:
        "Our clinic productivity has increased by 40% since implementing AutoSOAP AI. The ICD-10 code suggestions are spot-on, and our billing accuracy has improved significantly. Best investment we've made in years.",
      rating: 5,
    },
    {
      name: "Dr. David Kim",
      role: "Internal Medicine Specialist",
      clinic: "Harbor Internal Medicine",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
      content:
        "As someone who sees 30+ patients daily, AutoSOAP AI has been a game-changer. The documentation is thorough, professional, and takes a fraction of the time. My patients appreciate that I can focus more on them instead of typing.",
      rating: 5,
    },
    {
      name: "Dr. Lisa Thompson",
      role: "Pediatrician",
      clinic: "Children's Health Partners",
      image:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop&crop=face",
      content:
        "The AI adapts beautifully to pediatric documentation. It understands age-appropriate language and generates notes that capture the nuances of pediatric care. My documentation has never been more accurate or efficient.",
      rating: 5,
    },
    {
      name: "Dr. Robert Washington",
      role: "Sports Medicine Physician",
      clinic: "Elite Sports Medicine Center",
      image:
        "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=face",
      content:
        "Perfect for our fast-paced sports medicine practice. The AI quickly generates detailed injury assessments and treatment plans. Our athletes get back to training faster because we spend less time on paperwork and more time on treatment.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Navigation */}
      <nav className="border-b border-teal-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                alt="AutoSOAP AI Logo"
                className="h-8 w-auto"
              />
            </Link>

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
              >
                Features
              </Button>
              {currentUser ? (
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/app">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Open App
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-primary"
                    asChild
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90" asChild>
                    <Link to="/pricing">Start Free Trial</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Powered by GPT-4
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Advanced Features for
            <span className="text-primary"> Modern Medicine</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover how AutoSOAP AI transforms medical documentation with
            cutting-edge AI technology, designed specifically for healthcare
            professionals.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/pricing">
              <Clock className="w-5 h-5 mr-2" />
              Start Your Free Trial
            </Link>
          </Button>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Efficient Documentation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AutoSOAP AI combines advanced artificial intelligence with deep
              medical knowledge to deliver the most comprehensive documentation
              solution available.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what doctors are saying about AutoSOAP AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-primary/20 mr-2" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>

                  <blockquote className="text-gray-700 mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>

                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-primary">
                        {testimonial.clinic}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of healthcare professionals who have revolutionized
            their documentation workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-50"
              asChild
            >
              <Link to="/pricing">
                <Clock className="w-5 h-5 mr-2" />
                Start Free Trial
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/">
                <ArrowRight className="w-5 h-5 mr-2" />
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                  alt="AutoSOAP AI Logo"
                  className="h-8 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 text-sm">
                Transforming medical documentation with AI.
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
                  <a href="#" className="hover:text-primary transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
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
            <p>&copy; 2025&nbsp;AutoSOAP AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
