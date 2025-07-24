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
      console.log("🏥 LIVE API - Generating SOAP note...", options);
      console.log("🌐 CLIENT - Browser location:", window.location.href);
      console.log("🌐 CLIENT - Request URL will be:", window.location.origin + "/api/generate-soap");

      const requestBody: GenerateSOAPRequest = {
        patientInfo: options.patientInfo,
        specialty: options.specialty || "General Practice",
        patientAge: options.patientAge,
        patientGender: options.patientGender,
      };

      console.log("📝 LIVE API - Request payload:", requestBody);
      console.log("📡 LIVE API - Making fetch request to /api/generate-soap...");

      let response;
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log("⏰ CLIENT - Aborting fetch after 25 seconds");
          controller.abort();
        }, 25000);

        console.log("📡 LIVE API - Starting fetch request...");
        console.log("📡 LIVE API - Request payload:", JSON.stringify(requestBody));

        response = await fetch("/api/generate-soap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        console.log("📡 LIVE API - Fetch await completed, checking response...");

        clearTimeout(timeoutId);
        console.log("📡 LIVE API - Fetch completed successfully");
      } catch (fetchError) {
        console.error("❌ LIVE API - Fetch failed:", fetchError);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Request timed out after 25 seconds');
        }
        throw new Error(`Network request failed: ${fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'}`);
      }

      console.log("📡 LIVE API - Response received, status:", response.status);
      console.log("📡 LIVE API - Response headers:", Object.fromEntries(response.headers.entries()));
      console.log("📡 LIVE API - Response ok:", response.ok);

      if (!response.ok) {
        console.error("❌ LIVE API - Response not ok, status:", response.status, response.statusText);
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error("❌ LIVE API - Could not parse error response as JSON:", jsonError);
          errorData = {};
        }
        console.error("❌ LIVE API Error data:", errorData);

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (errorData.error) {
          errorMessage = errorData.error;
        }
        if (errorData.details) {
          errorMessage += ` - ${errorData.details}`;
        }

        throw new Error(`LIVE API FAILED: ${errorMessage}`);
      }

      let result: GenerateSOAPResponse;
      try {
        console.log("📥 LIVE API - Starting JSON parsing...");
        const textResponse = await response.text();
        console.log("📥 LIVE API - Raw response text length:", textResponse.length);
        console.log("📥 LIVE API - Raw response preview:", textResponse.substring(0, 200));

        result = JSON.parse(textResponse);
        console.log("✅ LIVE API - JSON parsed successfully");
      } catch (parseError) {
        console.error("❌ LIVE API - JSON parse failed:", parseError);
        throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
      }

      console.log("✅ LIVE API - SOAP note generated successfully");
      console.log("📄 LIVE API - Full result object:", result);
      console.log("📄 LIVE API - SOAP note preview:", result.soapNote?.substring(0, 100) + "...");
      console.log("🏷️ LIVE API - ICD codes:", result.icdCodes?.length || 0, result.icdCodes);
      console.log("🔧 LIVE API - CPT codes:", result.cptCodes?.length || 0, result.cptCodes);
      console.log("📋 LIVE API - HCPCS codes:", result.hcpcsCodes?.length || 0, result.hcpcsCodes);

      // Validate the response structure
      if (!result || !result.soapNote || !result.icdCodes || !result.generatedAt) {
        console.error("❌ LIVE API - Invalid response structure:", result);
        throw new Error(`LIVE API returned incomplete SOAP note data: soapNote=${!!result?.soapNote}, icdCodes=${!!result?.icdCodes}, generatedAt=${!!result?.generatedAt}`);
      }

      // Track SOAP generation for analytics
      await analyticsService.trackSOAPGeneration();

      const returnObject = {
        soapNote: result.soapNote,
        icdCodes: result.icdCodes || [],
        cptCodes: result.cptCodes || [],
        hcpcsCodes: result.hcpcsCodes || [],
        generatedAt: result.generatedAt,
        wordCount: result.wordCount || 0,
      };

      console.log("🎯 LIVE API - Returning object:", returnObject);
      console.log("🎯 LIVE API - Return validation:", {
        hasSOAPNote: !!returnObject.soapNote,
        soapNoteLength: returnObject.soapNote?.length,
        icdCodesCount: returnObject.icdCodes.length,
        cptCodesCount: returnObject.cptCodes.length,
        hcpcsCodesCount: returnObject.hcpcsCodes.length
      });

      return returnObject;
    } catch (error) {
      console.error("❌ LIVE API - SOAP generation failed:", error);
      
      // NO FALLBACKS - Force error
      throw new Error(`LIVE API ONLY - ${error instanceof Error ? error.message : 'Unknown error'}. Check your OpenAI API key and billing.`);
    }
  }

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
