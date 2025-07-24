import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { handleDemo } from "./routes/demo";
import { createCheckoutSession, handleStripeWebhook } from "./routes/stripe";
import { generateSOAP } from "./routes/openai";
import { getSubscriptionStatus, cancelSubscription, createCheckoutSession as createSubscriptionCheckout } from "./routes/subscription";
// Load environment variables from .env file
config();

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Stripe routes
  app.post("/api/create-checkout-session", createCheckoutSession);

  // Stripe webhook - needs raw body for signature verification
  app.post(
    "/api/stripe-webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook,
  );

  // OpenAI SOAP generation routes
  app.post("/api/generate-soap", generateSOAP);

  // Subscription endpoints
  app.get("/api/subscription/status", getSubscriptionStatus);
  app.post("/api/subscription/cancel", cancelSubscription);
  app.post("/api/subscription/create-checkout", createSubscriptionCheckout);

  // Simple test endpoint
  app.get("/api/test", (req, res) => {
    console.log("🧪 TEST endpoint called");
    res.json({ status: "working", timestamp: new Date().toISOString() });
    console.log("🧪 TEST endpoint response sent");
  });

  return app;
}
