import useSWR, { mutate, type SWRConfiguration, type Fetcher } from 'swr';
import { sortArticles } from '@/lib/utils';
import type { Articles } from '@/lib/generated/prisma';

const fetcher: Fetcher<Articles[]> = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok) {
    // If the HTTP status is not 2xx, throw to let SWR know
    throw new Error((json as any).error || `HTTP error! status: ${res.status}`);
  }
  if (Array.isArray(json) && json.some((item) => 'error' in (item as any))) {
    // If the returned array contains an { error: string } item, throw
    throw new Error(((json as any)[0] as any).error);
  }

  return json as Articles[];
};

interface UseArticlesOptions {
  fallbackData?: Articles[];
}

export function useArticles({ fallbackData }: UseArticlesOptions = {}) {
  // Build a typed SWR configuration object
  const swrConfig: SWRConfiguration<Articles[], Error> = {
    fallbackData,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    refreshInterval: 0,
  };

  // Tell SWR that data is Articles[] and errors are Error
  const { data, error, isLoading, isValidating } = useSWR<Articles[], Error>(
    '/api/supabase/articles',
    fetcher,
    swrConfig
  );

  const articles = Array.isArray(data) ? sortArticles(data) : [];

  const addArticle = async (newArticle: Articles) => {
    try {
      // Optimistically update the cache
      const optimistic = [...articles, newArticle];
      mutate('/api/supabase/articles', sortArticles(optimistic), false);

      // Send POST request to add a new article
      const res = await fetch('/api/supabase/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error((json as any).error || `HTTP error! status: ${res.status}`);
      }

      // Revalidate to get fresh data
      mutate('/api/supabase/articles');
    } catch (err) {
      // Revert on error
      mutate('/api/supabase/articles');
      throw err;
    }
  };

  const deleteArticle = async (articleLink: string) => {
    try {
      // Optimistically update the cache
      const optimistic = articles.filter((a) => a.link !== articleLink);
      mutate('/api/supabase/articles', optimistic, false);

      // Send DELETE request to remove the article
      const res = await fetch('/api/supabase/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: articleLink }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error((json as any).error || `HTTP error! status: ${res.status}`);
      }

      // Revalidate to get fresh data
      mutate('/api/supabase/articles');
    } catch (err) {
      // Revert on error
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


/*
import useSWR, { mutate } from 'swr';
import { sortArticles } from '@/lib/utils';
import type { Articles } from '@/lib/generated/prisma';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
});

interface UseArticlesOptions {
    fallbackData?: Articles[];
}

export function useArticles({ fallbackData }: UseArticlesOptions = {}) {
    const { data, error, isLoading, isValidating } = useSWR('/api/supabase/articles', fetcher, {
        fallbackData,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        revalidateOnMount: true,
        refreshInterval: 0,
    });

    const articles = Array.isArray(data) ? sortArticles(data) : [];

    const addArticle = async (newArticle: Articles) => {
        try {
            // optimistic update
            const optimisticArticles = [...articles, newArticle];
            mutate('/api/supabase/articles', sortArticles(optimisticArticles), false);
            
            // get articles
            const res = await fetch('/api/supabase/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newArticle)
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            
            // revalidate cache with fresh data
            mutate('/api/supabase/articles');
            
        } catch (err) {
            // revert cache on error
            mutate('/api/supabase/articles');
            throw err;
        }
    };

    const deleteArticle = async (articleLink: string) => {
        try {
            // optimistic update
            const optimisticArticles = articles.filter(a => a.link !== articleLink);
            mutate('/api/supabase/articles', optimisticArticles, false);
            
            // delete article
            const res = await fetch('/api/supabase/articles', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link: articleLink })
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            
            // revalidate cache
            mutate('/api/supabase/articles');
            
        } catch (err) {
            // revert cache on error
            mutate('/api/supabase/articles');
            throw err;
        }
    };

    return {
        articles,
        isLoading: isLoading || isValidating,
        error,
        addArticle,
        deleteArticle
    };
}
    */