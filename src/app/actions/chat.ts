"use server";

import { assistant, type AssistantInput } from "@/ai/flows/assistant-flow";

export async function getAssistantResponse(message: string): Promise<string> {
    const input: AssistantInput = { message };
    try {
        const response = await assistant(input);
        return response;
    } catch (error) {
        console.error("Error getting assistant response:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
}
