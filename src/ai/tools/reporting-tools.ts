'use server';
/**
 * @fileOverview Tools for reporting and data analysis.
 * - getPipelineSummary - A tool to retrieve key sales pipeline metrics.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {opportunities as allOpportunities} from '@/lib/data';

const PipelineSummarySchema = z.object({
    totalOpenValue: z.number().describe("Total value of all open opportunities."),
    totalWonValue: z.number().describe("Total value of all opportunities marked as 'Won'."),
    totalLostValue: z.number().describe("Total value of all opportunities marked as 'Lost'."),
    conversionRate: z.number().describe("The conversion rate, calculated as Won / (Won + Lost)."),
    openOpportunitiesCount: z.number().describe("The number of open opportunities."),
    wonOpportunitiesCount: z.number().describe("The number of won opportunities."),
    lostOpportunitiesCount: z.number().describe("The number of lost opportunities."),
});

export const getPipelineSummary = ai.defineTool(
    {
        name: 'getPipelineSummary',
        description: 'Calculates and returns key metrics for the sales pipeline, such as total values and conversion rates.',
        inputSchema: z.object({}), // No input needed
        outputSchema: PipelineSummarySchema,
    },
    async () => {
        const openOpportunities = allOpportunities.filter(o => o.status === 'New' || o.status === 'In Progress');
        const wonOpportunities = allOpportunities.filter(o => o.status === 'Won');
        const lostOpportunities = allOpportunities.filter(o => o.status === 'Lost');
        
        const totalOpenValue = openOpportunities.reduce((sum, o) => sum + o.value, 0);
        const totalWonValue = wonOpportunities.reduce((sum, o) => sum + o.value, 0);
        const totalLostValue = lostOpportunities.reduce((sum, o) => sum + o.value, 0);

        const conversionRate = allOpportunities.length > 0 && (wonOpportunities.length + lostOpportunities.length > 0)
          ? wonOpportunities.length / (wonOpportunities.length + lostOpportunities.length)
          : 0;
        
        return {
            totalOpenValue,
            totalWonValue,
            totalLostValue,
            conversionRate,
            openOpportunitiesCount: openOpportunities.length,
            wonOpportunitiesCount: wonOpportunities.length,
            lostOpportunitiesCount: lostOpportunities.length,
        };
    }
);
