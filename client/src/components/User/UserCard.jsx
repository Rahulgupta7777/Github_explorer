import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './UserCard.module.css';

export default function UserCard({ user }) {
  const [imageError, setImageError] = useState(false);

  // reset karna hai jab card recycle ho — warna purana broken state leak hota hai
  useEffect(() => {
    setImageError(false);
  }, [user.avatar_url]);

  return (
    <Link to={`/user/${user.login}`} className={styles.card}>
      {imageError ? (
        <div className={styles.avatarFallback} aria-hidden="true">
          {user.login.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className={styles.avatar}
          loading="lazy"
          onError={() => setImageError(true)}
        />
      )}
      <span className={styles.name}>{user.login}</span>
      <ChevronIcon className={styles.chevron} />
    </Link>
  );
}

const ChevronIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
    />
  </svg>
);
