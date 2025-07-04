// src/ai/flows/assistant-flow.ts
'use server';

/**
 * @fileOverview A conversational AI assistant for the CRM.
 *
 * - assistantFlow - The main entry point for the assistant.
 * - AssistantInput - The input type for the assistantFlow function.
 * - AssistantOutput - The return type for the assistantFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistantInputSchema = z.object({
  message: z.string().describe('The user\'s message to the assistant.'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

export type AssistantOutput = string;

export async function assistant(input: AssistantInput): Promise<AssistantOutput> {
  return assistantFlow(input);
}

const assistantPrompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: {schema: AssistantInputSchema},
  prompt: `You are Cal, a friendly and helpful AI assistant for the CalTrack CRM.

Your primary goal is to help users by performing actions within the CRM, such as creating leads, opportunities, and contracts.

For now, these tools are not available. Your current capability is to have a friendly conversation. Inform the user what you will be able to do soon (create leads, opportunities, and contracts) and then answer their current message.

Keep your responses concise and helpful.

User's message:
{{message}}`,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const response = await assistantPrompt(input);
    return response.text;
  }
);
