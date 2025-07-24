import {
  GenerateSOAPRequest,
  GenerateSOAPResponse,
} from "../../server/routes/openai";
import { analyticsService } from "./analytics-service";

export interface SOAPGenerationOptions {
  patientInfo: string;
  specialty?: string;
  patientAge?: number;
  patientGender?: "male" | "female" | "other";
}

export interface ICDCode {
  code: string;
  description: string;
  confidence: number;
}

export interface CPTCode {
  code: string;
  description: string;
  confidence: number;
  category?: string;
}

export interface HCPCSCode {
  code: string;
  description: string;
  confidence: number;
  level?: 'I' | 'II';
}

export interface SOAPResult {
  soapNote: string;
  icdCodes: ICDCode[];
  cptCodes: CPTCode[];
  hcpcsCodes: HCPCSCode[];
  generatedAt: string;
  wordCount: number;
}

export class SOAPService {
  private static instance: SOAPService;

  static getInstance(): SOAPService {
    if (!SOAPService.instance) {
      SOAPService.instance = new SOAPService();
    }
    return SOAPService.instance;
  }

  async generateSOAP(options: SOAPGenerationOptions): Promise<SOAPResult> {
    try {
      console.log("🏥 Generating SOAP note...", options);

      const requestBody: GenerateSOAPRequest = {
        patientInfo: options.patientInfo,
        specialty: options.specialty || "General Practice",
        patientAge: options.patientAge,
        patientGender: options.patientGender,
      };

      console.log("📝 Request payload:", requestBody);

      // Timeout temporarily disabled due to AbortError issues
      // const controller = new AbortController();
      // const timeoutId = setTimeout(() => {
      //   console.error("⏰ Request timeout after 10 seconds - aborting to use fallback");
      //   controller.abort();
      // }, 10000);

      console.log("📡 Making fetch request to /api/generate-soap...");

      const response = await fetch("/api/generate-soap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }).catch((fetchError) => {
        console.error("❌ Fetch failed:", fetchError);
        throw new Error(`Network request failed: ${fetchError.message}`);
      });
      console.log("📡 Response received, status:", response.status);

      console.log("📡 Response status:", response.status, response.statusText);

      if (!response.ok) {
        // Production mode - API endpoint should exist
        if (response.status === 404) {
          throw new Error(
            "AI generation endpoint not found. Please contact support at support@autosoapai.com",
          );
        }

        const errorData = await response.json().catch(() => ({}));
        console.error("❌ API Error:", errorData);

        // If OpenAI is not configured, fall back to demo mode
        if (response.status === 500 && errorData.details?.includes("OpenAI")) {
          console.error("❌ OpenAI configuration error - no fallbacks");
          throw new Error("OpenAI API configuration error. Check API key configuration.");
        }

        // Create proper error message from the error object
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (errorData.error) {
          errorMessage = errorData.error;
        }
        if (errorData.details) {
          errorMessage += ` - ${errorData.details}`;
        }

        throw new Error(errorMessage);
      }

      console.log("📥 Parsing JSON response...");
      console.log(
        "📡 Response content-type:",
        response.headers.get("content-type"),
      );

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Response is not JSON:", text);
        throw new Error(
          `Server returned non-JSON response: ${text.substring(0, 200)}`,
        );
      }

      const result: GenerateSOAPResponse = await response.json();
      console.log("✅ SOAP note generated successfully");
      console.log(
        "📄 Client received SOAP note:",
        result.soapNote?.substring(0, 100) + "...",
      );
      console.log(
        "🏷️ Client received ICD codes:",
        result.icdCodes?.length || 0,
      );
      console.log(
        "🏷️ Client received CPT codes:",
        result.cptCodes?.length || 0,
      );
      console.log(
        "🏷️ Client received HCPCS codes:",
        result.hcpcsCodes?.length || 0,
      );
      console.log("🔍 Full result object:", result);

      // Validate the response structure
      if (!result.soapNote || !result.icdCodes || !result.generatedAt) {
        console.error("❌ Invalid response structure:", result);
        throw new Error("Server returned incomplete SOAP note data");
      }

      // Track SOAP generation for analytics
      await analyticsService.trackSOAPGeneration();

      return {
        soapNote: result.soapNote,
        icdCodes: result.icdCodes,
        cptCodes: result.cptCodes || [],
        hcpcsCodes: result.hcpcsCodes || [],
        generatedAt: result.generatedAt,
        wordCount: result.wordCount,
      };
    } catch (error) {
      console.error("❌ Error generating SOAP note:", error);

      // Force error for any API failure - no fallbacks allowed
      console.error("❌ Live OpenAI API failed - no fallbacks available");
      throw new Error(`OpenAI API Error: ${error instanceof Error ? error.message : 'Unknown error'}. Check your API key and billing status.`);
    }
  }

  // All demo/fallback methods removed - Live OpenAI API only

  // Utility methods for processing SOAP notes
  extractSections(soapNote: string): { [key: string]: string } {
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

  formatForExport(soapNote: string, patientInfo?: string): string {
    const timestamp = new Date().toLocaleString();

    let formatted = `SOAP NOTE - ${timestamp}\n`;
    formatted += `${"=".repeat(50)}\n\n`;

    if (patientInfo) {
      formatted += `PATIENT INFORMATION:\n${patientInfo}\n\n`;
    }

    formatted += soapNote.replace(/\*\*/g, "").replace(/---[\s\S]*$/, "");
    formatted += `\n\n${"=".repeat(50)}\n`;
    formatted += `Generated by AutoSOAP AI\n`;
    formatted += `Timestamp: ${timestamp}`;

    return formatted;
  }
}

export const soapService = SOAPService.getInstance();
