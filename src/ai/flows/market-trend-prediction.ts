'use server';
/**
 * @fileOverview Predicts the trend of the US stock market using a Genkit flow,
 * incorporating real-time data from Financial Modeling Prep API.
 *
 * - predictMarketTrend - A function that predicts the market trend.
 * - MarketTrendPredictionInput - The input type for the predictMarketTrend function.
 * - MarketTrendPredictionOutput - The return type for the predictMarketTrend function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import fetch from 'node-fetch';

const MarketTrendPredictionInputSchema = z.object({
  stockSymbol: z.string().describe('The stock symbol to predict the trend for (e.g., PLTR).'),
});

export type MarketTrendPredictionInput = z.infer<typeof MarketTrendPredictionInputSchema>;

const MarketTrendPredictionOutputSchema = z.object({
  trendPrediction: z.string().describe('A prediction of the US stock market trend (e.g., bullish, bearish, neutral).'),
  confidenceLevel: z.number().describe('A confidence level (0-1) indicating the certainty of the prediction.'),
  reasoning: z.string().describe('Explanation of the factors that justify the market trend prediction.'),
});

export type MarketTrendPredictionOutput = z.infer<typeof MarketTrendPredictionOutputSchema>;

async function getStockData(symbol: string) {
  const apiKey = process.env.FINANCIAL_API_KEY;
  const apiUrl = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data && data.length > 0) {
      return data[0]; // Return the first quote
    } else {
      console.warn(`No data found for symbol ${symbol}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null;
  }
}

async function getStockNews(symbol: string) {
  const apiKey = process.env.FINANCIAL_API_KEY;
    const apiUrl = `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.slice(0, 5); // Limit to 5 news articles
  } catch (error) {
    console.error("Error fetching stock news:", error);
    return [];
  }
}


export async function predictMarketTrend(input: MarketTrendPredictionInput): Promise<MarketTrendPredictionOutput> {
  return predictMarketTrendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketTrendPredictionPrompt',
  input: {
    schema: z.object({
      stockSymbol: z.string().describe('The stock symbol to predict the trend for (e.g., PLTR).'),
      stockData: z.string().describe('Real-time data for the stock symbol.'),
      stockNews: z.string().describe('Recent news headlines and articles related to the stock symbol.'),
    }),
  },
  output: {
    schema: z.object({
      trendPrediction: z.string().describe('A prediction of the stock market trend (e.g., bullish, bearish, neutral).'),
      confidenceLevel: z.number().describe('A confidence level (0-1) indicating the certainty of the prediction.'),
      reasoning: z.string().describe('Explanation of the factors that justify the market trend prediction.'),
    }),
  },
  prompt: `You are an AI assistant that predicts the trend of a specific stock based on real-time data and recent news.
    
  Analyze the following real-time stock data and recent news, then predict the trend for the stock {{stockSymbol}}. Provide a confidence level (0-1) for your prediction and explain your reasoning. Please provide the prediction and reasoning in Traditional Chinese.
  
  Real-time Stock Data:
  {{stockData}}
  
  Recent News:
  {{stockNews}}
  
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
  const stockData = await getStockData(input.stockSymbol);
  const stockNews = await getStockNews(input.stockSymbol);

  if (!stockData) {
    throw new Error(`Failed to retrieve stock data for ${input.stockSymbol}.`);
  }

  const formattedStockData = JSON.stringify(stockData, null, 2);
  const formattedStockNews = stockNews.map(news => `${news.title}: ${news.summary}`).join('\n');
    
  const { output } = await prompt({
    stockSymbol: input.stockSymbol,
    stockData: formattedStockData,
    stockNews: formattedStockNews,
  });
  return output!;
});
