import styles from './RepoFilters.module.css';

const SORT_OPTIONS = [
  { value: 'stars', label: 'Most Stars' },
  { value: 'forks', label: 'Most Forks' },
  { value: 'updated', label: 'Recently Updated' },
  { value: 'name', label: 'Name A-Z' },
];

export default function RepoFilters({
  languages = [],
  selectedLanguage = 'All',
  sortBy = 'stars',
  onLanguageChange,
  onSortChange,
  totalCount = 0,
  filteredCount = 0,
}) {
  return (
    <div className={styles.filters}>
      <div className={styles.controls}>
        <label className={styles.field}>
          <span className={styles.label}>Language</span>
          <select
            className={styles.select}
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="All">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Sort by</span>
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className={styles.count}>
        Showing {filteredCount.toLocaleString()} of{' '}
        {totalCount.toLocaleString()} repositories
      </p>
    </div>
  );
}
