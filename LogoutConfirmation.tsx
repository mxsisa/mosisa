import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, X, AlertTriangle } from "lucide-react";

interface LogoutConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmation({
  isOpen,
  onConfirm,
  onCancel,
}: LogoutConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold">Confirm Logout</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to log out? You will be redirected to the
            homepage and will need to log in again to access the AutoSOAP AI
            tool.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> Any unsaved work will be lost. Make
                  sure to save or copy any important SOAP notes before logging
                  out.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Yes, Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
