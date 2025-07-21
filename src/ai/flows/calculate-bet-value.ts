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

const CalculateBetValueInputSchema = z.object({
  sport: z.string().describe('The sport the bet is on (e.g., football, basketball).'),
  betType: z.string().describe('The type of bet (e.g., moneyline, spread, over/under).'),
  odds: z.number().describe('The current odds for the bet.'),
  stake: z.number().describe('The amount of money being wagered.'),
  marketInfluences: z.string().describe('Any market influences affecting the odds (e.g., injury, weather).'),
});
export type CalculateBetValueInput = z.infer<typeof CalculateBetValueInputSchema>;

const CalculateBetValueOutputSchema = z.object({
  betValue: z.number().describe('The calculated value of the bet, considering odds and market influences.'),
  riskAssessment: z.string().describe('An assessment of the risk associated with the bet.'),
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
  prompt: `You are an AI assistant that calculates the potential value of sports bets.

  Consider the following information:

  Sport: {{{sport}}}
  Bet Type: {{{betType}}}
  Odds: {{{odds}}}
  Stake: {{{stake}}}
  Market Influences: {{{marketInfluences}}}

  Calculate the bet value, assess the risk, and suggest an action based on the information provided.
  Return the bet value as a number, the risk assessment as a string, and the suggested action as a string.
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
