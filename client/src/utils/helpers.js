// hex values from github linguist + part 06 spec
export const LANGUAGE_COLORS = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Java: '#ED8B00',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Ruby: '#CC342D',
  'C++': '#00599C',
  'C#': '#239120',
  PHP: '#777BB4',
  Swift: '#FA7343',
  Kotlin: '#7F52FF',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Shell: '#89E051',
  Dart: '#0175C2',
  Vue: '#4FC08D',
};

export function getLanguageColor(language) {
  if (!language) return 'var(--color-accent)';
  return LANGUAGE_COLORS[language] ?? 'var(--color-accent)';
}

export function sortRepos(repos, sortBy) {
  const copy = [...repos]; // Array.sort mutates, isliye copy
  switch (sortBy) {
    case 'stars':
      return copy.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case 'forks':
      return copy.sort((a, b) => b.forks_count - a.forks_count);
    case 'updated':
      return copy.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
      );
    case 'name':
      return copy.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      );
    default:
      return copy;
  }
}

// 'All' sentinel = no filter
export function filterByLanguage(repos, language) {
  if (language === 'All' || !language) return repos;
  return repos.filter((repo) => repo.language === language);
}

export function getUniqueLanguages(repos) {
  const set = new Set();
  for (const repo of repos) {
    if (repo.language) set.add(repo.language);
  }
  return [...set].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
}
