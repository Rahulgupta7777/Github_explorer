import { useEffect, useState } from 'react';
import { fetchUserRepos } from '../api/github.js';

export function useUserRepos(username, retryKey = 0) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setRepos([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchUserRepos(username, controller.signal);
        setRepos(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setRepos([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [username, retryKey]);

  return { repos, loading, error };
}
