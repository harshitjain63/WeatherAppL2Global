import { client } from './axios-instance';
import { News_API_Key } from '@env';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string; url: string };
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

export const getNews = async (query: string) => {
  try {
    const response = await client.get<NewsResponse>(
      `https://gnews.io/api/v4/top-headlines`,
      {
        params: {
          lang: 'en',
          max: 5,
          apikey: News_API_Key,
          q: query,
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};
