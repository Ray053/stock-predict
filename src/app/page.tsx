'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StockData, getTopGainers, getTopLosers } from "@/services/yfinance";
import { useEffect, useState } from "react";
import { MarketTrendPredictionOutput, predictMarketTrend } from "@/ai/flows/market-trend-prediction";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { HistoricalDataPoint, getHistoricalData } from "@/services/yfinance";
import { ModeToggle } from "@/components/mode-toggle";
import { Icons } from "@/components/icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils";
import { unstable_cache } from 'next/cache';

interface NewsHeadline {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

const LoadingCard = () => (
  <Card className="col-span-3 md:col-span-1 flex flex-col justify-center items-center">
    <Skeleton className="w-40 h-8 mb-2" />
    <Skeleton className="w-24 h-6" />
  </Card>
);

const StockCard = ({ stock, isGain }: { stock: StockData; isGain: boolean }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        const data = await getHistoricalData(stock.symbol, "1mo");
        setHistoricalData(data);
      } catch (error) {
        console.error("Failed to fetch historical data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [stock.symbol]);

  const chartConfig = {
    closingPrice: {
      label: "Closing Price",
      color: isGain ? "hsl(var(--chart-1))" : "hsl(var(--destructive))",
    },
    date: {
      label: "Date",
    },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{stock.name}</CardTitle>
        <CardDescription>{stock.symbol}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-2xl font-bold">{stock.price.toFixed(2)}</div>
        <div className={`text-sm ${isGain ? "text-green-500" : "text-red-500"}`}>
          {stock.changePercent.toFixed(2)}%
        </div>
        {loading ? (
          <Skeleton className="w-full h-32" />
        ) : (
          <ResponsiveContainer width="100%" height={100}>
          <LineChart data={historicalData}>
            <Line type="monotone" dataKey="closingPrice" stroke={isGain ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"} strokeWidth={2} dot={false} />
            <Tooltip />
            <XAxis dataKey="date"  />
            <YAxis  />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

async function fetchStockNewsHeadlines(): Promise<NewsHeadline[]> {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
        console.error("NEWS_API_KEY is not set in environment variables.");
        return [];
    }

    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error(`Failed to fetch news headlines: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        if (data.status === 'ok' && data.articles) {
            return data.articles.map((article: any) => ({
                source: {
                    id: article.source.id || null,
                    name: article.source.name || "Unknown",
                },
                author: article.author || null,
                title: article.title || "No Title",
                description: article.description || "No Description",
                url: article.url || "#",
                urlToImage: article.urlToImage || null,
                publishedAt: article.publishedAt || "Unknown",
                content: article.content || "No Content",
            }));
        } else {
            console.error("Failed to fetch news headlines:", data.message);
            return [];
        }
    } catch (error: any) {
        console.error("Error fetching news headlines:", error.message);
        return [];
    }
}

export const getNewsHeadlines = unstable_cache(
  async () => {
    console.log('Fetching News Headlines');
    return fetchStockNewsHeadlines();
  },
  ['news-headlines'],
  {
    revalidate: 60,
  },
);

export default function Home() {
  const [topGainers, setTopGainers] = useState<StockData[]>([]);
  const [topLosers, setTopLosers] = useState<StockData[]>([]);
  const [gainersLoading, setGainersLoading] = useState(true);
  const [losersLoading, setLosersLoading] = useState(true);
  const [marketNews, setMarketNews] = useState("");
  const [marketTrendPrediction, setMarketTrendPrediction] = useState<MarketTrendPredictionOutput | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [newsHeadlines, setNewsHeadlines] = useState<NewsHeadline[]>([]);
  const [headlinesLoading, setHeadlinesLoading] = useState(true);


  useEffect(() => {
    const fetchTopMovers = async () => {
      setGainersLoading(true);
      setLosersLoading(true);
      try {
        const gainers = await getTopGainers(5);
        const losers = await getTopLosers(5);
        setTopGainers(gainers);
        setTopLosers(losers);
      } catch (error) {
        console.error("Failed to fetch top movers:", error);
      } finally {
        setGainersLoading(false);
        setLosersLoading(false);
      }
    };

    fetchTopMovers();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setHeadlinesLoading(true);
      try {
        const headlines = await getNewsHeadlines();
        setNewsHeadlines(headlines);
      } catch (error) {
        console.error("Failed to fetch news headlines:", error);
      } finally {
        setHeadlinesLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handlePredictTrend = async () => {
    setPredictionLoading(true);
    try {
      const prediction = await predictMarketTrend({ marketNews });
      setMarketTrendPrediction(prediction);
    } catch (error) {
      console.error("Failed to predict market trend:", error);
    } finally {
      setPredictionLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end">
        <ModeToggle />
      </div>
      <h1 className="text-3xl font-bold mb-4">StockSage</h1>

       {/* News Headlines Carousel */}
       <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Daily Market Headlines</h2>
        {headlinesLoading ? (
          <Skeleton className="w-full h-12" />
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {newsHeadlines.map((headline, index) => (
                <CarouselItem key={index} className="pl-1 md:pl-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <a href={headline.url} target="_blank" rel="noopener noreferrer">
                          {headline.title}
                        </a>
                      </CardTitle>
                      <CardDescription>{headline.source.name}</CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </section>

      {/* Market Trend Prediction Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Market Trend Prediction</h2>
        <Textarea
          placeholder="Enter recent market news..."
          value={marketNews}
          onChange={(e) => setMarketNews(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handlePredictTrend} disabled={predictionLoading}>
          {predictionLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Predicting...
            </>
          ) : (
            "Predict Trend"
          )}
        </Button>

        {marketTrendPrediction && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{marketTrendPrediction.trendPrediction}</CardTitle>
              <CardDescription>Confidence: {(marketTrendPrediction.confidenceLevel * 100).toFixed(2)}%</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{marketTrendPrediction.reasoning}</p>
            </CardContent>
          </Card>
        )}
      </section>

      <div className="grid grid-cols-3 gap-4">
        {/* Top Gainers Section */}
        <section className="col-span-3 md:col-span-1">
          <h2 className="text-xl font-semibold mb-2">Top Gainers</h2>
          {gainersLoading ? (
            <LoadingCard />
          ) : (
            topGainers.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} isGain={true} />
            ))
          )}
        </section>

        {/* Top Losers Section */}
        <section className="col-span-3 md:col-span-1">
          <h2 className="text-xl font-semibold mb-2">Top Losers</h2>
          {losersLoading ? (
            <LoadingCard />
          ) : (
            topLosers.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} isGain={false} />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
