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