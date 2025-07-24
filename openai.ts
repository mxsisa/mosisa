import { RequestHandler } from "express";
import OpenAI from "openai";

// Initialize OpenAI client
let openai: OpenAI | null = null;

const getOpenAI = () => {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (
      !apiKey ||
      apiKey.trim() === "" ||
      apiKey === "your_openai_api_key_here"
    ) {
      throw new Error(
        "OPENAI_API_KEY environment variable is not set. Please configure your OpenAI API key.",
      );
    }

    openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log("✅ OpenAI initialized successfully");
  }
  return openai;
};

export interface GenerateSOAPRequest {
  patientInfo: string;
  specialty?: string;
  patientAge?: number;
  patientGender?: "male" | "female" | "other";
}

export interface GenerateSOAPResponse {
  soapNote: string;
  icdCodes: Array<{
    code: string;
    description: string;
    confidence: number;
  }>;
  cptCodes: Array<{
    code: string;
    description: string;
    confidence: number;
    category?: string;
  }>;
  hcpcsCodes: Array<{
    code: string;
    description: string;
    confidence: number;
    level?: 'I' | 'II';
  }>;
  generatedAt: string;
  wordCount: number;
}

export const generateSOAP: RequestHandler = async (req, res) => {
  try {
    console.log("🏥 SOAP generation request received");
    console.log("📝 Request body:", JSON.stringify(req.body, null, 2));

    const {
      patientInfo,
      specialty = "General Practice",
      patientAge,
      patientGender,
    }: GenerateSOAPRequest = req.body;

    if (!patientInfo || patientInfo.trim().length === 0) {
      console.error("❌ Missing patient information");
      return res.status(400).json({
        error: "Patient information is required",
        details:
          "Please provide patient symptoms, examination findings, or clinical notes",
      });
    }

    console.log("🤖 Initializing OpenAI...");
    console.log("🔑 API Key present:", !!process.env.OPENAI_API_KEY);
    console.log("🔑 API Key starts with:", process.env.OPENAI_API_KEY?.substring(0, 20) + "...");
    const openaiClient = getOpenAI();
    console.log("✅ OpenAI client initialized successfully");

    // Create specialized medical prompt
    const medicalPrompt = createMedicalPrompt(
      patientInfo,
      specialty,
      patientAge,
      patientGender,
    );

    let completion;
    let modelUsed = "gpt-4o";

    try {
      console.log("🧠 LIVE API CALL - Generating SOAP note with GPT-4o...");
      console.log("📝 Patient info being sent to OpenAI:", patientInfo.substring(0, 100));
      completion = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert medical AI assistant specializing in clinical documentation. You have deep knowledge of medical terminology, SOAP note formatting, ICD-10 diagnostic coding, CPT procedure codes, and HCPCS codes.

Your task is to generate professional, accurate SOAP notes based on patient information provided. Always maintain clinical accuracy and professional medical language.

**CRITICAL REQUIREMENT**: You MUST ALWAYS include both CPT and HCPCS codes in every response. This is mandatory for billing and documentation purposes.

Format your response as a JSON object with exactly these fields:
{
  "subjective": "Patient's reported symptoms and history",
  "objective": "Physical examination findings and vital signs",
  "assessment": "Clinical assessment and differential diagnosis",
  "plan": "Treatment plan and follow-up instructions",
  "icdCodes": [{"code": "string", "description": "string", "confidence": 0.8}],
  "cptCodes": [{"code": "string", "description": "string", "confidence": 0.8}],
  "hcpcsCodes": [{"code": "string", "description": "string", "confidence": 0.8}]
}

**MANDATORY CPT CODES**: Every medical encounter requires CPT codes. You must include:
- At minimum one E&M (Evaluation & Management) code: 99213, 99214, 99203, 99204
- Additional procedure codes based on services provided (EKG: 93000, Lab: 80053, etc.)

**MANDATORY HCPCS CODES**: Include when applicable:
- G0444: Annual wellness visits
- G0438: Welcome to Medicare visit
- A4259: Supplies when used

**EXAMPLE RESPONSE STRUCTURE**:
{
  "subjective": "45 y/o male with chest pain...",
  "objective": "Vitals stable, heart rate 78...",
  "assessment": "Chest pain, likely musculoskeletal...",
  "plan": "1. EKG to rule out cardiac causes...",
  "icdCodes": [{"code": "R07.89", "description": "Other chest pain", "confidence": 0.8}],
  "cptCodes": [{"code": "99214", "description": "Office visit, high complexity", "confidence": 0.9}],
  "hcpcsCodes": [{"code": "G0444", "description": "Annual wellness visit", "confidence": 0.7}]
}

Do not omit any of these required fields. Be thorough but concise.`,
          },
          {
            role: "user",
            content: medicalPrompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent medical content
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });
    } catch (modelError: any) {
      // Check if it's a quota/rate limit error - if so, throw it up to be handled by outer catch
      if (modelError.status === 429 || modelError.message?.includes("quota") || modelError.message?.includes("rate limit")) {
        console.warn("⚠️ GPT-4o quota exceeded, throwing to outer handler");
        throw modelError;
      }

      console.warn("⚠️ GPT-4o not available, falling back to GPT-3.5-turbo...");
      modelUsed = "gpt-3.5-turbo";

      try {
        completion = await openaiClient.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are an expert medical AI assistant specializing in clinical documentation. Generate professional SOAP notes with JSON format: {"subjective": "", "objective": "", "assessment": "", "plan": "", "icdCodes": [{"code": "", "description": "", "confidence": 0.8}], "cptCodes": [{"code": "", "description": "", "confidence": 0.8}], "hcpcsCodes": [{"code": "", "description": "", "confidence": 0.8}]}`,
            },
            {
              role: "user",
              content: medicalPrompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        });
      } catch (fallbackError: any) {
        // If fallback also fails with quota error, throw it up
        if (fallbackError.status === 429 || fallbackError.message?.includes("quota") || fallbackError.message?.includes("rate limit")) {
          console.warn("⚠️ GPT-3.5-turbo also quota exceeded, throwing to outer handler");
          throw fallbackError;
        }
        throw fallbackError;
      }
    }

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response received from OpenAI");
    }

    console.log("✅ AI response received, parsing...");

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
      console.log("🔍 Parsed AI response structure:", {
        hasSubjective: !!parsedResponse.subjective,
        hasObjective: !!parsedResponse.objective,
        hasAssessment: !!parsedResponse.assessment,
        hasPlan: !!parsedResponse.plan,
        icdCodesCount: parsedResponse.icdCodes?.length || 0,
        cptCodesCount: parsedResponse.cptCodes?.length || 0,
        hcpcsCodesCount: parsedResponse.hcpcsCodes?.length || 0
      });
    } catch (parseError) {
      console.error("❌ Failed to parse AI response:", parseError);
      throw new Error("Invalid response format from AI");
    }

    // Format the SOAP note
    const formattedSOAP = formatSOAPNote(parsedResponse);

    // Ensure CPT and HCPCS codes are always present with intelligent defaults
    let cptCodes = parsedResponse.cptCodes || [];
    let hcpcsCodes = parsedResponse.hcpcsCodes || [];

    // Add default CPT codes if none provided
    if (cptCodes.length === 0) {
      console.log("⚠️ No CPT codes from AI, adding default evaluation codes");

      // Determine appropriate CPT code based on complexity and patient info
      const patientInfo = req.body.patientInfo?.toLowerCase() || "";
      const isComplex = patientInfo.includes("chest pain") ||
                       patientInfo.includes("shortness of breath") ||
                       patientInfo.includes("severe") ||
                       patientInfo.includes("multiple") ||
                       patientInfo.includes("chronic");

      if (isComplex) {
        cptCodes.push({
          code: "99214",
          description: "Office or other outpatient visit for evaluation and management of an established patient, high complexity",
          confidence: 0.8
        });
      } else {
        cptCodes.push({
          code: "99213",
          description: "Office or other outpatient visit for evaluation and management of an established patient, moderate complexity",
          confidence: 0.8
        });
      }

      // Add procedure codes based on symptoms
      if (patientInfo.includes("ekg") || patientInfo.includes("ecg") || patientInfo.includes("heart")) {
        cptCodes.push({
          code: "93000",
          description: "Electrocardiogram, routine ECG with at least 12 leads",
          confidence: 0.7
        });
      }
    }

    // Add default HCPCS codes when appropriate
    if (hcpcsCodes.length === 0) {
      const patientAge = req.body.patientAge;
      const patientInfo = req.body.patientInfo?.toLowerCase() || "";

      // Add wellness visit codes for appropriate scenarios
      if (patientAge && patientAge >= 40 &&
          (patientInfo.includes("annual") || patientInfo.includes("wellness") || patientInfo.includes("check"))){
        hcpcsCodes.push({
          code: "G0444",
          description: "Annual wellness visit; includes a personalized prevention plan",
          confidence: 0.7
        });
      }
    }

    const response: GenerateSOAPResponse = {
      soapNote: formattedSOAP,
      icdCodes: parsedResponse.icdCodes || [],
      cptCodes: cptCodes,
      hcpcsCodes: hcpcsCodes,
      generatedAt: new Date().toISOString(),
      wordCount: formattedSOAP.split(" ").length,
    };

    console.log("🔍 Final response structure:", {
      icdCodesCount: response.icdCodes.length,
      cptCodesCount: response.cptCodes.length,
      hcpcsCodesCount: response.hcpcsCodes.length,
      hasCptCodes: !!response.cptCodes,
      hasHcpcsCodes: !!response.hcpcsCodes
    });

    console.log(`✅ SOAP note generated successfully using ${modelUsed}`);
    console.log(
      `📊 Word count: ${response.wordCount}, ICD codes: ${response.icdCodes.length}, CPT codes: ${response.cptCodes?.length || 0}, HCPCS codes: ${response.hcpcsCodes?.length || 0}`,
    );

    // Ensure response is sent immediately with proper headers
    console.log("📤 SERVER - Setting response headers...");
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log("📤 SERVER - Sending response with status 200...");
    console.log("📤 SERVER - Response size:", JSON.stringify(response).length, "characters");

    try {
      res.status(200);
      res.json(response);
      console.log("📤 SERVER - res.json() called successfully");

      // Check if response was actually sent
      setTimeout(() => {
        console.log("📤 SERVER - Response finished?", res.headersSent);
        console.log("📤 SERVER - Response destroyed?", res.destroyed);
      }, 100);

    } catch (responseError) {
      console.error("📤 SERVER - Error sending response:", responseError);
      throw responseError;
    }
  } catch (error) {
    console.error("❌ Error generating SOAP note:", error);

    if (error instanceof Error) {
      console.error("🔍 Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      // Handle specific OpenAI errors
      if (error.message.includes("OPENAI_API_KEY")) {
        return res.status(500).json({
          error: "OpenAI configuration error. Please contact support.",
          details: "Missing or invalid OpenAI configuration",
        });
      }

      if (
        error.message.includes("rate limit") ||
        error.message.includes("quota") ||
        error.message.includes("429") ||
        (error as any).status === 429
      ) {
        console.error("❌ Rate limit/quota exceeded - cannot continue");
        return res.status(429).json({
          error: "Rate limit exceeded",
          details: "OpenAI API rate limit or quota exceeded. Please try again later or check your OpenAI account billing.",
        });
      }
    }

    res.status(500).json({
      error: "Failed to generate SOAP note",
      details:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

function createMedicalPrompt(
  patientInfo: string,
  specialty: string,
  patientAge?: number,
  patientGender?: string,
): string {
  let prompt = `Generate a comprehensive SOAP note based on the following patient information:\n\n`;

  if (patientAge) {
    prompt += `Patient Age: ${patientAge} years old\n`;
  }

  if (patientGender) {
    prompt += `Patient Gender: ${patientGender}\n`;
  }

  prompt += `Medical Specialty: ${specialty}\n\n`;
  prompt += `Clinical Information:\n${patientInfo}\n\n`;

  prompt += `Please create a professional SOAP note with:\n`;
  prompt += `- SUBJECTIVE: Patient's reported symptoms, history, and complaints\n`;
  prompt += `- OBJECTIVE: Physical examination findings, vital signs, and observations\n`;
  prompt += `- ASSESSMENT: Clinical assessment, differential diagnosis, and clinical reasoning\n`;
  prompt += `- PLAN: Treatment recommendations, medications, follow-up, and patient education\n\n`;

  prompt += `Also provide relevant medical codes:\n`;
  prompt += `- ICD-10 diagnostic codes with confidence scores based on the assessment\n`;
  prompt += `- CPT procedure codes for any procedures, evaluations, or services performed\n`;
  prompt += `- HCPCS codes for any supplies, equipment, or additional services when applicable\n`;
  prompt += `Focus on clinical accuracy and professional medical documentation standards.`;

  return prompt;
}

function formatSOAPNote(parsedResponse: any): string {
  const { subjective, objective, assessment, plan } = parsedResponse;

  let formatted = `**SUBJECTIVE:**\n`;
  formatted += `${subjective || "Patient information to be documented."}\n\n`;

  formatted += `**OBJECTIVE:**\n`;
  formatted += `${objective || "Physical examination findings to be documented."}\n\n`;

  formatted += `**ASSESSMENT:**\n`;
  formatted += `${assessment || "Clinical assessment to be documented."}\n\n`;

  formatted += `**PLAN:**\n`;
  formatted += `${plan || "Treatment plan to be documented."}\n\n`;

  // Add ICD codes if present
  if (parsedResponse.icdCodes && parsedResponse.icdCodes.length > 0) {
    formatted += `**ICD-10 DIAGNOSTIC CODES:**\n`;
    parsedResponse.icdCodes.forEach((code: any) => {
      formatted += `• ${code.code} - ${code.description}`;
      if (code.confidence) {
        formatted += ` (Confidence: ${Math.round(code.confidence * 100)}%)`;
      }
      formatted += `\n`;
    });
    formatted += `\n`;
  }

  // Add CPT codes if present
  if (parsedResponse.cptCodes && parsedResponse.cptCodes.length > 0) {
    formatted += `**CPT PROCEDURE CODES:**\n`;
    parsedResponse.cptCodes.forEach((code: any) => {
      formatted += `• ${code.code} - ${code.description}`;
      if (code.confidence) {
        formatted += ` (Confidence: ${Math.round(code.confidence * 100)}%)`;
      }
      formatted += `\n`;
    });
    formatted += `\n`;
  }

  // Add HCPCS codes if present
  if (parsedResponse.hcpcsCodes && parsedResponse.hcpcsCodes.length > 0) {
    formatted += `**HCPCS CODES:**\n`;
    parsedResponse.hcpcsCodes.forEach((code: any) => {
      formatted += `• ${code.code} - ${code.description}`;
      if (code.confidence) {
        formatted += ` (Confidence: ${Math.round(code.confidence * 100)}%)`;
      }
      formatted += `\n`;
    });
    formatted += `\n`;
  }

  formatted += `---\n`;
  formatted += `*Generated by AutoSOAP AI - Please review and modify as clinically appropriate*`;

  return formatted;
}

// Demo endpoint removed - Live OpenAI API only
