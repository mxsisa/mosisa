interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  addFromURI(src: string, weight?: number): void;
  addFromString(string: string, weight?: number): void;
}

interface SpeechGrammar {
  src: string;
  weight: number;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  grammars: SpeechGrammarList;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
  onnomatch:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface SpeechServiceOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  medicalMode?: boolean;
}

export interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  medicalTermsDetected: string[];
}

export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;
  private medicalTerms: Set<string> = new Set();

  constructor() {
    this.checkSupport();
    this.initializeMedicalTerms();
  }

  private checkSupport(): boolean {
    this.isSupported = !!(
      window.SpeechRecognition || window.webkitSpeechRecognition
    );
    return this.isSupported;
  }

  private initializeMedicalTerms(): void {
    // Comprehensive medical terms for better recognition
    const terms = [
      // Vital signs and measurements
      "blood pressure", "heart rate", "respiratory rate", "oxygen saturation", "temperature",
      "systolic", "diastolic", "bradycardia", "tachycardia", "hypertension", "hypotension",
      "pulse", "breathing", "vitals", "BP", "HR", "RR", "O2 sat", "temp",

      // Body parts and anatomy
      "head", "neck", "chest", "abdomen", "back", "arm", "leg", "hand", "foot", "shoulder",
      "elbow", "wrist", "hip", "knee", "ankle", "finger", "toe", "eye", "ear", "nose", "throat",
      "mouth", "tongue", "teeth", "gums", "heart", "lung", "liver", "kidney", "brain", "spine",
      "muscle", "bone", "joint", "skin", "hair", "nail", "breast", "groin", "pelvis",
      "cardiovascular", "respiratory", "gastrointestinal", "neurological", "musculoskeletal",
      "thorax", "extremities", "lymph nodes", "cardiac", "pulmonary", "renal", "hepatic",

      // Symptoms and complaints
      "pain", "ache", "sore", "hurt", "burning", "stabbing", "throbbing", "cramping",
      "chest pain", "shortness of breath", "abdominal pain", "headache", "nausea", "vomiting",
      "diarrhea", "constipation", "fatigue", "dizziness", "syncope", "palpitations",
      "fever", "chills", "sweating", "cough", "sneeze", "runny nose", "congestion",
      "swelling", "swollen", "inflammation", "bruising", "bleeding", "discharge",
      "rash", "itching", "numbness", "tingling", "weakness", "stiffness", "cramps",

      // Injuries and trauma
      "injury", "trauma", "wound", "cut", "laceration", "bruise", "contusion", "sprain",
      "strain", "fracture", "break", "dislocation", "burn", "bite", "sting", "scratch",
      "accident", "fall", "crash", "collision", "bicycle", "car", "motor vehicle",

      // Severity and descriptors
      "severe", "mild", "moderate", "intense", "sharp", "dull", "constant", "intermittent",
      "sudden", "gradual", "progressive", "chronic", "acute", "persistent", "occasional",
      "severity", "scale", "out of", "rating", "level", "degree",

      // Physical examination terms
      "examination", "inspect", "palpate", "auscultate", "percuss", "observe",
      "normal", "abnormal", "unremarkable", "remarkable", "positive", "negative",
      "murmur", "rales", "rhonchi", "wheeze", "clear", "diminished", "absent", "present",
      "tender", "non-tender", "soft", "hard", "enlarged", "mass", "nodule", "lesion",

      // Assessment and diagnosis
      "diagnosis", "differential", "rule out", "consistent with", "suggestive of",
      "probable", "possible", "likely", "unlikely", "exclude", "include", "consider",
      "stable", "improving", "worsening", "resolved", "ongoing", "new", "chronic",

      // Treatment and plan
      "treatment", "therapy", "medication", "medicine", "drug", "prescription",
      "antibiotics", "painkillers", "anti-inflammatory", "steroids", "insulin",
      "follow up", "referral", "consultation", "specialist", "return", "appointment",
      "laboratory", "lab", "blood work", "urine", "imaging", "scan", "x-ray", "CT", "MRI",
      "ultrasound", "EKG", "ECG", "biopsy", "culture", "test", "screening",

      // Medical procedures
      "surgery", "operation", "procedure", "injection", "IV", "catheter", "intubation",
      "suture", "stitch", "bandage", "dressing", "cast", "splint", "brace",

      // Common medications (expanded)
      "acetaminophen", "tylenol", "ibuprofen", "advil", "motrin", "aspirin", "naproxen",
      "aleve", "codeine", "morphine", "hydrocodone", "oxycodone", "tramadol",
      "lisinopril", "losartan", "amlodipine", "metoprolol", "atenolol", "hydrochlorothiazide",
      "metformin", "insulin", "glipizide", "glyburide", "januvia", "victoza",
      "amoxicillin", "azithromycin", "ciprofloxacin", "doxycycline", "penicillin",
      "albuterol", "prednisone", "prednisolone", "hydrocortisone", "methylprednisolone",
      "omeprazole", "pantoprazole", "ranitidine", "famotidine", "simvastatin", "atorvastatin",

      // Time and frequency terms
      "daily", "twice", "three times", "hourly", "weekly", "monthly", "as needed",
      "before meals", "after meals", "bedtime", "morning", "evening", "night",
      "days", "weeks", "months", "years", "hours", "minutes", "ago", "since", "for",

      // Quantities and measurements
      "mg", "grams", "ml", "cc", "units", "tablets", "capsules", "drops", "teaspoons",
      "tablespoons", "ounces", "pounds", "inches", "centimeters", "degrees", "percent",
    ];

    terms.forEach((term) => this.medicalTerms.add(term.toLowerCase()));
  }

  public isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  public startListening(
    onResult: (result: SpeechResult) => void,
    onError: (error: string) => void,
    options: SpeechServiceOptions = {},
  ): boolean {
    if (!this.isSupported) {
      onError(
        "Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.",
      );
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();

      // Configure recognition
      this.recognition.continuous = options.continuous ?? true;
      this.recognition.interimResults = options.interimResults ?? true;
      this.recognition.lang = options.language ?? "en-US";
      this.recognition.maxAlternatives = 3;

      // Event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        console.log("🎤 Speech recognition started");
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const confidence = result[0].confidence;

          if (result.isFinal) {
            finalTranscript += transcript;

            // Process final result
            const medicalTermsDetected = this.detectMedicalTerms(transcript);
            const processedTranscript = this.processMedicalText(transcript);

            onResult({
              transcript: processedTranscript,
              confidence: confidence || 0.9,
              isFinal: true,
              medicalTermsDetected,
            });
          } else {
            interimTranscript += transcript;

            // Process interim result
            onResult({
              transcript: interimTranscript,
              confidence: confidence || 0.5,
              isFinal: false,
              medicalTermsDetected: [],
            });
          }
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("🎤 Speech recognition error:", event.error);

        let errorMessage = "Speech recognition error occurred.";
        switch (event.error) {
          case "no-speech":
            errorMessage = "No speech detected. Please try speaking again.";
            break;
          case "audio-capture":
            errorMessage = "Microphone access denied or not available.";
            break;
          case "not-allowed":
            errorMessage =
              "Microphone permission denied. Please allow microphone access.";
            break;
          case "network":
            errorMessage = "Network error occurred during speech recognition.";
            break;
          case "service-not-allowed":
            errorMessage = "Speech recognition service not allowed.";
            break;
        }

        onError(errorMessage);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        console.log("🎤 Speech recognition ended");
      };

      // Start recognition
      this.recognition.start();
      return true;
    } catch (error) {
      console.error("���� Failed to start speech recognition:", error);
      onError("Failed to start speech recognition. Please try again.");
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      console.log("🎤 Speech recognition stopped");
    }
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  private detectMedicalTerms(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const detected: string[] = [];

    // Check for individual terms
    words.forEach((word) => {
      if (this.medicalTerms.has(word)) {
        detected.push(word);
      }
    });

    // Check for multi-word terms
    this.medicalTerms.forEach((term) => {
      if (term.includes(" ") && text.toLowerCase().includes(term)) {
        detected.push(term);
      }
    });

    return [...new Set(detected)]; // Remove duplicates
  }

  private processMedicalText(text: string): string {
    let processed = text;

    // Common medical abbreviation expansions
    const abbreviations: { [key: string]: string } = {
      bp: "blood pressure",
      hr: "heart rate",
      rr: "respiratory rate",
      "o2 sat": "oxygen saturation",
      temp: "temperature",
      bpm: "beats per minute",
      mg: "milligrams",
      ml: "milliliters",
      cc: "cubic centimeters",
      iv: "intravenous",
      po: "per oral",
      bid: "twice daily",
      tid: "three times daily",
      qid: "four times daily",
      prn: "as needed",
    };

    // Replace abbreviations (case insensitive)
    Object.entries(abbreviations).forEach(([abbrev, expansion]) => {
      const regex = new RegExp(`\\b${abbrev}\\b`, "gi");
      processed = processed.replace(regex, expansion);
    });

    // Capitalize medical terms properly
    processed = this.capitalizeMedicalTerms(processed);

    // Add proper punctuation
    processed = this.addMedicalPunctuation(processed);

    return processed;
  }

  private capitalizeMedicalTerms(text: string): string {
    // List of terms that should be capitalized
    const properNouns = [
      "Tylenol",
      "Advil",
      "Motrin",
      "Aleve",
      "Aspirin",
      "Lipitor",
      "Zocor",
      "Crestor",
      "Metformin",
      "Glucophage",
      "Lisinopril",
      "Enalapril",
      "Losartan",
      "Amlodipine",
    ];

    let processed = text;
    properNouns.forEach((term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      processed = processed.replace(regex, term);
    });

    return processed;
  }

  private addMedicalPunctuation(text: string): string {
    let processed = text;

    // Add periods after common abbreviations
    const abbreviationsNeedingPeriods = ["Dr", "Mr", "Mrs", "Ms"];
    abbreviationsNeedingPeriods.forEach((abbrev) => {
      const regex = new RegExp(`\\b${abbrev}\\b(?!\\.)`, "g");
      processed = processed.replace(regex, `${abbrev}.`);
    });

    return processed;
  }

  // Utility method to get user's preferred language
  public static getPreferredLanguage(): string {
    const language = navigator.language || "en-US";

    // Map to supported medical speech recognition languages
    const supportedLanguages: { [key: string]: string } = {
      en: "en-US",
      "en-US": "en-US",
      "en-GB": "en-GB",
      es: "es-ES",
      "es-ES": "es-ES",
      fr: "fr-FR",
      "fr-FR": "fr-FR",
      de: "de-DE",
      "de-DE": "de-DE",
      it: "it-IT",
      "it-IT": "it-IT",
    };

    return (
      supportedLanguages[language] ||
      supportedLanguages[language.split("-")[0]] ||
      "en-US"
    );
  }
}

export const speechService = new SpeechService();
