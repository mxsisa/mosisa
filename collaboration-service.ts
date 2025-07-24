import { SOAPResult } from "./soap-service";

export interface SharedSOAP {
  id: string;
  soapResult: SOAPResult;
  sharedBy: {
    id: string;
    name: string;
    email: string;
  };
  sharedWith: string[]; // Array of user IDs or emails
  shareLevel: "view" | "comment" | "edit";
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  tags: string[];
  isTemplate: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  section?: "subjective" | "objective" | "assessment" | "plan" | "icd";
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "provider" | "resident" | "nurse";
  specialty: string;
  joinedAt: string;
  lastActive: string;
}

export class CollaborationService {
  private static instance: CollaborationService;

  static getInstance(): CollaborationService {
    if (!CollaborationService.instance) {
      CollaborationService.instance = new CollaborationService();
    }
    return CollaborationService.instance;
  }

  // Share SOAP note with team members
  async shareSOAPNote(
    soapResult: SOAPResult,
    sharedWith: string[],
    shareLevel: "view" | "comment" | "edit" = "view",
    tags: string[] = [],
  ): Promise<SharedSOAP> {
    try {
      const sharedSOAP: SharedSOAP = {
        id: this.generateId(),
        soapResult,
        sharedBy: {
          id: "current-user",
          name: "Current User",
          email: "user@example.com",
        },
        sharedWith,
        shareLevel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        tags,
        isTemplate: false,
      };

      // In real implementation, would save to Firebase
      this.saveToLocalStorage("sharedSOAPs", sharedSOAP);

      return sharedSOAP;
    } catch (error) {
      console.error("Failed to share SOAP note:", error);
      throw new Error("Failed to share SOAP note");
    }
  }

  // Get shared SOAP notes
  getSharedSOAPs(): SharedSOAP[] {
    try {
      return this.getFromLocalStorage("sharedSOAPs") || [];
    } catch (error) {
      console.error("Failed to get shared SOAPs:", error);
      return [];
    }
  }

  // Get team members (mock data for now)
  getTeamMembers(): TeamMember[] {
    return [
      {
        id: "tm1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@clinic.com",
        role: "provider",
        specialty: "Internal Medicine",
        joinedAt: "2024-01-15T00:00:00Z",
        lastActive: "2024-01-20T10:30:00Z",
      },
      {
        id: "tm2",
        name: "Dr. Michael Chen",
        email: "michael.chen@clinic.com",
        role: "provider",
        specialty: "Emergency Medicine",
        joinedAt: "2024-01-10T00:00:00Z",
        lastActive: "2024-01-20T15:45:00Z",
      },
      {
        id: "tm3",
        name: "Nurse Patricia Williams",
        email: "patricia.williams@clinic.com",
        role: "nurse",
        specialty: "General Practice",
        joinedAt: "2023-12-01T00:00:00Z",
        lastActive: "2024-01-20T09:15:00Z",
      },
      {
        id: "tm4",
        name: "Dr. James Resident",
        email: "james.resident@clinic.com",
        role: "resident",
        specialty: "Family Medicine",
        joinedAt: "2024-01-01T00:00:00Z",
        lastActive: "2024-01-20T14:20:00Z",
      },
    ];
  }

  // Add comment to shared SOAP
  addComment(
    sharedSOAPId: string,
    content: string,
    section?: "subjective" | "objective" | "assessment" | "plan" | "icd",
  ): Comment {
    const comment: Comment = {
      id: this.generateId(),
      userId: "current-user",
      userName: "Current User",
      content,
      timestamp: new Date().toISOString(),
      section,
    };

    // Update the shared SOAP with new comment
    const sharedSOAPs = this.getSharedSOAPs();
    const targetSOAP = sharedSOAPs.find((s) => s.id === sharedSOAPId);

    if (targetSOAP) {
      targetSOAP.comments.push(comment);
      targetSOAP.updatedAt = new Date().toISOString();
      localStorage.setItem("sharedSOAPs", JSON.stringify(sharedSOAPs));
    }

    return comment;
  }

  // Convert shared SOAP to template
  convertToTemplate(sharedSOAPId: string, templateName: string): void {
    const sharedSOAPs = this.getSharedSOAPs();
    const targetSOAP = sharedSOAPs.find((s) => s.id === sharedSOAPId);

    if (targetSOAP) {
      targetSOAP.isTemplate = true;
      targetSOAP.tags = [...targetSOAP.tags, "template", templateName];
      targetSOAP.updatedAt = new Date().toISOString();
      localStorage.setItem("sharedSOAPs", JSON.stringify(sharedSOAPs));
    }
  }

  // Generate sharing link
  generateSharingLink(sharedSOAPId: string): string {
    return `${window.location.origin}/shared/${sharedSOAPId}`;
  }

  // Export shared SOAP for external use
  exportSharedSOAP(
    sharedSOAP: SharedSOAP,
    format: "text" | "pdf" | "json" = "text",
  ): string {
    switch (format) {
      case "json":
        return JSON.stringify(sharedSOAP, null, 2);

      case "text":
        let content = `SHARED SOAP NOTE\n${"=".repeat(50)}\n\n`;
        content += `Shared by: ${sharedSOAP.sharedBy.name}\n`;
        content += `Created: ${new Date(sharedSOAP.createdAt).toLocaleString()}\n`;
        content += `Tags: ${sharedSOAP.tags.join(", ")}\n\n`;

        content += sharedSOAP.soapResult.soapNote;

        if (sharedSOAP.comments.length > 0) {
          content += `\n\nCOMMENTS\n${"=".repeat(20)}\n`;
          sharedSOAP.comments.forEach((comment) => {
            content += `\n${comment.userName} (${new Date(comment.timestamp).toLocaleString()}):\n`;
            content += `${comment.content}\n`;
          });
        }

        return content;

      default:
        return sharedSOAP.soapResult.soapNote;
    }
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

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
}

export const collaborationService = CollaborationService.getInstance();
