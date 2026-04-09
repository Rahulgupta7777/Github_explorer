const BASE_URL = 'https://api.github.com';


const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export const PER_PAGE_USERS = 20;
export const SEARCH_RESULTS_CAP = 1000; // github search hard limit
const PER_PAGE_REPOS = 100;

async function githubFetch(endpoint, signal) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      signal,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }),
      },
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('Network error. Check your connection and try again.');
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid GitHub token. Check VITE_GITHUB_TOKEN in .env.');
    }
    if (response.status === 403) {
      throw new Error('API rate limit exceeded. Try again in a minute.');
    }
    if (response.status === 404) {
      throw new Error('Resource not found.');
    }
    throw new Error('Something went wrong. Please try again.');
  }

  return response.json();
}

/**
Search GitHub users by login fragment.
@param {string} query
@param {number} [page=1]
@param {AbortSignal} [signal]
@returns {Promise<{ items: Array, total_count: number }>}
 */
export async function searchUsers(query, page = 1, signal) {
  const params = new URLSearchParams({
    q: query,
    per_page: String(PER_PAGE_USERS),
    page: String(page),
  });
  return githubFetch(`/search/users?${params}`, signal);
}

/**
 Fetch a user's public repositories, newest-first (max 100).
@param {string} username
@param {AbortSignal} [signal]
@returns {Promise<Array>}
 */
export async function fetchUserRepos(username, signal) {
  const params = new URLSearchParams({
    per_page: String(PER_PAGE_REPOS),
    sort: 'updated',
  });
  return githubFetch(
    `/users/${encodeURIComponent(username)}/repos?${params}`,
    signal,
  );
}

/**
 Fetch a user's extended public profile (bio, followers, etc.).
@param {string} username
@param {AbortSignal} [signal]
*/
export async function fetchUserProfile(username, signal) {
  return githubFetch(`/users/${encodeURIComponent(username)}`, signal);
}
