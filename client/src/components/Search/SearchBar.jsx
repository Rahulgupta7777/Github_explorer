import { useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, resultCount }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const showCount =
    typeof resultCount === 'number' && value.trim().length > 0;

  return (
    <div className={styles.searchBar}>
      <div className={styles.inputWrap}>
        <SearchIcon className={styles.icon} />
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search GitHub users..."
          aria-label="Search GitHub users"
        />
        {value && (
          <button
            type="button"
            className={styles.clear}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        )}
      </div>
      {/* always rendered warna aria-live ka first update miss ho jata hai */}
      <p className={styles.count} aria-live="polite">
        {showCount
          ? `Found ${resultCount.toLocaleString()} ${
              resultCount === 1 ? 'user' : 'users'
            }`
          : ''}
      </p>
    </div>
  );
}

const SearchIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
    />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
    />
  </svg>
);
