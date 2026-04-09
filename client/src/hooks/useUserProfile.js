import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api/github.js';

export function useUserProfile(username, retryKey = 0) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchUserProfile(username, controller.signal);
        setProfile(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setProfile(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [username, retryKey]);

  return { profile, loading, error };
}
