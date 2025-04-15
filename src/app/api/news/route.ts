import { NextResponse } from 'next/server';

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

async function fetchStockNewsHeadlines(): Promise<{ articles: NewsHeadline[]; hostnames: string[] }> {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
        console.error("NEWS_API_KEY is not set in environment variables.");
        throw new Error("NEWS_API_KEY is not set in environment variables.");
    }

    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error(`Failed to fetch news headlines: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch news headlines: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === 'ok' && data.articles) {
            const articles = data.articles.map((article: any) => ({
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

            // Extract unique hostnames
            const hostnames = Array.from(new Set(
                articles
                    .filter(article => article.urlToImage)
                    .map(article => new URL(article.urlToImage!).hostname)
            ));

            return { articles, hostnames };
        } else {
            console.error("Failed to fetch news headlines:", data.message);
            throw new Error(`Failed to fetch news headlines: ${data.message}`);
        }
    } catch (error: any) {
        console.error("Error fetching news headlines:", error.message);
        throw new Error(`Error fetching news headlines: ${error.message}`);
    }
}


export async function GET() {
    try {
        const { articles: newsHeadlines, hostnames } = await fetchStockNewsHeadlines();
        return NextResponse.json({ newsHeadlines, hostnames });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
