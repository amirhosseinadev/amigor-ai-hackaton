"use server";

import {
  calculateBetValue as calculateBetValueFlow,
  type CalculateBetValueInput,
  type CalculateBetValueOutput,
} from "@/ai/flows/calculate-bet-value";
import {
  predictOddsChanges as predictOddsChangesFlow,
  type PredictOddsChangesInput,
  type PredictOddsChangesOutput,
} from "@/ai/flows/predict-odds-changes";

export async function calculateBetValue(
  input: CalculateBetValueInput
): Promise<CalculateBetValueOutput | { error: string }> {
  try {
    const result = await calculateBetValueFlow(input);
    return result;
  } catch (e) {
    console.error(e);
    return { error: "Failed to calculate bet value. Please try again." };
  }
}

export async function predictOddsChanges(
  input: PredictOddsChangesInput
): Promise<PredictOddsChangesOutput | { error: string }> {
  try {
    const result = await predictOddsChangesFlow(input);
    return result;
  } catch (e) {
    console.error(e);
    return { error: "Failed to predict odds changes. Please try again." };
  }
}
