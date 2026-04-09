import { getLanguageColor } from '../../utils/helpers.js';
import styles from './RepoCard.module.css';

export default function RepoCard({ repo, isBookmarked, onToggleBookmark }) {
  const handleBookmark = (e) => {
    e.stopPropagation(); // future-proofing — agar Link wrap kabhi add ho
    onToggleBookmark?.(repo.full_name);
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {repo.name}
          </a>
        </h3>
        {onToggleBookmark && (
          <button
            type="button"
            className={`${styles.bookmark} ${isBookmarked ? styles.bookmarkActive : ''}`}
            onClick={handleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            aria-pressed={isBookmarked}
          >
            <BookmarkIcon filled={isBookmarked} />
          </button>
        )}
      </div>

      {repo.description && (
        <p className={styles.description}>{repo.description}</p>
      )}

      <div className={styles.meta}>
        {repo.language && (
          <span className={styles.languageBadge}>
            <span
              className={styles.languageDot}
              style={{ background: getLanguageColor(repo.language) }}
              aria-hidden="true"
            />
            {repo.language}
          </span>
        )}
        {/* github stargazers_count bhejta hai, stars nahi */}
        <span className={styles.stat}>
          <StarIcon className={styles.starIcon} />
          {(repo.stargazers_count ?? 0).toLocaleString()}
        </span>
        <span className={styles.stat}>
          <ForkIcon className={styles.forkIcon} />
          {(repo.forks_count ?? 0).toLocaleString()}
        </span>
      </div>
    </article>
  );
}

const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.4z"
    />
  </svg>
);

const ForkIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
    />
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);
