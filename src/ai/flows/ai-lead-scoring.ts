// src/ai/flows/ai-lead-scoring.ts
'use server';

/**
 * @fileOverview AI-driven lead scoring flow to predict the likelihood of lead conversion.
 *
 * - aiScoreLeads - Function to score leads based on their characteristics and engagement.
 * - AiScoreLeadsInput - Input type for the aiScoreLeads function.
 * - AiScoreLeadsOutput - Output type for the aiScoreLeads function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiScoreLeadsInputSchema = z.object({
  leadData: z.string().describe('JSON string containing lead data, including characteristics and engagement metrics.'),
});
export type AiScoreLeadsInput = z.infer<typeof AiScoreLeadsInputSchema>;

const AiScoreLeadsOutputSchema = z.object({
  score: z.number().describe('The predicted likelihood of lead conversion, ranging from 0 to 1.'),
  reasons: z.array(z.string()).describe('An array of reasons supporting the assigned score.'),
});
export type AiScoreLeadsOutput = z.infer<typeof AiScoreLeadsOutputSchema>;

export async function aiScoreLeads(input: AiScoreLeadsInput): Promise<AiScoreLeadsOutput> {
  return aiScoreLeadsFlow(input);
}

const aiScoreLeadsPrompt = ai.definePrompt({
  name: 'aiScoreLeadsPrompt',
  input: {schema: AiScoreLeadsInputSchema},
  output: {schema: AiScoreLeadsOutputSchema},
  prompt: `You are an AI-powered lead scoring system designed to analyze lead data and predict the likelihood of conversion.

  Analyze the following lead data:
  {{leadData}}

  Based on the data, provide a score between 0 and 1 representing the likelihood of conversion.
  Also, provide an array of reasons supporting the assigned score.

  Ensure that the score and reasons are based on the provided lead data.
  Return the score as a floating point number, and reasons as a string array.
  Do not use any external data other than what is provided.  Do not make up data.
  If the leadData input is an empty JSON object, return a score of 0 and an empty reasons array.
  `,
});

const aiScoreLeadsFlow = ai.defineFlow(
  {
    name: 'aiScoreLeadsFlow',
    inputSchema: AiScoreLeadsInputSchema,
    outputSchema: AiScoreLeadsOutputSchema,
  },
  async input => {
    try {
      const leadData = JSON.parse(input.leadData);

       //If leadData is an empty object, return a score of 0 and an empty reasons array.
      if (Object.keys(leadData).length === 0) {
        return {
          score: 0,
          reasons: [],
        };
      }

      const {output} = await aiScoreLeadsPrompt(input);
      return output!;
    } catch (e) {
      console.error('Error parsing lead data or during prompt execution:', e);
      return {
        score: 0,
        reasons: ['Error processing lead data.'],
      };
    }
  }
);
