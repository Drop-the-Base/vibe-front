import { useEffect, useState, useCallback } from 'react';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useApiData<T>(fetcher: () => Promise<T>, deps: unknown[] = []): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(() => {
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        setData(result);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Wystąpił nieoczekiwany błąd');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, reload: execute };
}
