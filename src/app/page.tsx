"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StockData, getTopGainers, getTopLosers } from "@/services/yfinance";
import { useEffect, useState } from "react";
import { MarketTrendPredictionOutput, predictMarketTrend } from "@/ai/flows/market-trend-prediction";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Chart,
  ChartBar,
  ChartClose,
  ChartContainer,
  ChartContent,
  ChartDescription,
  ChartFooter,
  ChartHeader,
  ChartLabel,
  ChartLegend,
  ChartLegendContent,
  ChartLine,
  ChartPie,
  ChartProps,
  ChartTitle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { HistoricalDataPoint, getHistoricalData } from "@/services/yfinance";
import { ModeToggle } from "@/components/mode-toggle";
import { Icons } from "@/components/icons";

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
          <ChartContainer config={chartConfig} className="h-32">
            <ChartLine dataKey="closingPrice" stroke="hsl(var(--chart-1))" strokeWidth={2} />
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default function Home() {
  const [topGainers, setTopGainers] = useState<StockData[]>([]);
  const [topLosers, setTopLosers] = useState<StockData[]>([]);
  const [gainersLoading, setGainersLoading] = useState(true);
  const [losersLoading, setLosersLoading] = useState(true);
  const [marketNews, setMarketNews] = useState("");
  const [marketTrendPrediction, setMarketTrendPrediction] = useState<MarketTrendPredictionOutput | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);

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
