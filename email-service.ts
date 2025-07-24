import { auth } from "./firebase";

export interface InvitationData {
  inviteeEmail: string;
  inviteeName?: string;
  inviterName: string;
  inviterEmail: string;
  role: "admin" | "provider" | "viewer";
  clinicName?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class EmailService {
  private static instance: EmailService;

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Generate invitation email template
  generateInvitationEmail(data: InvitationData): {
    subject: string;
    htmlBody: string;
    textBody: string;
  } {
    const inviteLink = `${window.location.origin}/accept-invite?token=${this.generateInviteToken(data)}`;

    const subject = `You're invited to join ${data.clinicName || "our medical team"} on AutoSOAP AI`;

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AutoSOAP AI Team Invitation</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #16a085 0%, #0e7d6b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
            .cta-button { display: inline-block; padding: 15px 30px; background: #16a085; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .cta-button:hover { background: #138b75; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
            .role-badge { background: #e8f4f8; color: #0e7d6b; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏥 AutoSOAP AI</div>
                <h1>You're Invited to Join Our Medical Team!</h1>
            </div>
            
            <div class="content">
                <p>Hello${data.inviteeName ? ` ${data.inviteeName}` : ""},</p>
                
                <p><strong>${data.inviterName}</strong> (${data.inviterEmail}) has invited you to join ${data.clinicName || "their medical practice"} on <strong>AutoSOAP AI</strong> as a <span class="role-badge">${data.role.toUpperCase()}</span>.</p>
                
                <h3>🚀 What is AutoSOAP AI?</h3>
                <p>AutoSOAP AI is a professional medical documentation platform that transforms voice or text input into structured SOAP notes with ICD-10 codes in seconds. Join thousands of healthcare providers who have eliminated documentation burnout.</p>
                
                <h3>✨ What you'll get:</h3>
                <ul>
                    <li>🎤 <strong>Voice-to-SOAP:</strong> Speak naturally, get professional notes</li>
                    <li>🤖 <strong>AI-powered ICD-10:</strong> Automatic diagnostic code suggestions</li>
                    <li>⚡ <strong>Instant generation:</strong> Complete SOAP notes in under 30 seconds</li>
                    <li>📊 <strong>Team analytics:</strong> Track productivity and usage metrics</li>
                    <li>🔒 <strong>HIPAA-compliant:</strong> Enterprise-grade security for patient data</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${inviteLink}" class="cta-button">Accept Invitation & Get Started</a>
                </div>
                
                <p><strong>Your role permissions as ${data.role}:</strong></p>
                ${this.getRoleDescription(data.role)}
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
                
                <p><small><strong>Note:</strong> This invitation expires in 7 days. If you have any questions, please contact ${data.inviterName} at ${data.inviterEmail}.</small></p>
                
                <p><small>If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${inviteLink}">${inviteLink}</a></small></p>
            </div>
            
            <div class="footer">
                <p><strong>AutoSOAP AI</strong> - Eliminating Documentation Burnout for Modern Medical Practices</p>
                <p>This email was sent to ${data.inviteeEmail} by ${data.inviterEmail}</p>
                <p>© 2025 AutoSOAP AI. All rights reserved. | <a href="${window.location.origin}/privacy">Privacy Policy</a> | <a href="${window.location.origin}/terms">Terms of Service</a></p>
            </div>
        </div>
    </body>
    </html>`;

    const textBody = `
AutoSOAP AI Team Invitation

Hello${data.inviteeName ? ` ${data.inviteeName}` : ""},

${data.inviterName} (${data.inviterEmail}) has invited you to join ${data.clinicName || "their medical practice"} on AutoSOAP AI as a ${data.role.toUpperCase()}.

What is AutoSOAP AI?
AutoSOAP AI transforms voice or text input into structured SOAP notes with ICD-10 codes in seconds.

Accept your invitation: ${inviteLink}

Your role: ${data.role}
${this.getRoleDescriptionText(data.role)}

This invitation expires in 7 days.
Questions? Contact ${data.inviterName} at ${data.inviterEmail}

© 2025 AutoSOAP AI
`;

    return { subject, htmlBody, textBody };
  }

  private getRoleDescription(role: string): string {
    switch (role) {
      case "admin":
        return `<ul>
          <li>✅ Full access to all SOAP generation tools</li>
          <li>✅ Team management and user invitations</li>
          <li>✅ Billing and subscription management</li>
          <li>✅ Analytics and usage reports for entire team</li>
          <li>✅ Configure team settings and permissions</li>
        </ul>`;
      case "provider":
        return `<ul>
          <li>✅ Full access to SOAP generation tools</li>
          <li>✅ Voice-to-text input and AI processing</li>
          <li>✅ Personal SOAP note history and templates</li>
          <li>✅ Individual usage analytics</li>
          <li>❌ Cannot invite other users or manage billing</li>
        </ul>`;
      case "viewer":
        return `<ul>
          <li>✅ View team analytics and reports</li>
          <li>✅ Access shared SOAP templates</li>
          <li>❌ Cannot generate SOAP notes</li>
          <li>❌ Cannot invite users or manage team</li>
        </ul>`;
      default:
        return `<p>Role permissions will be configured by your team administrator.</p>`;
    }
  }

  private getRoleDescriptionText(role: string): string {
    switch (role) {
      case "admin":
        return "Full administrative access including team management, billing, and all SOAP generation features.";
      case "provider":
        return "Full access to SOAP generation tools with personal workspace and analytics.";
      case "viewer":
        return "View-only access to team analytics and shared resources.";
      default:
        return "Role permissions will be configured by your team administrator.";
    }
  }

  private generateInviteToken(data: InvitationData): string {
    // In production, this would be a secure JWT token with expiration
    return btoa(
      JSON.stringify({
        email: data.inviteeEmail,
        role: data.role,
        inviter: data.inviterEmail,
        timestamp: Date.now(),
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      }),
    );
  }

  // Send contact form email
  async sendContactForm(
    data: ContactFormData,
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🔄 Preparing contact form email...");

      const emailContent = this.generateContactEmail(data);

      // Simulate API call to email service
      await this.simulateContactEmailSend(emailContent, data);

      console.log("✅ Contact form email sent successfully!");

      return {
        success: true,
        message: `Your message has been sent to our support team. We'll respond within 24 hours.`,
      };
    } catch (error) {
      console.error("❌ Failed to send contact form:", error);
      return {
        success: false,
        message:
          "Failed to send message. Please try again or email us directly at support@autosoapai.com.",
      };
    }
  }

  // Generate contact form email template
  generateContactEmail(data: ContactFormData): {
    subject: string;
    htmlBody: string;
    textBody: string;
  } {
    const subject = `Contact Form: ${data.subject}`;

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AutoSOAP AI Contact Form Submission</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
            .message-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #3b82f6; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏥 AutoSOAP AI</div>
                <h1>New Contact Form Submission</h1>
            </div>

            <div class="content">
                <h3>📬 Contact Details:</h3>

                <div class="info-row">
                    <span class="label">Name:</span> ${data.name}
                </div>

                <div class="info-row">
                    <span class="label">Email:</span> ${data.email}
                </div>

                <div class="info-row">
                    <span class="label">Subject:</span> ${data.subject}
                </div>

                <div class="info-row">
                    <span class="label">Submitted:</span> ${new Date().toLocaleString()}
                </div>

                <h3>💬 Message:</h3>
                <div class="message-box">
                    ${data.message.replace(/\n/g, "<br>")}
                </div>

                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">

                <p><small><strong>Action Required:</strong> Please respond to ${data.name} at ${data.email} within 24 hours.</small></p>

                <p><small><strong>Reply Template:</strong><br>
                Hi ${data.name},<br><br>
                Thank you for contacting AutoSOAP AI. [Your response here]<br><br>
                Best regards,<br>
                AutoSOAP AI Support Team</small></p>
            </div>

            <div class="footer">
                <p><strong>AutoSOAP AI</strong> - Support Team Notification</p>
                <p>This email was generated from the contact form at ${window.location.origin}/contact</p>
                <p>© 2025 AutoSOAP AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    const textBody = `
AutoSOAP AI - New Contact Form Submission

Contact Details:
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
Submitted: ${new Date().toLocaleString()}

Message:
${data.message}

Action Required: Please respond to ${data.name} at ${data.email} within 24 hours.

© 2025 AutoSOAP AI Support Team
`;

    return { subject, htmlBody, textBody };
  }

  private async simulateContactEmailSend(
    emailContent: any,
    data: ContactFormData,
  ): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Log the email that would be sent (for demo purposes)
    console.log("📨 Contact Form Email Preview:", emailContent.subject);
    console.log("📧 To: support@autosoapai.com");
    console.log("📧 From:", `${data.name} <${data.email}>`);
    console.log("📧 Reply-To:", data.email);

    // In production, this would make an actual API call to your email service
    // The email would be sent TO: support@autosoapai.com
    // FROM: your-website@autosoapai.com
    // REPLY-TO: customer's email
  }

