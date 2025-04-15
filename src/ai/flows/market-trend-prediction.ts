'use server';
/**
 * @fileOverview Predicts the trend of the US stock market using a Genkit flow.
 *
 * - predictMarketTrend - A function that predicts the market trend.
 * - MarketTrendPredictionInput - The input type for the predictMarketTrend function.
 * - MarketTrendPredictionOutput - The return type for the predictMarketTrend function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const MarketTrendPredictionInputSchema = z.object({
  marketNews: z.string().describe('Recent news headlines and articles related to the US stock market.'),
});
export type MarketTrendPredictionInput = z.infer<typeof MarketTrendPredictionInputSchema>;

const MarketTrendPredictionOutputSchema = z.object({
  trendPrediction: z.string().describe('A prediction of the US stock market trend (e.g., bullish, bearish, neutral).'),
  confidenceLevel: z.number().describe('A confidence level (0-1) indicating the certainty of the prediction.'),
  reasoning: z.string().describe('Explanation of the factors that justify the market trend prediction.'),
});
export type MarketTrendPredictionOutput = z.infer<typeof MarketTrendPredictionOutputSchema>;

export async function predictMarketTrend(input: MarketTrendPredictionInput): Promise<MarketTrendPredictionOutput> {
  return predictMarketTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketTrendPredictionPrompt',
  input: {
    schema: z.object({
      marketNews: z.string().describe('Recent news headlines and articles related to the US stock market.'),
    }),
  },
  output: {
    schema: z.object({
      trendPrediction: z.string().describe('A prediction of the US stock market trend (e.g., bullish, bearish, neutral).'),
      confidenceLevel: z.number().describe('A confidence level (0-1) indicating the certainty of the prediction.'),
      reasoning: z.string().describe('Explanation of the factors that justify the market trend prediction.'),
    }),
  },
  prompt: `You are an AI assistant that predicts the trend of the US stock market based on recent news.

  Analyze the following market news and predict the overall trend of the US stock market. Provide a confidence level (0-1) for your prediction and explain your reasoning.

  Market News:
  {{marketNews}}

  Your Prediction (JSON format):`,
});

const predictMarketTrendFlow = ai.defineFlow<
  typeof MarketTrendPredictionInputSchema,
  typeof MarketTrendPredictionOutputSchema
>({
  name: 'predictMarketTrendFlow',
  inputSchema: MarketTrendPredictionInputSchema,
  outputSchema: MarketTrendPredictionOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
