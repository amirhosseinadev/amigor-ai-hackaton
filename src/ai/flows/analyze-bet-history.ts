'use server';

/**
 * @fileOverview Analyzes a user's betting history to find patterns and insights.
 *
 * - analyzeBetHistory - A function that analyzes bet history.
 * - AnalyzeBetHistoryInput - The input type for the analyzeBetHistory function.
 * - AnalyzeBetHistoryOutput - The return type for the analyzeBetHistory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
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


const AnalyzeBetHistoryInputSchema = z.object({
  betHistory: z.array(BetHistoryItemSchema).describe("The user's past bets."),
  currentBetContext: z.object({
      sport: z.string(),
      teamA: z.string(),
      teamB: z.string(),
      marketInfluences: z.string()
  }).describe("The context of the current bet being considered.")
});
export type AnalyzeBetHistoryInput = z.infer<typeof AnalyzeBetHistoryInputSchema>;

const InsightSchema = z.object({
  condition: z.string().describe("The specific condition being analyzed (e.g., 'Bets on Real Madrid', 'Bets in Rainy Weather')."),
  winRate: z.string().describe("The win rate for this condition, as a percentage (e.g., '75%')."),
  summary: z.string().describe("A short, human-readable summary of the user's performance under this condition (e.g., 'You have a strong record when betting on this team.')."),
  betsAnalyzed: z.number().describe("The number of bets that match this condition.")
});

const AnalyzeBetHistoryOutputSchema = z.object({
  overallSummary: z.string().describe("A concise, overall summary of the user's betting patterns to be used in other AI prompts."),
  insights: z.array(InsightSchema).describe("A list of specific, actionable insights derived from the user's betting history."),
});
export type AnalyzeBetHistoryOutput = z.infer<typeof AnalyzeBetHistoryOutputSchema>;


export async function analyzeBetHistory(
  input: AnalyzeBetHistoryInput
): Promise<AnalyzeBetHistoryOutput> {
  return analyzeBetHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBetHistoryPrompt',
  input: { schema: AnalyzeBetHistoryInputSchema },
  output: { schema: AnalyzeBetHistoryOutputSchema },
  prompt: `You are a data analyst specializing in sports betting. Analyze the provided user bet history to identify recurring patterns, calculate win/loss rates for specific conditions, and generate descriptive insights.

Bet History:
{{{json betHistory}}}

Current Bet Context:
{{{json currentBetContext}}}

Your task is to:
1.  **Analyze the entire bet history** for patterns. Look for trends related to specific teams, sports, bet types, and market conditions (like 'Rainy', 'Key Injury', etc.).
2.  **Calculate win rates** for the most significant patterns you find. For a condition to be significant, it should appear in at least 2 bets.
3.  **Generate a concise, human-readable summary** for each significant pattern (e.g., "You tend to win when betting on Team A," "You often lose when betting on Over/Under in Basketball").
4.  **Create an overall summary** of the user's historical performance that can be fed into another AI model. This summary should highlight the user's strongest and weakest areas relevant to the current bet context.
5.  **Focus on insights that are relevant** to the 'Current Bet Context'. For example, if the user is looking at a soccer match, prioritize insights about soccer. If a team from their history is in the current match, provide insights on that team.

Provide the analysis in the specified output format.
`,
});

const analyzeBetHistoryFlow = ai.defineFlow(
  {
    name: 'analyzeBetHistoryFlow',
    inputSchema: AnalyzeBetHistoryInputSchema,
    outputSchema: AnalyzeBetHistoryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
