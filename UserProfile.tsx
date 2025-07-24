import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  Shield,
  X,
  UserCheck,
  Building,
  Stethoscope,
  LogOut,
} from "lucide-react";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: any;
  planDisplayName: string;
  isInTrial: boolean;
  daysUntilExpiry: number | null;
}

export default function UserProfile({
  isOpen,
  onClose,
  onLogout,
  user,
  planDisplayName,
  isInTrial,
  daysUntilExpiry,
}: UserProfileProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Mock user credentials - in real app this would come from user profile
  const userCredentials = {
    name: user?.displayName || "Dr. Mosisa Saba",
    email: user?.email || "support@autosoapai.com",
    license: "MD123456",
    npi: "1234567890",
    specialty: "Internal Medicine",
    joinedDate: "2024-01-15",
    role: "Admin",
    organization: "AutoSOAP Medical Practice",
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <UserCheck className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">User Profile</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log("❌ Close button clicked");
              onClose();
            }}
            className="hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Full Name</p>
                <p className="font-semibold">{userCredentials.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">
                  Email Address
                </p>
                <p className="text-sm text-gray-900">{userCredentials.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Role</p>
                <Badge className="bg-primary/10 text-primary">
                  <Shield className="w-3 h-3 mr-1" />
                  {userCredentials.role}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Medical Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Stethoscope className="w-5 h-5 mr-2" />
                Medical Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Medical License
                </p>
                <p className="font-semibold">{userCredentials.license}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">NPI Number</p>
                <p className="font-semibold">{userCredentials.npi}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Specialty</p>
                <p className="font-semibold">{userCredentials.specialty}</p>
              </div>
            </CardContent>
          </Card>

          {/* Organization & Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Building className="w-5 h-5 mr-2" />
                Organization & Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Organization
                </p>
                <p className="font-semibold">{userCredentials.organization}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">
                  Current Plan
                </p>
                <div className="flex items-center space-x-2">
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
                      <span className="ml-1">
                        ({daysUntilExpiry} days left)
                      </span>
                    )}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">
                  Member Since
                </p>
                <p className="font-semibold">
                  {new Date(userCredentials.joinedDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                console.log("📝 Close Profile button clicked");
                onClose();
              }}
              className="flex-1"
            >
              Close Profile
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log("🚪 Exit button clicked");
                onLogout();
              }}
              className="flex-1 flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
