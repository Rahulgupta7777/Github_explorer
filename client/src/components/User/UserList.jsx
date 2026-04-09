import UserCard from './UserCard.jsx';
import styles from './UserList.module.css';

export default function UserList({ users }) {
  return (
    <ul className={styles.list}>
      {users.map((user) => (
        <li key={user.id}>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  );
}
