import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { SOAPResult } from "./soap-service";

export interface PDFExportOptions {
  includeLetterhead?: boolean;
  includeLogo?: boolean;
  providerName?: string;
  facilityName?: string;
  facilityAddress?: string;
  facilityPhone?: string;
  patientInfo?: {
    name?: string;
    dob?: string;
    mrn?: string;
    age?: number;
    gender?: string;
  };
  timestamp?: string;
}

export class PDFService {
  private static instance: PDFService;

  static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  async exportSOAPToPDF(
    soapResult: SOAPResult,
    options: PDFExportOptions = {},
  ): Promise<void> {
    try {
      console.log("📄 Starting PDF export...");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let currentY = 20;

      // Add letterhead if requested
      if (options.includeLetterhead) {
        currentY = this.addLetterhead(pdf, options, currentY, pageWidth);
      }

      // Add patient information
      if (options.patientInfo) {
        currentY = this.addPatientInfo(
          pdf,
          options.patientInfo,
          currentY,
          pageWidth,
        );
      }

      // Add SOAP note content
      currentY = this.addSOAPContent(
        pdf,
        soapResult,
        currentY,
        pageWidth,
        pageHeight,
      );

      // Add footer
      this.addFooter(pdf, options, pageHeight, pageWidth);

      // Save the PDF
      const fileName = `SOAP_Note_${new Date().toISOString().split("T")[0]}_${Date.now()}.pdf`;
      pdf.save(fileName);

      console.log("✅ PDF exported successfully:", fileName);
    } catch (error) {
      console.error("❌ PDF export failed:", error);
      throw new Error("Failed to export PDF. Please try again.");
    }
  }

  private addLetterhead(
    pdf: jsPDF,
    options: PDFExportOptions,
    startY: number,
    pageWidth: number,
  ): number {
    let currentY = startY;

    // Add logo placeholder (you can replace with actual logo)
    if (options.includeLogo) {
      pdf.setFillColor(22, 162, 134); // Primary teal color
      pdf.roundedRect(20, currentY, 15, 15, 2, 2, "F");

      // Add "AS" text in logo (AutoSOAP)
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("AS", 25, currentY + 10);

      // Add AutoSOAP AI text
      pdf.setTextColor(22, 162, 134);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("AutoSOAP AI", 40, currentY + 10);

      currentY += 20;
    }

    // Add facility information
    if (options.facilityName || options.providerName) {
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");

      if (options.facilityName) {
        pdf.text(options.facilityName, 20, currentY);
        currentY += 7;
      }

      if (options.providerName) {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(options.providerName, 20, currentY);
        currentY += 6;
      }

      if (options.facilityAddress) {
        pdf.setFontSize(10);
        pdf.text(options.facilityAddress, 20, currentY);
        currentY += 5;
      }

      if (options.facilityPhone) {
        pdf.text(options.facilityPhone, 20, currentY);
        currentY += 5;
      }
    }

    // Add line separator
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, currentY + 5, pageWidth - 20, currentY + 5);

