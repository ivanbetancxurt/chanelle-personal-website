import useSWR, { mutate, type SWRConfiguration, type Fetcher } from 'swr';

interface BioResponse {
  content: string;
}

const fetcher: Fetcher<BioResponse> = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok) {
    // If the HTTP status is not 2xx, throw to let SWR know
    throw new Error((json as any).error || `HTTP error! status: ${res.status}`);
  }
  if ('error' in json) {
    // If the payload itself contains { error: string }, treat it as an error
    throw new Error((json as any).error);
  }

  return json as BioResponse;
};

interface UseBioOptions {
  fallbackData?: BioResponse;
}

export function useBio({ fallbackData }: UseBioOptions = {}) {
  // Build a typed SWR configuration object
  const swrConfig: SWRConfiguration<BioResponse, Error> = {
    fallbackData,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    refreshInterval: 0,
  };

  // Tell SWR that data is of type BioResponse and errors are Error
  const { data, error, isLoading, isValidating } = useSWR<BioResponse, Error>(
    '/api/supabase/bio',
    fetcher,
    swrConfig
  );

  const updateBio = async (newContent: string) => {
    try {
      // Optimistically update the cache
      mutate('/api/supabase/bio', { content: newContent }, false);

      // Send the PUT request to update the bio
      const res = await fetch('/api/supabase/bio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error((json as any).error || `HTTP error! status: ${res.status}`);
      }

      // Revalidate to get fresh data
      mutate('/api/supabase/bio');
    } catch (err) {
      // Revert the cache on error
      mutate('/api/supabase/bio');
      throw err;
    }
  };

  return {
    bio: data?.content ?? '',
    isLoading: isLoading || isValidating,
    error,
    updateBio,
  };
}


/*
import useSWR, { mutate, SWRConfiguration } from 'swr';

const fetcher = (url: string) => async (url: string) => {
    const res = await fetch(url);
    const json = await res.json();
  
    if (!res.ok) {
      // HTTP 500–599, etc.
      throw new Error(json.error || `HTTP error! status: ${res.status}`);
    }
    if ('error' in json) {
      // our route returned { error: … } with status 200
      throw new Error((json as any).error);
    }
  
    return json as { content: string }; // for bio: { content: string }
};

interface UseBioOptions {
    fallbackData?: { content: string };
}

// custom hook to fetch and update bio
export function useBio({ fallbackData }: UseBioOptions = {}) {
    const swrConfig: SWRConfiguration<{ content: string }, Error> = {
        fallbackData,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        revalidateOnMount: true,
        refreshInterval: 0,
    };
    
    const { data, error, isLoading, isValidating } = useSWR<{ content: string }, Error>(
        '/api/supabase/bio',
        fetcher,
        swrConfig
    );
    
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
    */