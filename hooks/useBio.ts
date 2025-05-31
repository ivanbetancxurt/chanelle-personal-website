import useSWR, { mutate, type SWRConfiguration, type Fetcher } from 'swr';

interface BioResponse {
  content: string;
}

const fetcher: Fetcher<BioResponse> = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok) {
    throw new Error((json as any).error || `HTTP error! status: ${res.status}`);
  }
  if ('error' in json) {
    throw new Error((json as any).error);
  }

  return json as BioResponse;
};

interface UseBioOptions {
  fallbackData?: BioResponse;
}

export function useBio({ fallbackData }: UseBioOptions = {}) {
  const swrConfig: SWRConfiguration<BioResponse, Error> = {
    fallbackData,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true,
    refreshInterval: 0,
  };

  const { data, error, isLoading, isValidating } = useSWR<BioResponse, Error>(
    '/api/supabase/bio',
    fetcher,
    swrConfig
  );

  const updateBio = async (newContent: string) => {
    try {
      mutate('/api/supabase/bio', { content: newContent }, false);

      const res = await fetch('/api/supabase/bio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error((json as any).error || `HTTP error! status: ${res.status}`);
      }

      mutate('/api/supabase/bio');
    } catch (err) {
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