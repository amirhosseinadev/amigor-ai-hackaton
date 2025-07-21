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
  riskAssessment: z.string().describe('An assessment of the risk associated with the bet, based on match and market factors.'),
  stakeAnalysis: z.string().describe("An analysis of the user's current stake compared to their historical average, min, and max stakes. This message should start with 'Warning:' if the stake is higher than their historical maximum."),
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

  1.  **Analyze the Bet**: Consider the following information to calculate the bet value, assess the primary risk, and suggest an action. The risk assessment should focus only on match and market factors.
      *   Sport: {{{sport}}}
      *   Bet Type: {{{betType}}}
      *   Odds: {{{odds}}}
      *   Market Influences: {{{marketInfluences}}}
      *   User's Historical Bet Analysis: {{{userHistoryAnalysis}}}

  2.  **Analyze the Stake**:
      *   From the full bet history provided, calculate the user's minimum, maximum, and average stake.
      *   Compare the current 'Stake' ({{{stake}}}) to these historical values.
      *   Generate a concise 'stakeAnalysis' message. If the current stake is higher than their historical maximum, prepend "Warning:" to this message. Otherwise, provide a neutral, informative comparison. For example: "This stake of $50 is in line with your average of $45." or "Warning: This stake of $200 is significantly above your usual maximum of $100."

  Return the calculated bet value, the market/match-based risk assessment, the separate stake analysis, and a suggested action.

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
