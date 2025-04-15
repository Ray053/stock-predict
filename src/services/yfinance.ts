/**
 * Represents the data for a single stock.
 */
export interface StockData {
  /**
   * The stock ticker symbol.
   */
  symbol: string;
  /**
   * The company name.
   */
  name: string;
  /**
   * The current price of the stock.
   */
  price: number;
  /**
   * The percentage change in price since the previous day's close.
   */
  changePercent: number;
}

/**
 * Asynchronously retrieves the top N stock gainers.
 * @param topN The number of top gainers to retrieve.
 * @returns A promise that resolves to an array of StockData objects.
 */
export async function getTopGainers(topN: number): Promise<StockData[]> {
  // TODO: Implement this by calling the yfinance API.
  // Replace the placeholder data with actual API data.
  return [
    {
      symbol: 'GME',
      name: 'GameStop Corp.',
      price: 25.00,
      changePercent: 10.50,
    },
    {
      symbol: 'AMC',
      name: 'AMC Entertainment Holdings Inc.',
      price: 5.00,
      changePercent: 8.20,
    },
    {
        symbol: 'NVDA',
        name: 'Nvidia Corp',
        price: 900.00,
        changePercent: 7.00,
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc',
        price: 200.00,
        changePercent: 6.50,
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc',
        price: 160.00,
        changePercent: 5.00,
      },
  ];
}

/**
 * Asynchronously retrieves the top N stock losers.
 * @param topN The number of top losers to retrieve.
 * @returns A promise that resolves to an array of StockData objects.
 */
export async function getTopLosers(topN: number): Promise<StockData[]> {
  // TODO: Implement this by calling the yfinance API.
    // Replace the placeholder data with actual API data.
  return [
    {
      symbol: 'BBBY',
      name: 'Bed Bath & Beyond Inc.',
      price: 0.50,
      changePercent: -20.30,
    },
    {
      symbol: 'MULN',
      name: 'Mullen Automotive Inc.',
      price: 1.00,
      changePercent: -15.60,
    },
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 170.00,
        changePercent: -4.00,
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        price: 400.00,
        changePercent: -3.50,
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 180.00,
        changePercent: -2.00,
      },
  ];
}

/**
 * Represents historical stock performance data.
 */
export interface HistoricalDataPoint {
  /**
   * The date for the data point.
   */
  date: string;
  /**
   * The closing price of the stock for the given date.
   */
  closingPrice: number;
}

/**
 * Asynchronously retrieves the historical performance data for a given stock symbol.
 * @param symbol The stock symbol to retrieve data for.
 * @param period The time period for which to retrieve data (e.g., '1mo', '3mo', '1y').
 * @returns A promise that resolves to an array of HistoricalDataPoint objects.
 */
export async function getHistoricalData(
  symbol: string,
  period: string
): Promise<HistoricalDataPoint[]> {
  // TODO: Implement this by calling the yfinance API.
    // Replace the placeholder data with actual API data.
  return [
    {
      date: '2024-01-01',
      closingPrice: 20.00,
    },
    {
      date: '2024-01-02',
      closingPrice: 21.00,
    },
    {
        date: '2024-01-03',
        closingPrice: 22.50,
      },
      {
        date: '2024-01-04',
        closingPrice: 22.00,
      },
      {
        date: '2024-01-05',
        closingPrice: 23.00,
      },
      {
        date: '2024-01-06',
        closingPrice: 23.50,
      },
      {
        date: '2024-01-07',
        closingPrice: 24.00,
      },
      {
        date: '2024-01-08',
        closingPrice: 23.50,
      },
      {
        date: '2024-01-09',
        closingPrice: 24.50,
      },
      {
        date: '2024-01-10',
        closingPrice: 25.00,
      },
      {
        date: '2024-01-11',
        closingPrice: 26.00,
      },
      {
        date: '2024-01-12',
        closingPrice: 25.50,
      },
      {
        date: '2024-01-13',
        closingPrice: 27.00,
      },
      {
        date: '2024-01-14',
        closingPrice: 26.50,
      },
      {
        date: '2024-01-15',
        closingPrice: 28.00,
      },
      {
        date: '2024-01-16',
        closingPrice: 27.50,
      },
      {
        date: '2024-01-17',
        closingPrice: 29.00,
      },
      {
        date: '2024-01-18',
        closingPrice: 28.50,
      },
      {
        date: '2024-01-19',
        closingPrice: 30.00,
      },
      {
        date: '2024-01-20',
        closingPrice: 29.50,
      },
      {
        date: '2024-01-21',
        closingPrice: 31.00,
      },
      {
        date: '2024-01-22',
        closingPrice: 30.50,
      },
  ];
}
