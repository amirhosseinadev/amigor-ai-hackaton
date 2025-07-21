'use server';

/**
 * @fileOverview An AI agent that predicts significant odds changes based on market influences.
 *
 * - predictOddsChanges - A function that predicts odds changes.
 * - PredictOddsChangesInput - The input type for the predictOddsChanges function.
 * - PredictOddsChangesOutput - The return type for the predictOddsChanges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictOddsChangesInputSchema = z.object({
  currentOdds: z
    .number()
    .describe('The current odds for a specific betting market.'),
  marketInfluences: z
    .string()
    .describe(
      'A description of the market influences that could affect the odds, such as injuries, weather conditions, or news events.'
    ),
  historicalOdds: z
    .string()
    .describe('Historical odds data for the same betting market.'),
});
export type PredictOddsChangesInput = z.infer<typeof PredictOddsChangesInputSchema>;

const PredictOddsChangesOutputSchema = z.object({
  predictedChange: z
    .string()
    .describe(
      'A prediction of how the odds are likely to change, including the direction (increase or decrease) and magnitude of the change.'
    ),
  confidenceLevel: z
    .string()
    .describe(
      'A confidence level indicating the certainty of the predicted change, expressed as a percentage.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the prediction, including the market influences and historical data that support the prediction.'
    ),
});
export type PredictOddsChangesOutput = z.infer<typeof PredictOddsChangesOutputSchema>;

export async function predictOddsChanges(
  input: PredictOddsChangesInput
): Promise<PredictOddsChangesOutput> {
  return predictOddsChangesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictOddsChangesPrompt',
  input: {schema: PredictOddsChangesInputSchema},
  output: {schema: PredictOddsChangesOutputSchema},
  prompt: `You are an AI-powered sports betting analyst. Your task is to predict significant odds changes based on current odds, market influences, and historical data.

Analyze the following information to predict how the odds are likely to change:

Current Odds: {{{currentOdds}}}
Market Influences: {{{marketInfluences}}}
Historical Odds Data: {{{historicalOdds}}}

Provide a prediction of the odds change, a confidence level for the prediction, and the reasoning behind your prediction.

Consider factors such as:
- Injuries to key players
- Changes in weather conditions
- News events that may affect the outcome of the event
- Historical trends in odds movements for similar events

Output should include:
- predictedChange: A prediction of how the odds are likely to change, including the direction (increase or decrease) and magnitude of the change.
- confidenceLevel: A confidence level indicating the certainty of the predicted change, expressed as a percentage.
- reasoning: The reasoning behind the prediction, including the market influences and historical data that support the prediction.`,
});

const predictOddsChangesFlow = ai.defineFlow(
  {
    name: 'predictOddsChangesFlow',
    inputSchema: PredictOddsChangesInputSchema,
    outputSchema: PredictOddsChangesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
