import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, MapPin } from "lucide-react";

interface Clinic {
  id: number;
  name: string;
  specialty: string;
  location: string;
  logo: string;
  rating: number;
  providers: number;
  testimonial: string;
  established: string;
}

const clinics: Clinic[] = [
  {
    id: 1,
    name: "Metropolitan Emergency Center",
    specialty: "Emergency Medicine",
    location: "Los Angeles, CA",
    logo: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop&crop=center",
    rating: 4.9,
    providers: 12,
    testimonial:
      "AutoSOAP AI reduced our documentation time by 60% during peak hours.",
    established: "2018",
  },
  {
    id: 2,
    name: "Riverside Family Health",
    specialty: "Family Practice",
    location: "Austin, TX",
    logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center",
    rating: 4.8,
    providers: 8,
    testimonial: "The most intuitive medical AI tool we've ever used.",
    established: "2015",
  },
  {
    id: 3,
    name: "QuickCare Medical Group",
    specialty: "Urgent Care",
    location: "Miami, FL",
    logo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=100&h=100&fit=crop&crop=center",
    rating: 4.9,
    providers: 15,
    testimonial: "Exceptional accuracy in ICD-10 code suggestions.",
    established: "2020",
  },
  {
    id: 4,
    name: "Harbor Internal Medicine",
    specialty: "Internal Medicine",
    location: "Seattle, WA",
    logo: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=100&h=100&fit=crop&crop=center",
    rating: 4.7,
    providers: 6,
    testimonial: "Our productivity increased by 40% in the first month.",
    established: "2012",
  },
  {
    id: 5,
    name: "Children's Health Partners",
    specialty: "Pediatrics",
    location: "Chicago, IL",
    logo: "https://images.unsplash.com/photo-1559757174-f9b0db1cd4d4?w=100&h=100&fit=crop&crop=center",
    rating: 4.9,
    providers: 10,
    testimonial:
      "Perfect for pediatric documentation with age-appropriate language.",
    established: "2016",
  },
  {
    id: 6,
    name: "Elite Sports Medicine Center",
    specialty: "Sports Medicine",
    location: "Denver, CO",
    logo: "https://images.unsplash.com/photo-1551601651-ef46e1d1b58a?w=100&h=100&fit=crop&crop=center",
    rating: 4.8,
    providers: 7,
    testimonial: "Essential tool for our fast-paced sports medicine practice.",
    established: "2019",
  },
];

export function ClinicCarousel() {
  const [isPaused, setIsPaused] = useState(false);

  // Create duplicated array for infinite scroll effect
  const duplicatedClinics = [...clinics, ...clinics];

  // Add CSS keyframes to document head
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes infiniteScroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-${clinics.length * 336}px);
        }
      }

      @keyframes pulseIndicator {
        0%, 100% {
          opacity: 0.3;
        }
        50% {
          opacity: 1;
        }
      }

      .carousel-container {
        animation: infiniteScroll 45s linear infinite;
      }

      .carousel-container.paused {
        animation-play-state: paused;
      }

      .pulse-dot {
        animation: pulseIndicator 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const ClinicCard = ({ clinic }: { clinic: Clinic }) => (
    <div className="flex-shrink-0 w-80 mx-3">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white h-full">
        <CardContent className="p-6">
          {/* Clinic Header */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={clinic.logo}
              alt={`${clinic.name} logo`}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {clinic.name}
              </h3>
              <Badge
                variant="secondary"
                className="text-xs bg-primary/10 text-primary"
              >
                {clinic.specialty}
              </Badge>
            </div>
          </div>

          {/* Rating and Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">
                {clinic.rating}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{clinic.providers} providers</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{clinic.location}</span>
          </div>

          {/* Testimonial */}
          <blockquote className="text-gray-700 italic text-sm mb-4">
            "{clinic.testimonial}"
          </blockquote>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Est. {clinic.established}</span>
            <Badge variant="outline" className="text-xs">
              Verified Customer
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      <div
        className={`flex carousel-container ${isPaused ? "paused" : ""}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedClinics.map((clinic, index) => (
          <ClinicCard key={`${clinic.id}-${index}`} clinic={clinic} />
        ))}
      </div>

      {/* Subtle moving indicators */}
      <div className="flex justify-center mt-8">
        <div className="flex space-x-1">
          {clinics.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-primary/30 pulse-dot"
              style={{
                animationDelay: `${index * 0.3}s`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
