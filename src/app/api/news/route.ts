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


export async function GET() {
    const newsHeadlines = await fetchStockNewsHeadlines();
    return NextResponse.json(newsHeadlines);
}