    return currentY + 15;
  }

  private addPatientInfo(
    pdf: jsPDF,
    patientInfo: NonNullable<PDFExportOptions["patientInfo"]>,
    startY: number,
    pageWidth: number,
  ): number {
    let currentY = startY;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("PATIENT INFORMATION", 20, currentY);
    currentY += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const infoItems = [
      { label: "Patient Name:", value: patientInfo.name || "Not provided" },
      { label: "Date of Birth:", value: patientInfo.dob || "Not provided" },
      { label: "Medical Record #:", value: patientInfo.mrn || "Not provided" },
      {
        label: "Age:",
        value: patientInfo.age ? `${patientInfo.age} years` : "Not provided",
      },
      { label: "Gender:", value: patientInfo.gender || "Not specified" },
    ];

    infoItems.forEach((item, index) => {
      if (index % 2 === 0) {
        // Left column
        pdf.setFont("helvetica", "bold");
        pdf.text(item.label, 20, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.text(item.value, 50, currentY);
      } else {
        // Right column
        pdf.setFont("helvetica", "bold");
        pdf.text(item.label, pageWidth / 2 + 10, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.text(item.value, pageWidth / 2 + 40, currentY);
        currentY += 6;
      }
    });

    // Add line separator
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, currentY + 5, pageWidth - 20, currentY + 5);

    return currentY + 15;
  }

  private addSOAPContent(
    pdf: jsPDF,
    soapResult: SOAPResult,
    startY: number,
    pageWidth: number,
    pageHeight: number,
  ): number {
    let currentY = startY;
    const maxWidth = pageWidth - 40;
    const lineHeight = 5;

    // Add title
    pdf.setTextColor(22, 162, 134);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("SOAP NOTE", 20, currentY);

    // Add generation timestamp
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Generated: ${new Date(soapResult.generatedAt).toLocaleString()}`,
      pageWidth - 80,
      currentY,
    );

    currentY += 10;

    // Process SOAP content
    const sections = this.parseSOAPSections(soapResult.soapNote);

    Object.entries(sections).forEach(([sectionTitle, content]) => {
      // Check if we need a new page
      if (currentY > pageHeight - 50) {
        pdf.addPage();
        currentY = 20;
      }

      // Add section header
      pdf.setTextColor(22, 162, 134);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(sectionTitle, 20, currentY);
      currentY += 8;

      // Add section content
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const lines = pdf.splitTextToSize(content, maxWidth);
      lines.forEach((line: string) => {
        if (currentY > pageHeight - 30) {
          pdf.addPage();
          currentY = 20;
        }
        pdf.text(line, 20, currentY);
        currentY += lineHeight;
      });

      currentY += 5; // Extra space between sections
    });

    // Add ICD codes if present
    if (soapResult.icdCodes.length > 0) {
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setTextColor(22, 162, 134);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("ICD-10 DIAGNOSTIC CODES", 20, currentY);
      currentY += 8;

      soapResult.icdCodes.forEach((code) => {
        if (currentY > pageHeight - 30) {
          pdf.addPage();
          currentY = 20;
        }

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${code.code}`, 25, currentY);

        pdf.setFont("helvetica", "normal");
        const description = pdf.splitTextToSize(
          code.description,
          maxWidth - 30,
        );
        pdf.text(description, 50, currentY);

        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(8);
        pdf.text(
          `(${Math.round(code.confidence * 100)}% confidence)`,
          pageWidth - 50,
          currentY,
        );

        currentY += 6;
      });
    }

    // Add CPT codes if present
    if (soapResult.cptCodes && soapResult.cptCodes.length > 0) {
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = 20;
      }

      currentY += 5; // Add some spacing

      pdf.setTextColor(34, 139, 34);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("CPT PROCEDURE CODES", 20, currentY);
      currentY += 8;

      soapResult.cptCodes.forEach((code) => {
        if (currentY > pageHeight - 30) {
          pdf.addPage();
          currentY = 20;
        }

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${code.code}`, 25, currentY);

        pdf.setFont("helvetica", "normal");
        const description = pdf.splitTextToSize(
          code.description,
          maxWidth - 30,
        );
        pdf.text(description, 50, currentY);

        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(8);
        pdf.text(
          `(${Math.round(code.confidence * 100)}% confidence)`,
          pageWidth - 50,
          currentY,
        );

        currentY += 6;
      });
    }

    // Add HCPCS codes if present
    if (soapResult.hcpcsCodes && soapResult.hcpcsCodes.length > 0) {
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = 20;
      }

      currentY += 5; // Add some spacing

      pdf.setTextColor(128, 0, 128);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("HCPCS CODES", 20, currentY);
      currentY += 8;

      soapResult.hcpcsCodes.forEach((code) => {
        if (currentY > pageHeight - 30) {
          pdf.addPage();
          currentY = 20;
        }

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${code.code}`, 25, currentY);

        pdf.setFont("helvetica", "normal");
        const description = pdf.splitTextToSize(
          code.description,
          maxWidth - 30,
        );
        pdf.text(description, 50, currentY);

        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(8);
        pdf.text(
          `(${Math.round(code.confidence * 100)}% confidence)`,
          pageWidth - 50,
          currentY,
        );

        currentY += 6;
      });
    }

    return currentY;
  }

  private addFooter(
    pdf: jsPDF,
    options: PDFExportOptions,
    pageHeight: number,
    pageWidth: number,
  ): void {
    const footerY = pageHeight - 15;

    // Add line above footer
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, footerY - 5, pageWidth - 20, footerY - 5);

    // Add footer text
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");

    const footerLeft = "Generated by AutoSOAP AI";
    const footerCenter = "Please review and modify as clinically appropriate";
    const footerRight = `Page 1`; // Simple static page number for single page document

    pdf.text(footerLeft, 20, footerY);
    pdf.text(footerCenter, pageWidth / 2, footerY, { align: "center" });
    pdf.text(footerRight, pageWidth - 20, footerY, { align: "right" });
  }

  private parseSOAPSections(soapNote: string): { [key: string]: string } {
    const sections: { [key: string]: string } = {};
    const sectionRegex =
      /\*\*([A-Z\s]+):\*\*\n([\s\S]*?)(?=\*\*[A-Z\s]+:\*\*|\n---|\n\*|$)/g;

    let match;
    while ((match = sectionRegex.exec(soapNote)) !== null) {
      const sectionName = match[1].trim();
      const sectionContent = match[2].trim();
      sections[sectionName] = sectionContent;
    }

    // If no sections found, treat as single content
    if (Object.keys(sections).length === 0) {
      sections["SOAP NOTE"] = soapNote
        .replace(/\*\*/g, "")
        .replace(/---[\s\S]*$/, "")
        .trim();
    }

    return sections;
  }

  // Method to export current SOAP note as formatted text with letterhead
  exportSOAPAsText(
    soapResult: SOAPResult,
    options: PDFExportOptions = {},
  ): string {
    let content = "";

    // Add letterhead
    if (options.includeLetterhead) {
      content += "═".repeat(80) + "\n";
      content += "AutoSOAP AI - Medical Documentation\n";
      if (options.facilityName) {
        content += `${options.facilityName}\n`;
      }
      if (options.providerName) {
        content += `Provider: ${options.providerName}\n`;
      }
      if (options.facilityAddress) {
        content += `${options.facilityAddress}\n`;
      }
      if (options.facilityPhone) {
        content += `Phone: ${options.facilityPhone}\n`;
      }
      content += "═".repeat(80) + "\n\n";
    }

    // Add patient info
    if (options.patientInfo) {
      content += "PATIENT INFORMATION\n";
      content += "─".repeat(40) + "\n";
      if (options.patientInfo.name)
        content += `Patient Name: ${options.patientInfo.name}\n`;
      if (options.patientInfo.dob)
        content += `Date of Birth: ${options.patientInfo.dob}\n`;
      if (options.patientInfo.mrn)
        content += `Medical Record #: ${options.patientInfo.mrn}\n`;
      if (options.patientInfo.age)
        content += `Age: ${options.patientInfo.age} years\n`;
      if (options.patientInfo.gender)
        content += `Gender: ${options.patientInfo.gender}\n`;
      content += "\n";
    }

    // Add SOAP content
    content += "SOAP NOTE\n";
    content += "─".repeat(40) + "\n";
    content += `Generated: ${new Date(soapResult.generatedAt).toLocaleString()}\n\n`;
    content += soapResult.soapNote.replace(/\*\*/g, "");

    // Add ICD codes
    if (soapResult.icdCodes.length > 0) {
      content += "\n\nICD-10 DIAGNOSTIC CODES\n";
      content += "─".repeat(40) + "\n";
      soapResult.icdCodes.forEach((code) => {
        content += `${code.code} - ${code.description} (${Math.round(code.confidence * 100)}% confidence)\n`;
      });
    }

    // Add CPT codes
    if (soapResult.cptCodes && soapResult.cptCodes.length > 0) {
      content += "\n\nCPT PROCEDURE CODES\n";
      content += "─".repeat(40) + "\n";
      soapResult.cptCodes.forEach((code) => {
        content += `${code.code} - ${code.description} (${Math.round(code.confidence * 100)}% confidence)\n`;
      });
    }

    // Add HCPCS codes
    if (soapResult.hcpcsCodes && soapResult.hcpcsCodes.length > 0) {
      content += "\n\nHCPCS CODES\n";
      content += "─".repeat(40) + "\n";
      soapResult.hcpcsCodes.forEach((code) => {
        content += `${code.code} - ${code.description} (${Math.round(code.confidence * 100)}% confidence)\n`;
      });
    }

    content += "\n" + "═".repeat(80) + "\n";
    content +=
      "Generated by AutoSOAP AI - Please review and modify as clinically appropriate\n";
    content += `Export Date: ${new Date().toLocaleString()}\n`;

    return content;
  }
}

export const pdfService = PDFService.getInstance();
