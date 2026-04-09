import { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage.jsx';
import Loader from '../../components/common/Loader/Loader.jsx';
import RepoFilters from '../../components/Repo/RepoFilters.jsx';
import RepoList from '../../components/Repo/RepoList.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { useUserProfile } from '../../hooks/useUserProfile.js';
import { useUserRepos } from '../../hooks/useUserRepos.js';
import {
  filterByLanguage,
  getUniqueLanguages,
  sortRepos,
} from '../../utils/helpers.js';
import styles from './UserReposPage.module.css';

// module level — Intl.DateTimeFormat constructor heavy hai
const JOIN_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

export default function UserReposPage() {
  const { username } = useParams();

  const [sortBy, setSortBy] = useState('stars');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [retryKey, setRetryKey] = useState(0);
  const [bookmarks, setBookmarks] = useLocalStorage(
    'github-explorer-bookmarks',
    [],
  );

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile(username, retryKey);
  const {
    repos,
    loading: reposLoading,
    error: reposError,
  } = useUserRepos(username, retryKey);

  const uniqueLanguages = useMemo(() => getUniqueLanguages(repos), [repos]);

  const processedRepos = useMemo(() => {
    const filtered = filterByLanguage(repos, selectedLanguage);
    return sortRepos(filtered, sortBy);
  }, [repos, selectedLanguage, sortBy]);

  const toggleBookmark = useCallback(
    (repoFullName) => {
      setBookmarks((current) =>
        current.includes(repoFullName)
          ? current.filter((name) => name !== repoFullName)
          : [...current, repoFullName],
      );
    },
    [setBookmarks],
  );

  const handleRetry = useCallback(() => {
    setRetryKey((k) => k + 1);
  }, []);

  return (
    <section className={styles.page}>
      <Link to="/" className={styles.back}>
        <BackArrow />
        Back to search
      </Link>

      {renderProfile()}
      {renderRepos()}
    </section>
  );

  function renderProfile() {
    if (profileError) {
      return <ErrorMessage message={profileError} onRetry={handleRetry} />;
    }

    // h1 hamesha render hona chahiye warna loading state mein page heading nahi hota
    const joinedAt = profile
      ? JOIN_DATE_FORMAT.format(new Date(profile.created_at))
      : null;
    const displayName = profile ? profile.name || profile.login : username;

    return (
      <header
        className={styles.profileCard}
        aria-busy={profileLoading || undefined}
      >
        {profile ? (
          <img
            src={profile.avatar_url}
            alt={`${profile.login}'s avatar`}
            className={styles.avatar}
            loading="lazy"
          />
        ) : (
          <div className={styles.avatarSkeleton} aria-hidden="true" />
        )}
        <div className={styles.profileBody}>
          <h1 className={styles.name}>{displayName}</h1>
          {profile?.name && <p className={styles.handle}>@{profile.login}</p>}
          {profile?.bio && <p className={styles.bio}>{profile.bio}</p>}

          {profile && (profile.company || profile.location || profile.blog) && (
            <div className={styles.metaRow}>
              {profile.company && (
                <span className={styles.metaItem}>
                  <CompanyIcon />
                  {profile.company}
                </span>
              )}
              {profile.location && (
                <span className={styles.metaItem}>
                  <LocationIcon />
                  {profile.location}
                </span>
              )}
              {profile.blog && (
                <a
                  href={normalizeBlogUrl(profile.blog)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.metaItem} ${styles.metaLink}`}
                >
                  <LinkIcon />
                  {stripProtocol(profile.blog)}
                </a>
              )}
              <span className={styles.metaItem}>
                <CalendarIcon />
                Joined {joinedAt}
              </span>
            </div>
          )}

          {profile ? (
            <div className={styles.stats}>
              <Stat value={profile.followers} label="Followers" />
              <Stat value={profile.following} label="Following" />
              <Stat value={profile.public_repos} label="Repositories" />
            </div>
          ) : (
            <p className={styles.profileLoading} role="status">
              Loading profile…
            </p>
          )}
        </div>
      </header>
    );
  }

  function renderRepos() {
    if (reposLoading) return <Loader text="Loading repositories..." />;
    if (reposError) {
      return <ErrorMessage message={reposError} onRetry={handleRetry} />;
    }
    if (repos.length === 0) {
      return (
        <EmptyState
          title="No public repositories"
          description={`${username} hasn't published any repositories yet.`}
        />
      );
    }
    return (
      <>
        <RepoFilters
          languages={uniqueLanguages}
          selectedLanguage={selectedLanguage}
          sortBy={sortBy}
          onLanguageChange={setSelectedLanguage}
          onSortChange={setSortBy}
          totalCount={repos.length}
          filteredCount={processedRepos.length}
        />
        {processedRepos.length === 0 ? (
          <EmptyState
            title="No repositories match your filters"
            description="Try a different language."
          />
        ) : (
          <RepoList
            repos={processedRepos}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
          />
        )}
      </>
    );
  }
}

function Stat({ value, label }) {
  return (
    <span className={styles.statPill}>
      <strong>{value.toLocaleString()}</strong>
      <span>{label}</span>
    </span>
  );
}

// github blog field kabhi protocol ke saath aata hai kabhi nahi
function normalizeBlogUrl(blog) {
  if (/^https?:\/\//i.test(blog)) return blog;
  return `https://${blog}`;
}

function stripProtocol(blog) {
  return blog.replace(/^https?:\/\//i, '');
}

const BackArrow = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
    />
  </svg>
);

const CompanyIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.75a1 1 0 00-1-1h-2a1 1 0 00-1 1v2.75a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4zM6 5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1A.5.5 0 016 5zm0 3a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1A.5.5 0 016 8zm.5 2.5a.5.5 0 000 1h1a.5.5 0 000-1h-1zM12 5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1A.5.5 0 0112 5zm.5 2.5a.5.5 0 000 1h1a.5.5 0 000-1h-1zm0 3a.5.5 0 000 1h1a.5.5 0 000-1h-1z"
    />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
    />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
    />
  </svg>
);
