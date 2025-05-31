import useSWR, { mutate, type SWRConfiguration, type Fetcher } from 'swr';
import { sortArticles } from '@/lib/utils';
import type { Articles } from '@/lib/generated/prisma';

const fetcher: Fetcher<Articles[]> = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok) {
    throw new Error((json as any).error || `HTTP error! status: ${res.status}`);
  }
  if (Array.isArray(json) && json.some((item) => 'error' in (item as any))) {
    throw new Error(((json as any)[0] as any).error);
  }

  return json as Articles[];
};

interface UseArticlesOptions {
  fallbackData?: Articles[];
}

export function useArticles({ fallbackData }: UseArticlesOptions = {}) {
  const swrConfig: SWRConfiguration<Articles[], Error> = {
    fallbackData,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    refreshInterval: 0,
  };

  const { data, error, isLoading, isValidating } = useSWR<Articles[], Error>(
    '/api/supabase/articles',
    fetcher,
    swrConfig
  );

  const articles = Array.isArray(data) ? sortArticles(data) : [];

  const addArticle = async (newArticle: Articles) => {
    try {
      const optimistic = [...articles, newArticle];
      mutate('/api/supabase/articles', sortArticles(optimistic), false);

      const res = await fetch('/api/supabase/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error((json as any).error || `HTTP error! status: ${res.status}`);
      }

      mutate('/api/supabase/articles');
    } catch (err) {
      mutate('/api/supabase/articles');
      throw err;
    }
  };

  const deleteArticle = async (articleLink: string) => {
    try {
      const optimistic = articles.filter((a) => a.link !== articleLink);
      mutate('/api/supabase/articles', optimistic, false);

      const res = await fetch('/api/supabase/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: articleLink }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error((json as any).error || `HTTP error! status: ${res.status}`);
      }

      mutate('/api/supabase/articles');
    } catch (err) {
      mutate('/api/supabase/articles');
      throw err;
    }
  };

  return {
    articles,
    isLoading: isLoading || isValidating,
    error,
    addArticle,
    deleteArticle,
  };
}