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
  prompt: `You are a data analyst specializing in sports betting. Your task is to analyze a user's bet history and generate insights that are **strictly relevant** to the provided 'Current Bet Context'.

Bet History:
{{{json betHistory}}}

Current Bet Context:
{{{json currentBetContext}}}

Your task is to:
1.  **Filter the Bet History**: Only consider bets that match the **sport** in the 'Current Bet Context'.
2.  **Identify Relevant Patterns**: From the filtered history, find patterns related ONLY to the following criteria from the 'Current Bet Context':
    *   Bets involving 'teamA' ({{currentBetContext.teamA}}).
    *   Bets involving 'teamB' ({{currentBetContext.teamB}}).
    *   Bets placed under similar 'marketInfluences' ({{currentBetContext.marketInfluences}}).
    *   Bets of a specific 'betType' if it's a strong pattern for the involved teams or conditions.
3.  **Generate Insights**: For each identified relevant pattern, if it is based on 2 or more bets, calculate the win rate and provide a summary.
4.  **Overall Summary**: Create a concise overall summary of the user's performance specifically related to the context of this match.
5.  **Be Strict**: If no relevant historical patterns are found (e.g., the user has never bet on these teams, this sport, or under these conditions), the 'insights' array should be empty. Do not provide generic or irrelevant insights.

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
