import { useMemo } from 'react';
import styles from './Pagination.module.css';

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  perPage = 20,
  onPageChange,
}) {
  const visiblePages = useMemo(
    () => getVisiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalCount);

  return (
    <nav className={styles.pagination} aria-label="Search results pagination">
      <p className={styles.summary} aria-live="polite">
        Showing {start.toLocaleString()}–{end.toLocaleString()} of{' '}
        {totalCount.toLocaleString()}
      </p>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Previous
        </button>

        {visiblePages.map((entry, index) =>
          entry === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className={styles.ellipsis}
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              className={`${styles.button} ${styles.pageButton} ${
                entry === currentPage ? styles.active : ''
              }`}
              onClick={() => onPageChange(entry)}
              aria-label={`Go to page ${entry}`}
              aria-current={entry === currentPage ? 'page' : undefined}
            >
              {entry}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.button}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
}

// 1, ..., current-1, current, current+1, ..., last
function getVisiblePages(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [1];
  const windowStart = Math.max(2, current - 1);
  const windowEnd = Math.min(total - 1, current + 1);

  if (windowStart > 2) pages.push('ellipsis');
  for (let i = windowStart; i <= windowEnd; i++) {
    pages.push(i);
  }
  if (windowEnd < total - 1) pages.push('ellipsis');

  pages.push(total);
  return pages;
}
