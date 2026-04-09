import { useCallback, useState } from 'react';
import EmptyState from '../../components/common/EmptyState/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage.jsx';
import Loader from '../../components/common/Loader/Loader.jsx';
import Pagination from '../../components/common/Pagination/Pagination.jsx';
import SearchBar from '../../components/Search/SearchBar.jsx';
import UserList from '../../components/User/UserList.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useGitHubSearch } from '../../hooks/useGitHubSearch.js';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [retryKey, setRetryKey] = useState(0);

  const debouncedQuery = useDebounce(searchQuery, 400);
  const { users, totalCount, totalPages, loading, error } = useGitHubSearch(
    debouncedQuery,
    page,
    retryKey,
  );

  // page reset karna hai warna user phans jata hai page 5 pe naye query ke saath
  const handleQueryChange = useCallback((next) => {
    setSearchQuery(next);
    setPage(1);
  }, []);

  // retryKey bump = same query refire
  const handleRetry = useCallback(() => {
    setRetryKey((k) => k + 1);
  }, []);

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.heading}>
          Explore <span className={styles.headingAccent}>GitHub</span>
        </h1>
        <p className={styles.tagline}>
          Search users and discover their repositories
        </p>
      </header>

      <SearchBar
        value={searchQuery}
        onChange={handleQueryChange}
        resultCount={users.length > 0 ? totalCount : undefined}
      />

      <div className={styles.results}>{renderResults()}</div>
    </section>
  );

  function renderResults() {
    if (loading) {
      return <Loader text="Searching users..." />;
    }
    if (error) {
      return <ErrorMessage message={error} onRetry={handleRetry} />;
    }
    if (debouncedQuery === '') {
      return (
        <EmptyState
          title="Start typing to search GitHub users"
          description="Try a username like 'torvalds' or 'gaearon'."
        />
      );
    }
    if (users.length === 0) {
      return (
        <EmptyState
          title={`No users found for "${debouncedQuery}"`}
          description="Try a different search term."
        />
      );
    }
    return (
      <>
        <UserList users={users} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalCount={Math.min(totalCount, totalPages * 20)}
          onPageChange={setPage}
        />
      </>
    );
  }
}
