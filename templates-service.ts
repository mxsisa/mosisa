export interface SOAPTemplate {
  id: string;
  name: string;
  specialty: string;
  description: string;
  sections: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  commonTerms: string[];
  icdCodeHints: string[];
  customPrompt?: string;
}

export interface UserTemplate extends SOAPTemplate {
  userId: string;
  createdAt: string;
  lastUsed: string;
  useCount: number;
}

export class TemplatesService {
  private static instance: TemplatesService;

  static getInstance(): TemplatesService {
    if (!TemplatesService.instance) {
      TemplatesService.instance = new TemplatesService();
    }
    return TemplatesService.instance;
  }

  private defaultTemplates: SOAPTemplate[] = [
    {
      id: "general-adult",
      name: "General Adult Examination",
      specialty: "General Practice",
      description: "Standard template for adult primary care visits",
      sections: {
        subjective:
          "Chief complaint:\nHistory of present illness:\nReview of systems:\nPast medical history:\nMedications:\nAllergies:\nSocial history:",
        objective:
          "Vital signs:\nGeneral appearance:\nHEENT:\nCardiovascular:\nRespiratory:\nAbdomen:\nExtremities:\nNeurological:",
        assessment:
          "Primary diagnosis:\nDifferential diagnosis:\nClinical reasoning:",
        plan: "Treatment:\nMedications:\nFollow-up:\nPatient education:\nReturn precautions:",
      },
      commonTerms: [
        "vital signs",
        "chief complaint",
        "history",
        "examination",
        "diagnosis",
        "treatment",
      ],
      icdCodeHints: ["Z00.00", "Z23", "I10"],
    },
    {
      id: "emergency-chest-pain",
      name: "Emergency: Chest Pain",
      specialty: "Emergency Medicine",
      description: "Template for chest pain evaluation in emergency setting",
      sections: {
        subjective:
          "Chief complaint: Chest pain\nOnset and duration:\nCharacter and quality:\nRadiation:\nAssociated symptoms:\nAggravating/alleviating factors:\nCardiac risk factors:",
        objective:
          "Vital signs (including orthostatics):\nGeneral appearance:\nCardiovascular examination:\nRespiratory examination:\nECG findings:\nChest X-ray findings:",
        assessment:
          "Chest pain etiology:\nRisk stratification:\nCardiac vs non-cardiac:",
        plan: "Cardiac workup:\nPain management:\nDisposition:\nDischarge instructions:\nFollow-up arrangements:",
      },
      commonTerms: [
        "chest pain",
        "cardiac",
        "EKG",
        "troponin",
        "myocardial infarction",
        "angina",
      ],
      icdCodeHints: ["R06.02", "I20.9", "I21.9", "R07.89"],
    },
    {
      id: "pediatric-fever",
      name: "Pediatric: Fever Evaluation",
      specialty: "Pediatrics",
      description: "Template for pediatric patients presenting with fever",
      sections: {
        subjective:
          "Chief complaint: Fever\nFever duration and pattern:\nMaximum temperature:\nAssociated symptoms:\nAppetite and fluid intake:\nUrine output:\nExposures:\nImmunization status:",
        objective:
          "Vital signs (age-appropriate):\nGeneral appearance and activity level:\nHEENT examination:\nRespiratory examination:\nCardiovascular examination:\nAbdominal examination:\nSkin examination:",
        assessment:
          "Fever source:\nSeverity of illness:\nAge-appropriate considerations:",
        plan: "Fever management:\nAntipyretics:\nHydration:\nReturn precautions:\nFollow-up:\nParent education:",
      },
      commonTerms: [
        "fever",
        "pediatric",
        "temperature",
        "viral",
        "bacterial",
        "dehydration",
      ],
      icdCodeHints: ["R50.9", "J06.9", "A08.4", "H66.90"],
    },
    {
      id: "urgent-care-uri",
      name: "Urgent Care: Upper Respiratory",
      specialty: "Urgent Care",
      description: "Template for upper respiratory infections in urgent care",
      sections: {
        subjective:
          "Chief complaint: Upper respiratory symptoms\nSymptom duration:\nCough characteristics:\nSore throat:\nNasal congestion:\nFever:\nRecent exposures:",
        objective:
          "Vital signs:\nGeneral appearance:\nHEENT examination:\nNeck examination:\nRespiratory examination:\nSkin examination:",
        assessment:
          "Upper respiratory infection:\nViral vs bacterial consideration:\nComplications assessment:",
        plan: "Symptomatic treatment:\nAntibiotics consideration:\nReturn precautions:\nWork/school restrictions:\nFollow-up as needed:",
      },
      commonTerms: [
        "upper respiratory",
        "cough",
        "sore throat",
        "congestion",
        "viral",
        "sinusitis",
      ],
      icdCodeHints: ["J06.9", "J02.9", "J01.90", "R05"],
    },
    {
      id: "follow-up-chronic",
      name: "Chronic Disease Follow-up",
      specialty: "Internal Medicine",
      description: "Template for chronic disease management visits",
      sections: {
        subjective:
          "Interval history:\nMedication compliance:\nSymptom changes:\nLifestyle modifications:\nHome monitoring results:\nConcerns or questions:",
        objective:
          "Vital signs:\nGeneral appearance:\nSystemic examination:\nLaboratory review:\nGoal achievement assessment:",
        assessment:
          "Disease stability:\nComplications screening:\nGoal attainment:\nRisk factor modification:",
        plan: "Medication adjustments:\nLifestyle counseling:\nMonitoring plan:\nScreening schedule:\nNext appointment:",
      },
      commonTerms: [
        "chronic disease",
        "diabetes",
        "hypertension",
        "follow-up",
        "medication",
        "monitoring",
      ],
      icdCodeHints: ["E11.9", "I10", "E78.5", "Z51.81"],
    },
  ];

