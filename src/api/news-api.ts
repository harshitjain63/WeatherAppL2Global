import { ToastAndroid } from 'react-native';
import { client } from './axios-instance';
import { News_API_Key } from '@env';
import axios from 'axios';

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
  } catch (err) {
    let message = 'Something went wrong. Please try again.';

    if (axios.isAxiosError(err)) {
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data as any;

        if (typeof data === 'object') {
          if (Array.isArray(data.errors) && data.errors.length > 0) {
            message = data.errors[0];
          } else if (typeof data.message === 'string') {
            message = data.message;
          } else {
            message = `Request failed with status ${status}`;
          }
        } else {
          message = `Request failed with status ${status}`;
        }
      } else if (err.request) {
        message =
          'No response from server. Please check your internet connection.';
      }
    }

    ToastAndroid.show(message, ToastAndroid.LONG);

    throw new Error(message);
  }
};
