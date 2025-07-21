import { config } from 'dotenv';
config();

import '@/ai/flows/predict-odds-changes.ts';
import '@/ai/flows/calculate-bet-value.ts';
import '@/ai/flows/analyze-bet-history.ts';
