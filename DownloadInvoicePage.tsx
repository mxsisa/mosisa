import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Building,
  User,
  CheckCircle,
  Eye,
} from "lucide-react";

interface DownloadInvoicePageProps {
  onBack: () => void;
}

export default function DownloadInvoicePage({
  onBack,
}: DownloadInvoicePageProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Mock invoice data
  const invoices = [
    {
      id: "INV-2025-001",
      date: "2025-01-01",
      amount: 99.0,
      status: "paid",
      plan: "Individual Provider",
      period: "January 2025",
      dueDate: "2025-01-01",
    },
    {
      id: "INV-2024-012",
      date: "2024-12-01",
      amount: 99.0,
      status: "paid",
      plan: "Individual Provider",
      period: "December 2024",
      dueDate: "2024-12-01",
    },
    {
      id: "INV-2024-011",
      date: "2024-11-01",
      amount: 99.0,
      status: "paid",
      plan: "Individual Provider",
      period: "November 2024",
      dueDate: "2024-11-01",
    },
    {
      id: "INV-2024-010",
      date: "2024-10-01",
      amount: 99.0,
      status: "paid",
      plan: "Individual Provider",
      period: "October 2024",
      dueDate: "2024-10-01",
    },
  ];

  const handleDownload = async (invoiceId: string) => {
    setDownloadingId(invoiceId);

    // Simulate download process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, this would trigger an actual file download
    console.log(`Downloading invoice ${invoiceId}`);

    setDownloadingId(null);
  };

  const handlePreview = (invoiceId: string) => {
    // In a real app, this would open a preview modal or new tab
    console.log(`Previewing invoice ${invoiceId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Invoices & Billing
          </h2>
          <p className="text-gray-600">
            Download and manage your billing history
          </p>
        </div>
      </div>

      {/* Current Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Current Plan
                </p>
                <p className="text-2xl font-bold text-gray-900">$99/month</p>
                <p className="text-sm text-gray-500">Individual Provider</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Next Billing
                </p>
                <p className="text-2xl font-bold text-gray-900">Jan 15</p>
                <p className="text-sm text-gray-500">2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Payment Status
                </p>
                <p className="text-2xl font-bold text-gray-900">Current</p>
                <p className="text-sm text-gray-500">All invoices paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Invoice History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold">{invoice.id}</h4>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {invoice.plan} • {invoice.period}
                    </p>
                    <p className="text-sm text-gray-500">
                      Issued: {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ${invoice.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(invoice.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(invoice.id)}
                      disabled={downloadingId === invoice.id}
                    >
                      {downloadingId === invoice.id ? (
                        <>
                          <div className="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Billing Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">Dr. Mosisa Saba</p>
              <p className="text-gray-600">support@autosoapai.com</p>
              <p className="text-gray-600">Individual Provider Plan</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-gray-600">Expires 12/2027</p>
              <p className="text-gray-600">Visa</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download All */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold mb-1">Need all invoices?</h4>
              <p className="text-gray-600">
                Download a ZIP file containing all your invoices for the tax
                year.
              </p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download All (2024)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
