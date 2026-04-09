import styles from './Loader.module.css';

export default function Loader({ size = 'md', text }) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <div
        className={`${styles.spinner} ${styles[size]}`}
        aria-hidden="true"
      />
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
}
