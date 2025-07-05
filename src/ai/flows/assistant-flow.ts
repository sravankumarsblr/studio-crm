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
import { getPipelineSummary } from '@/ai/tools/reporting-tools';

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
  tools: [getPipelineSummary],
  system: `You are Cal, a friendly and helpful AI assistant for the CalTrack CRM.

Your primary goal is to help users by answering questions about their sales data and performing actions within the CRM.

You can answer questions about the sales pipeline, like "what is my conversion rate?" or "what's the total value of won opportunities?". Use the tools provided to get this information.

When asked to create leads, opportunities, or contracts, for now, you should inform the user that this functionality is coming soon.

Keep your responses concise and helpful.`,
  prompt: `{{message}}`,
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
