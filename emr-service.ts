import { SOAPResult } from "./soap-service";

export interface EMRExportFormat {
  name: string;
  extension: string;
  mimeType: string;
  description: string;
  supportsStructured: boolean;
}

export interface HL7Message {
  messageType: string;
  patientId?: string;
  providerId?: string;
  facilityId?: string;
  timestamp: string;
  content: string;
}

export class EMRService {
  private static instance: EMRService;

  static getInstance(): EMRService {
    if (!EMRService.instance) {
      EMRService.instance = new EMRService();
    }
    return EMRService.instance;
  }

  private supportedFormats: EMRExportFormat[] = [
    {
      name: "Epic MyChart",
      extension: "txt",
      mimeType: "text/plain",
      description: "Text format compatible with Epic EMR systems",
      supportsStructured: false,
    },
    {
      name: "Cerner PowerChart",
      extension: "rtf",
      mimeType: "application/rtf",
      description: "Rich text format for Cerner EMR integration",
      supportsStructured: true,
    },
    {
      name: "HL7 FHIR",
      extension: "json",
      mimeType: "application/fhir+json",
      description: "FHIR R4 compliant JSON for modern EMR systems",
      supportsStructured: true,
    },
    {
      name: "HL7 v2.x",
      extension: "hl7",
      mimeType: "application/hl7-v2+er7",
      description: "Traditional HL7 v2 messaging format",
      supportsStructured: true,
    },
    {
      name: "CSV Export",
      extension: "csv",
      mimeType: "text/csv",
      description: "Structured CSV for data analysis and import",
      supportsStructured: true,
    },
    {
      name: "XML Document",
      extension: "xml",
      mimeType: "application/xml",
      description: "Structured XML for various EMR systems",
      supportsStructured: true,
    },
  ];

  getSupportedFormats(): EMRExportFormat[] {
    return this.supportedFormats;
  }

  async exportToEMR(
    soapResult: SOAPResult,
    format: string,
    patientInfo?: {
      id?: string;
      name?: string;
      dob?: string;
      mrn?: string;
    },
    providerInfo?: {
      id?: string;
      name?: string;
      npi?: string;
    },
  ): Promise<{ content: string; filename: string; mimeType: string }> {
    const emrFormat = this.supportedFormats.find((f) => f.name === format);
    if (!emrFormat) {
      throw new Error(`Unsupported EMR format: ${format}`);
    }

    let content: string;
    let filename: string;

    switch (format) {
      case "Epic MyChart":
        content = this.formatForEpic(soapResult, patientInfo, providerInfo);
        filename = `SOAP_Epic_${Date.now()}.${emrFormat.extension}`;
        break;

      case "Cerner PowerChart":
        content = this.formatForCerner(soapResult, patientInfo, providerInfo);
        filename = `SOAP_Cerner_${Date.now()}.${emrFormat.extension}`;
        break;

      case "HL7 FHIR":
        content = this.formatForFHIR(soapResult, patientInfo, providerInfo);
        filename = `SOAP_FHIR_${Date.now()}.${emrFormat.extension}`;
        break;

      case "HL7 v2.x":
        content = this.formatForHL7v2(soapResult, patientInfo, providerInfo);
        filename = `SOAP_HL7_${Date.now()}.${emrFormat.extension}`;
        break;

      case "CSV Export":
        content = this.formatForCSV(soapResult, patientInfo, providerInfo);
        filename = `SOAP_Data_${Date.now()}.${emrFormat.extension}`;
        break;

      case "XML Document":
        content = this.formatForXML(soapResult, patientInfo, providerInfo);
        filename = `SOAP_XML_${Date.now()}.${emrFormat.extension}`;
        break;

      default:
        throw new Error(`Format handler not implemented: ${format}`);
    }

    return {
      content,
      filename,
      mimeType: emrFormat.mimeType,
    };
  }

  private formatForEpic(
    soapResult: SOAPResult,
    patientInfo?: any,
    providerInfo?: any,
  ): string {
    let content = `EPIC EMR SOAP NOTE IMPORT\n`;
    content += `${"=".repeat(50)}\n\n`;

    if (patientInfo) {
      content += `PATIENT: ${patientInfo.name || "Not provided"}\n`;
      content += `MRN: ${patientInfo.mrn || "Not provided"}\n`;
      content += `DOB: ${patientInfo.dob || "Not provided"}\n\n`;
    }

    if (providerInfo) {
      content += `PROVIDER: ${providerInfo.name || "Not provided"}\n`;
      content += `NPI: ${providerInfo.npi || "Not provided"}\n\n`;
    }

    content += `DATE: ${new Date(soapResult.generatedAt).toLocaleDateString()}\n`;
    content += `TIME: ${new Date(soapResult.generatedAt).toLocaleTimeString()}\n\n`;

    content += soapResult.soapNote.replace(/\*\*/g, "");

    return content;
  }

