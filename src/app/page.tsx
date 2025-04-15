'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StockData, getTopGainers, getTopLosers } from "@/services/yfinance";
import { useEffect, useState } from "react";
import { MarketTrendPredictionOutput, predictMarketTrend } from "@/ai/flows/market-trend-prediction";
import { Button } from "@/components/ui/button";
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
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

async function getNews(): Promise<{ newsHeadlines: NewsHeadline[]; hostnames: string[] }> {
  try {
    const res = await fetch('/api/news', { cache: 'no-store' });
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error fetching news:", errorData?.message || 'Failed to fetch news');
      return { newsHeadlines: [], hostnames: [] };
    }
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching news:", error.message);
    return { newsHeadlines: [], hostnames: [] };
  }
}

// Define stock options
const stockOptions = [
  { value: 'TSLA', label: 'TSLA - Tesla Inc' },
  { value: 'AAPL', label: 'AAPL - Apple Inc.' },
  { value: 'MSFT', label: 'MSFT - Microsoft Corp.' },
  { value: 'GOOGL', label: 'GOOGL - Alphabet Inc.' },
  { value: 'AMZN', label: 'AMZN - Amazon.com Inc.' },
  { value: 'PLTR', label: 'PLTR - Palantir Technologies Inc.' },
];

export default function Home() {
  const [topGainers, setTopGainers] = useState<StockData[]>([]);
  const [topLosers, setTopLosers] = useState<StockData[]>([]);
  const [gainersLoading, setGainersLoading] = useState(true);
  const [losersLoading, setLosersLoading] = useState(true);
  const [stockSymbol, setStockSymbol] = useState("PLTR");
  const [marketTrendPrediction, setMarketTrendPrediction] = useState<MarketTrendPredictionOutput | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [newsHeadlines, setNewsHeadlines] = useState<NewsHeadline[]>([]);
  const [headlinesLoading, setHeadlinesLoading] = useState(true);
  const [hostnames, setHostnames] = useState<string[]>([]);


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
        const { newsHeadlines: headlines, hostnames: fetchedHostnames } = await getNews();
        setNewsHeadlines(headlines);
        setHostnames(fetchedHostnames);
      } catch (error: any) {
        console.error("Error fetching news:", error.message);
        setNewsHeadlines([]);
        setHostnames([]);
      } finally {
        setHeadlinesLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handlePredictTrend = async () => {
    setPredictionLoading(true);
    try {
      const prediction = await predictMarketTrend({ stockSymbol });
      setMarketTrendPrediction(prediction);
    } catch (error) {
      console.error("Failed to predict market trend:", error);
      setMarketTrendPrediction(null);
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

        {hostnames.length > 0 && (
        <Alert variant="destructive">
          <AlertTitle>Action Required: Update Next.js Config</AlertTitle>
          <AlertDescription>
            The following hostnames need to be added to your <code>next.config.js</code> file under <code>images.remotePatterns</code> to allow image optimization:
            <ul>
              {hostnames.map((hostname, index) => (
                <li key={index}>{hostname}</li>
              ))}
            </ul>
            <p>
              This is necessary for the <code>next/image</code> component to function correctly.  You will need to manually update the file and restart your Next.js development server.
            </p>
          </AlertDescription>
        </Alert>
      )}

       {/* News Headlines Carousel */}
       <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Daily Market Headlines</h2>
        {headlinesLoading ? (
          <Skeleton className="w-full h-12" />
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {newsHeadlines
                .filter(headline => headline) // Filter out null headlines
                .map((headline, index) => (
                  headline ? (
                    <CarouselItem key={index} className="pl-1 md:pl-1">
                      <Card className="h-full flex flex-col">
                        <CardHeader>
                          <CardTitle className="line-clamp-1">
                            <a href={headline.url} target="_blank" rel="noopener noreferrer">
                              {headline.title}
                            </a>
                          </CardTitle>
                          <CardDescription>{headline.source.name}</CardDescription>
                        </CardHeader>
                        {/*headline.urlToImage && (
                          <div className="relative w-full h-48">
                            <Image
                              src={headline.urlToImage}
                              alt={headline.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="rounded-md"
                            />
                          </div>
                        )*/}
                      </Card>
                    </CarouselItem>
                  ) : null
                ))}
            </CarouselContent>
          </Carousel>
        )}
      </section>

      {/* Market Trend Prediction Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Market Trend Prediction</h2>
        <Select onValueChange={(value) => setStockSymbol(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a stock" />
          </SelectTrigger>
          <SelectContent>
            {stockOptions.map((stock) => (
              <SelectItem value={stock.value} key={stock.value}>
                {stock.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

        {predictionLoading && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
              <CardDescription>Fetching prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Please wait...</p>
            </CardContent>
          </Card>
        )}

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
