
# StockSage - US Stock Market Trend Prediction and Daily Top Movers

## Overview

StockSage is a Next.js application that leverages Hugging Face models and the yfinance API to provide insights into the US stock market. It predicts market trends, displays daily top gainers and losers, and visualizes historical performance using a Bento-style layout with gradient backgrounds.

## Features

-   **Market Trend Prediction:** Uses AI models to predict the trend of specific stocks.
-   **Daily Top Movers:** Fetches and displays the top 10 gainers and losers in the US stock market.
-   **Data Visualization:** Presents stock data in a visually appealing Bento-style layout with gradient backgrounds.
-   **Historical Performance Charts:** Shows one-month performance charts for top-moving stocks.
-   **Dark Mode:** Includes a dark mode toggle for user preference.

## Technologies Used

-   **Frontend:**
    -   React
    -   Next.js
    -   Shadcn UI
    -   Tailwind CSS
    -   Recharts
    -   Lucide React
-   **Backend:**
    -   Genkit
    -   Node.js
-   **APIs:**
    -   yfinance (simulated with placeholder data)
    -   News API
    -   Financial Modeling Prep API
-   **AI Model:**
    -   Hugging Face models (via Genkit)

## Setup Instructions

Follow these steps to set up and run the StockSage application:

### Prerequisites

-   Node.js (version 18 or higher)
-   npm or yarn
-   A News API account and API key from [https://newsapi.org/](https://newsapi.org/)
-   A Financial Modeling Prep API account and API key from [https://site.financialmodelingprep.com/developer/docs/](https://site.financialmodelingprep.com/developer/docs/)
-   A Google GenAI API key

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment Variables (.env)

1.  Create a `.env` file in the root directory of the project.
2.  Add the following environment variables to the `.env` file, replacing the placeholder values with your actual API keys:

```
NEWS_API_KEY=<your_news_api_key>
FINANCIAL_API_KEY=<your_financial_modeling_prep_api_key>
GOOGLE_GENAI_API_KEY=<your_google_genai_api_key>
```

**Note:** Treat your `.env` file with care and DO NOT commit it to your Git repository. This file contains sensitive information.

### Step 4: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

This command starts the Next.js development server and opens the application in your default web browser. You can usually access it at `http://localhost:9002`.

### Step 5: Using Genkit Development Server

```bash
npm run genkit:dev
# or
yarn genkit:dev
```

This command starts the Genkit development server

### Step 6: Building and starting for production

```bash
npm run build
# or
yarn build
```

```bash
npm run start
# or
yarn start
```

### Step 7: Accessing the Application

Open your web browser and navigate to `http://localhost:9002` (or the port specified in your Next.js configuration) to access the StockSage application.

## Additional Notes

-   The application uses placeholder data for the yfinance API.  To integrate real data, you will need to implement API calls to yfinance or another suitable financial data provider in `src/services/yfinance.ts`.
-   The Bento-style layout is implemented using CSS grid and Tailwind CSS.  You can customize the layout by modifying the styles in `src/app/page.tsx`.
-   The color scheme is defined in `src/app/globals.css` and can be customized to match your preferences.  Both light and dark modes are supported.
-   The AI model integration is handled by Genkit, with the relevant code located in the `src/ai` directory.  You can modify the prompts and flows in this directory to customize the AI's behavior.

## Contributing

Contributions to StockSage are welcome! If you find a bug or have a feature request, please open an issue on the GitHub repository.  If you would like to contribute code, please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