  private formatForCerner(
    soapResult: SOAPResult,
    patientInfo?: any,
    providerInfo?: any,
  ): string {
    let content = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}\\f0\\fs24\n`;
    content += `\\b CERNER POWERCHART SOAP NOTE\\b0\\par\\par\n`;

    if (patientInfo) {
      content += `\\b Patient:\\b0 ${patientInfo.name || "Not provided"}\\par\n`;
      content += `\\b MRN:\\b0 ${patientInfo.mrn || "Not provided"}\\par\\par\n`;
    }

    const soapSections = this.parseSOAPSections(soapResult.soapNote);
    Object.entries(soapSections).forEach(([section, text]) => {
      content += `\\b ${section}:\\b0\\par\n`;
      content += `${text.replace(/\n/g, "\\par\n")}\\par\\par\n`;
    });

    content += `}`;
    return content;
  }

  private formatForFHIR(
    soapResult: SOAPResult,
    patientInfo?: any,
    providerInfo?: any,
  ): string {
    const fhirDocument = {
      resourceType: "DocumentReference",
      id: `soap-${Date.now()}`,
      status: "current",
      type: {
        coding: [
          {
            system: "http://loinc.org",
            code: "11506-3",
            display: "Progress note",
          },
        ],
      },
      subject: patientInfo
        ? {
            reference: `Patient/${patientInfo.id || "unknown"}`,
            display: patientInfo.name || "Unknown Patient",
          }
        : undefined,
      date: soapResult.generatedAt,
      author: providerInfo
        ? [
            {
              reference: `Practitioner/${providerInfo.id || "unknown"}`,
              display: providerInfo.name || "Unknown Provider",
            },
          ]
        : [],
      content: [
        {
          attachment: {
            contentType: "text/plain",
            data: Buffer.from(soapResult.soapNote).toString("base64"),
          },
        },
      ],
      context: {
        encounter: {
          reference: `Encounter/${Date.now()}`,
        },
      },
    };

    return JSON.stringify(fhirDocument, null, 2);
  }

  private formatForHL7v2(
    soapResult: SOAPResult,
    patientInfo?: any,
    providerInfo?: any,
  ): string {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:]/g, "")
      .slice(0, 14);
    const controlId = Date.now().toString();

    let hl7 = `MSH|^~\\&|AutoSOAP|CLINIC|EMR|HOSPITAL|${timestamp}||MDM^T02|${controlId}|P|2.4\r\n`;

    if (patientInfo) {
      hl7 += `PID|1||${patientInfo.mrn || "UNKNOWN"}^^^MRN||${patientInfo.name || "UNKNOWN^PATIENT"}||${patientInfo.dob || ""}||\r\n`;
    }

    if (providerInfo) {
      hl7 += `PV1|1|I||||${providerInfo.npi || "UNKNOWN"}^${providerInfo.name || "UNKNOWN"}||||||||||||\r\n`;
    }

    const soapLines = soapResult.soapNote.split("\n");
    soapLines.forEach((line, index) => {
      if (line.trim()) {
        hl7 += `OBX|${index + 1}|TX|SOAP||${line.replace(/\|/g, "\\F\\")}|||F\r\n`;
      }
    });

    return hl7;
  }

  private formatForCSV(
    soapResult: SOAPResult,
    patientInfo?: any,
    providerInfo?: any,
  ): string {
    const headers = [
      "Timestamp",
      "Patient_MRN",
      "Patient_Name",
      "Provider_Name",
      "Section",
      "Content",
      "ICD_Codes",
      "Word_Count",
    ];
    let csv = headers.join(",") + "\n";

    const sections = this.parseSOAPSections(soapResult.soapNote);
    const icdCodes = soapResult.icdCodes
      .map((code) => `${code.code}:${code.description}`)
      .join("; ");

    Object.entries(sections).forEach(([section, content]) => {
      const row = [
        new Date(soapResult.generatedAt).toISOString(),
        patientInfo?.mrn || "",
        patientInfo?.name || "",
        providerInfo?.name || "",
        section,
        `"${content.replace(/"/g, '""')}"`,
        `"${icdCodes}"`,
        soapResult.wordCount,
      ];
      csv += row.join(",") + "\n";
    });

    return csv;
  }

  private formatForXML(
    soapResult: SOAPResult,
    patientInfo?: any,
    providerInfo?: any,
  ): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<SOAPNote xmlns="http://autosoap.ai/schema/v1">\n`;
    xml += `  <metadata>\n`;
    xml += `    <generatedAt>${soapResult.generatedAt}</generatedAt>\n`;
    xml += `    <wordCount>${soapResult.wordCount}</wordCount>\n`;
    xml += `    <system>AutoSOAP AI</system>\n`;
    xml += `  </metadata>\n`;

    if (patientInfo) {
      xml += `  <patient>\n`;
      xml += `    <id>${this.escapeXML(patientInfo.id || "")}</id>\n`;
      xml += `    <name>${this.escapeXML(patientInfo.name || "")}</name>\n`;
      xml += `    <mrn>${this.escapeXML(patientInfo.mrn || "")}</mrn>\n`;
      xml += `    <dob>${this.escapeXML(patientInfo.dob || "")}</dob>\n`;
      xml += `  </patient>\n`;
    }

    if (providerInfo) {
      xml += `  <provider>\n`;
      xml += `    <id>${this.escapeXML(providerInfo.id || "")}</id>\n`;
      xml += `    <name>${this.escapeXML(providerInfo.name || "")}</name>\n`;
      xml += `    <npi>${this.escapeXML(providerInfo.npi || "")}</npi>\n`;
      xml += `  </provider>\n`;
    }

    xml += `  <content>\n`;
    const sections = this.parseSOAPSections(soapResult.soapNote);
    Object.entries(sections).forEach(([section, content]) => {
      xml += `    <section name="${this.escapeXML(section)}">\n`;
      xml += `      <text>${this.escapeXML(content)}</text>\n`;
      xml += `    </section>\n`;
    });
    xml += `  </content>\n`;

    if (soapResult.icdCodes.length > 0) {
      xml += `  <icdCodes>\n`;
      soapResult.icdCodes.forEach((code) => {
        xml += `    <code id="${this.escapeXML(code.code)}" confidence="${code.confidence}">\n`;
        xml += `      <description>${this.escapeXML(code.description)}</description>\n`;
        xml += `    </code>\n`;
      });
      xml += `  </icdCodes>\n`;
    }

    xml += `</SOAPNote>`;
    return xml;
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

    return sections;
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  downloadEMRExport(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const emrService = EMRService.getInstance();
