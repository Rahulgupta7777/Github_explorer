import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary.jsx';
import Loader from './components/common/Loader/Loader.jsx';
import Navbar from './components/Layout/Navbar.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import styles from './App.module.css';

// route-split — UserReposPage ka bundle home page mein nahi chahiye
const UserReposPage = lazy(() =>
  import('./pages/UserReposPage/UserReposPage.jsx'),
);

export default function App() {
  return (
    <ThemeProvider>
      <a href="#main" className={styles.skipLink}>
        Skip to main content
      </a>
      <div className={styles.app}>
        <Navbar />
        <main id="main" className={styles.main}>
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <HomePage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/user/:username"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<Loader text="Loading…" />}>
                    <UserReposPage />
                  </Suspense>
                </ErrorBoundary>
              }
            />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}
