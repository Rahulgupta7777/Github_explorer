import { useEffect, useState } from 'react';
import { PER_PAGE_USERS, SEARCH_RESULTS_CAP, searchUsers } from '../api/github.js';

export function useGitHubSearch(query, page = 1, retryKey = 0) {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setUsers([]);
      setTotalCount(0);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await searchUsers(trimmed, page, controller.signal);
        setUsers(data.items);
        setTotalCount(data.total_count);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setUsers([]);
        setTotalCount(0);
      } finally {
        // aborted hai toh loading false mat kar — next request already true kar chuka
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [query, page, retryKey]);

  // github search 1000 pe cap karta hai, usse aage paginate karna useless
  const totalPages =
    totalCount > 0
      ? Math.ceil(Math.min(totalCount, SEARCH_RESULTS_CAP) / PER_PAGE_USERS)
      : 0;

  return { users, totalCount, totalPages, loading, error };
}
