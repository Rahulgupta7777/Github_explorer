import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle/ThemeToggle.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        GitHub Explorer
      </Link>
      <nav className={styles.actions} aria-label="Primary">
        <ThemeToggle />
      </nav>
    </header>
  );
}
