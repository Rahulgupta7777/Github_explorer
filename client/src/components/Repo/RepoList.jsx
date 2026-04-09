import RepoCard from './RepoCard.jsx';
import styles from './RepoList.module.css';

export default function RepoList({ repos, bookmarks = [], onToggleBookmark }) {
  return (
    <ul className={styles.list}>
      {repos.map((repo) => (
        <li key={repo.id}>
          <RepoCard
            repo={repo}
            isBookmarked={bookmarks.includes(repo.full_name)}
            onToggleBookmark={onToggleBookmark}
          />
        </li>
      ))}
    </ul>
  );
}