  // Send invitation email
  async sendInvitation(
    data: InvitationData,
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🔄 Preparing invitation email...");

      const emailContent = this.generateInvitationEmail(data);

      // In production, you would integrate with your email service here:
      // Option 1: Firebase Functions + SendGrid
      // Option 2: Firebase Functions + AWS SES
      // Option 3: Firebase Functions + Mailgun

      // For demo purposes, we'll simulate the email sending
      console.log("📧 Email Details:", {
        to: data.inviteeEmail,
        from: "team@autosoap.ai", // Your verified domain
        subject: emailContent.subject,
        replyTo: data.inviterEmail,
      });

      // Simulate API call to email service
      await this.simulateEmailSend(emailContent, data);

      console.log("✅ Invitation email sent successfully!");

      return {
        success: true,
        message: `Invitation sent to ${data.inviteeEmail}. They will receive an email with setup instructions.`,
      };
    } catch (error) {
      console.error("❌ Failed to send invitation:", error);
      return {
        success: false,
        message: "Failed to send invitation. Please try again.",
      };
    }
  }

  private async simulateEmailSend(
    emailContent: any,
    data: InvitationData,
  ): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Log the email that would be sent (for demo purposes)
    console.log("📨 Email Preview:", emailContent.subject);
    console.log("📧 Recipient:", data.inviteeEmail);
    console.log(
      "👤 From:",
      `${data.inviterName} via AutoSOAP AI <team@autosoap.ai>`,
    );

    // In production, replace this with actual email service integration:
    /*
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: data.inviteeEmail,
        from: 'team@autosoap.ai',
        replyTo: data.inviterEmail,
        subject: emailContent.subject,
        html: emailContent.htmlBody,
        text: emailContent.textBody
      })
    });
    */
  }

  // Email service configuration options
  getEmailServiceOptions(): {
    service: string;
    description: string;
    setup: string[];
    cost: string;
  }[] {
    return [
      {
        service: "Firebase Auth Email",
        description:
          "Built-in Firebase email templates (Recommended for quick start)",
        setup: [
          "Already configured with your Firebase project",
          "Customize email templates in Firebase Console",
          "HIPAA-compliant when properly configured",
        ],
        cost: "Free tier: 10K emails/month",
      },
      {
        service: "SendGrid",
        description: "Professional email service (Medical industry standard)",
        setup: [
          "Sign up at sendgrid.com",
          "Verify your domain (team@yourpractice.com)",
          "Add API key to environment variables",
          "Configure HIPAA-compliant settings",
        ],
        cost: "$15/month for 50K emails",
      },
      {
        service: "AWS SES",
        description: "Enterprise-grade Amazon email service",
        setup: [
          "Set up AWS SES account",
          "Verify your domain",
          "Configure IAM permissions",
          "Add credentials to environment",
        ],
        cost: "$0.10 per 1,000 emails",
      },
    ];
  }
}

export const emailService = EmailService.getInstance();
