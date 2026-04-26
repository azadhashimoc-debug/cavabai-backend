import OpenAI from "openai";

import { AppError } from "@/lib/response";

let openaiClient: OpenAI | null = null;

export function getOpenAIClient() {
  if (openaiClient) {
    return openaiClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new AppError(500, "OPENAI_API_KEY_MISSING", "OpenAI API key is not configured");
  }

  openaiClient = new OpenAI({ apiKey });

  return openaiClient;
}

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
}
