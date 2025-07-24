import { SOAPResult, SOAPGenerationOptions } from "./soap-service-new";
import { analyticsService } from "./analytics-service";

export class SimplifiedSOAPService {
  async generateSOAP(options: SOAPGenerationOptions): Promise<SOAPResult> {
    console.log("🔥 SIMPLIFIED - Starting generation...");

    // Communication is working - test removed

    try {
      console.log("🔥 SIMPLIFIED - Making SOAP fetch...");

      const response = await fetch("/api/generate-soap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientInfo: options.patientInfo,
          specialty: options.specialty || "General Practice",
          patientAge: options.patientAge,
          patientGender: options.patientGender,
        }),
      });

      console.log(
        "🔥 SIMPLIFIED - Got response:",
        response.status,
        response.ok,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log("🔥 SIMPLIFIED - Parsed JSON successfully");
      console.log("🔥 SIMPLIFIED - Has SOAP note:", !!result.soapNote);
      console.log("🔥 SIMPLIFIED - ICD codes:", result.icdCodes?.length || 0);
      console.log("🔥 SIMPLIFIED - CPT codes:", result.cptCodes?.length || 0);
      console.log(
        "🔥 SIMPLIFIED - HCPCS codes:",
        result.hcpcsCodes?.length || 0,
      );

      const returnObject = {
        soapNote: result.soapNote || "No SOAP note received",
        icdCodes: result.icdCodes || [],
        cptCodes: result.cptCodes || [],
        hcpcsCodes: result.hcpcsCodes || [],
        generatedAt: result.generatedAt || new Date().toISOString(),
        wordCount: result.wordCount || 0,
      };

      console.log("🔥 SIMPLIFIED - SUCCESS! Returning:", returnObject);

      // Track analytics for successful generation (immediate + retry)
      const trackAnalytics = async () => {
        console.log("📊 Starting analytics tracking for SOAP generation...");
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
          try {
            await analyticsService.trackSOAPGeneration();
            console.log(
              "✅ Analytics - SOAP generation tracked successfully on attempt",
              attempts + 1,
            );

            // Force a small delay to ensure Firestore updates propagate
            await new Promise((resolve) => setTimeout(resolve, 500));
            break;
          } catch (analyticsError) {
            attempts++;
            console.error(
              `❌ Analytics - Failed to track generation (attempt ${attempts}/${maxAttempts}):`,
              analyticsError,
            );

            if (attempts < maxAttempts) {
              // Wait before retrying (exponential backoff)
              const delay = Math.pow(2, attempts) * 1000;
              console.log(`⏳ Analytics - Retrying in ${delay}ms...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
              console.error(
                "💥 Analytics - All tracking attempts failed, trying force create...",
              );

              // Last resort: force create user document
              try {
                await analyticsService.forceCreateUserDocument();
                await analyticsService.trackSOAPGeneration();
                console.log("✅ Analytics - Tracked after force create");
              } catch (forceError) {
                console.error(
                  "💥 Analytics - Even force create failed:",
                  forceError,
                );
              }
            }
          }
        }
      };

      // Start analytics tracking immediately (don't wait)
      trackAnalytics();

      console.log(
        "🎯 SIMPLIFIED - Returning SOAP result with analytics tracking initiated",
      );

      return returnObject;
    } catch (error) {
      console.error("🔥 SIMPLIFIED - Error:", error);
      throw error;
    }
  }
}

export const simplifiedSoapService = new SimplifiedSOAPService();