  getDefaultTemplates(): SOAPTemplate[] {
    return this.defaultTemplates;
  }

  getTemplatesBySpecialty(specialty: string): SOAPTemplate[] {
    return this.defaultTemplates.filter(
      (template) =>
        template.specialty === specialty || specialty === "General Practice",
    );
  }

  getTemplateById(id: string): SOAPTemplate | undefined {
    return this.defaultTemplates.find((template) => template.id === id);
  }

  // User template management (would integrate with Firebase in real implementation)
  saveUserTemplate(
    template: Omit<
      UserTemplate,
      "userId" | "createdAt" | "lastUsed" | "useCount"
    >,
  ): UserTemplate {
    const userTemplate: UserTemplate = {
      ...template,
      userId: "current-user", // Would get from auth context
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      useCount: 0,
    };

    // In real implementation, would save to Firebase
    this.saveToLocalStorage("userTemplates", userTemplate);

    return userTemplate;
  }

  getUserTemplates(): UserTemplate[] {
    // In real implementation, would fetch from Firebase
    return this.getFromLocalStorage("userTemplates") || [];
  }

  updateTemplateUsage(templateId: string): void {
    const userTemplates = this.getUserTemplates();
    const template = userTemplates.find((t) => t.id === templateId);

    if (template) {
      template.lastUsed = new Date().toISOString();
      template.useCount += 1;
      this.saveToLocalStorage("userTemplates", template);
    }
  }

  deleteUserTemplate(templateId: string): void {
    const userTemplates = this.getUserTemplates();
    const filteredTemplates = userTemplates.filter((t) => t.id !== templateId);
    localStorage.setItem("userTemplates", JSON.stringify(filteredTemplates));
  }

  // Template application logic
  applyTemplateToSOAP(template: SOAPTemplate, patientInfo: string): string {
    let enhancedPrompt = `Generate a SOAP note using the following template structure for ${template.specialty}:\n\n`;

    enhancedPrompt += `SUBJECTIVE Template:\n${template.sections.subjective}\n\n`;
    enhancedPrompt += `OBJECTIVE Template:\n${template.sections.objective}\n\n`;
    enhancedPrompt += `ASSESSMENT Template:\n${template.sections.assessment}\n\n`;
    enhancedPrompt += `PLAN Template:\n${template.sections.plan}\n\n`;

    enhancedPrompt += `Patient Information:\n${patientInfo}\n\n`;

    enhancedPrompt += `Common terms to consider: ${template.commonTerms.join(", ")}\n`;
    enhancedPrompt += `Relevant ICD codes to consider: ${template.icdCodeHints.join(", ")}\n\n`;

    if (template.customPrompt) {
      enhancedPrompt += `Special instructions: ${template.customPrompt}\n\n`;
    }

    enhancedPrompt += `Please fill in the template sections based on the patient information provided, maintaining professional medical documentation standards.`;

    return enhancedPrompt;
  }

  // Utility methods for local storage
  private saveToLocalStorage(key: string, data: any): void {
    try {
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const updated = Array.isArray(existing) ? [...existing, data] : [data];
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }

  private getFromLocalStorage(key: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
      console.error("Failed to get from localStorage:", error);
      return [];
    }
  }

  // Generate custom prompt for AI based on template
  generateTemplatePrompt(
    template: SOAPTemplate,
    patientInfo: string,
    specialty: string,
  ): string {
    return `You are generating a SOAP note for ${specialty} using a structured template approach.

Template: ${template.name}
Description: ${template.description}

Please structure your response according to these sections:
- SUBJECTIVE: ${template.sections.subjective}
- OBJECTIVE: ${template.sections.objective} 
- ASSESSMENT: ${template.sections.assessment}
- PLAN: ${template.sections.plan}

Patient Information:
${patientInfo}

Focus on these key terms: ${template.commonTerms.join(", ")}
Consider these ICD codes: ${template.icdCodeHints.join(", ")}

${template.customPrompt ? `Special considerations: ${template.customPrompt}` : ""}

Generate a comprehensive, professional SOAP note that follows the template structure while addressing the specific patient presentation.`;
  }
}

export const templatesService = TemplatesService.getInstance();
