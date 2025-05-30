import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
});

interface UseBioOptions {
    fallbackData?: { content: string };
}

// custom hook to fetch and update bio
export function useBio({ fallbackData }: UseBioOptions = {}) {
    const { data, error, isLoading, isValidating } = useSWR('/api/supabase/bio', fetcher, {
        fallbackData,
        revalidateOnFocus: true, // revalidate when user returns to tab
        revalidateOnReconnect: true,
        revalidateOnMount: true,
        refreshInterval: 0, // don't auto-refresh, only on manual trigger
    });
    
    const updateBio = async (newContent: string) => {
        try {
            // optimistic update
            mutate('/api/supabase/bio', { content: newContent }, false);
            
            // update bio
            const res = await fetch('/api/supabase/bio', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent })
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            
            // revalidate cache with fresh data
            mutate('/api/supabase/bio');
        } catch (err) {
            // revert optimistic update on error
            mutate('/api/supabase/bio');
            throw err;
        }
    };

    return {
        bio: data?.content ?? '',
        isLoading: isLoading || isValidating,
        error,
        updateBio
    };
}