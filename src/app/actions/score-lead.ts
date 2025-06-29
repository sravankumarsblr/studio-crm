"use server";

import { aiScoreLeads, type AiScoreLeadsInput, type AiScoreLeadsOutput } from "@/ai/flows/ai-lead-scoring";

export async function scoreLead(input: AiScoreLeadsInput): Promise<AiScoreLeadsOutput> {
  // Add a delay to simulate network latency for a better UX demo
  await new Promise(resolve => setTimeout(resolve, 1500));
  try {
    return await aiScoreLeads(input);
  } catch (error) {
    console.error("Error in scoreLead action:", error);
    // Ensure a structured error is returned that the client can handle
    return {
      score: 0,
      reasons: ["An unexpected error occurred while scoring the lead. Please check the server logs."],
    };
  }
}
