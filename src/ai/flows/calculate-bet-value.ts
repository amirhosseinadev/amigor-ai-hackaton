'use server';

/**
 * @fileOverview Calculates the potential value of a bet based on current odds and other factors.
 *
 * - calculateBetValue - A function that calculates the bet value.
 * - CalculateBetValueInput - The input type for the calculateBetValue function.
 * - CalculateBetValueOutput - The return type for the calculateBetValue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Bet } from '@/lib/types';

const BetHistoryItemSchema = z.object({
  id: z.string(),
  sport: z.string(),
  event: z.string(),
  betType: z.string(),
  betOn: z.string(),
  stake: z.number(),
  odds: z.number(),
  outcome: z.enum(['win', 'loss']),
  date: z.string(),
  marketCondition: z.string().optional(),
});


const CalculateBetValueInputSchema = z.object({
  sport: z.string().describe('The sport the bet is on (e.g., football, basketball).'),
  betType: z.string().describe('The type of bet (e.g., moneyline, spread, over/under).'),
  odds: z.number().describe('The current odds for the bet.'),
  stake: z.number().describe('The amount of money being wagered.'),
  marketInfluences: z.string().describe('Any market influences affecting the odds (e.g., injury, weather).'),
  userHistoryAnalysis: z.string().describe('An AI-generated analysis of the user\'s historical betting patterns and performance related to this type of bet.'),
  betHistory: z.array(BetHistoryItemSchema).describe("The user's full past betting history.")
});
export type CalculateBetValueInput = z.infer<typeof CalculateBetValueInputSchema>;

const CalculateBetValueOutputSchema = z.object({
  betValue: z.number().describe('The calculated value of the bet, considering odds and market influences.'),
  riskAssessment: z.string().describe('An assessment of the risk associated with the bet. This should also include an analysis of the user\'s stake compared to their historical average, min, and max stakes.'),
  suggestedAction: z.string().describe('A suggested action based on the bet value and risk (e.g., place bet, wait for better odds).'),
});
export type CalculateBetValueOutput = z.infer<typeof CalculateBetValueOutputSchema>;

export async function calculateBetValue(input: CalculateBetValueInput): Promise<CalculateBetValueOutput> {
  return calculateBetValueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateBetValuePrompt',
  input: {schema: CalculateBetValueInputSchema},
  output: {schema: CalculateBetValueOutputSchema},
  prompt: `You are an AI assistant that calculates the potential value of sports bets and provides risk assessment.

  1.  **Analyze the Bet**: Consider the following information to calculate the bet value, assess the primary risk, and suggest an action.
      *   Sport: {{{sport}}}
      *   Bet Type: {{{betType}}}
      *   Odds: {{{odds}}}
      *   Stake: {{{stake}}}
      *   Market Influences: {{{marketInfluences}}}
      *   User's Historical Bet Analysis: {{{userHistoryAnalysis}}}

  2.  **Analyze the Stake**:
      *   From the full bet history, calculate the user's minimum, maximum, and average stake.
      *   Compare the current 'Stake' ({{{stake}}}) to these historical values.
      *   If the current stake is higher than their historical maximum, prepend a "Warning:" to your risk assessment.
      *   If the current stake is NOT higher than the maximum, provide a neutral, informative comparison.

  3.  **Combine and Finalize the Risk Assessment**:
      *   Combine your primary risk assessment (from step 1) with your stake analysis (from step 2) into a single, coherent 'riskAssessment' string.
      *   For example: "Medium risk. The team is in good form, but the key player's fitness is a concern. Your stake of $50 is higher than your historical average of $25."
      *   Another example: "Warning: High risk. This stake of $200 is significantly above your usual maximum of $100. The market is also volatile for this match."

  Return the calculated bet value, the final combined risk assessment, and the suggested action.

  Full Bet History (for stake analysis):
  {{{json betHistory}}}
`,
});

const calculateBetValueFlow = ai.defineFlow(
  {
    name: 'calculateBetValueFlow',
    inputSchema: CalculateBetValueInputSchema,
    outputSchema: CalculateBetValueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
