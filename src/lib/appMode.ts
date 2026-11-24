export type AppMode = 'collect' | 'planner' | 'guide';

function basePath(): string {
  return import.meta.env.BASE_URL.replace(/\/?$/, '/');
}

/** Parent collect home, Andrew’s planner at …/matrix, click guide at …/guide */
export function modeFromPath(pathname = window.location.pathname): AppMode {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized.endsWith('/matrix')) return 'planner';
  if (normalized.endsWith('/guide')) return 'guide';
  return 'collect';
}

export function pathForMode(mode: AppMode): string {
  if (mode === 'planner') return `${basePath()}matrix`;
  if (mode === 'guide') return `${basePath()}guide`;
  return basePath();
}

export function navigateToMode(mode: AppMode): void {
  const next = pathForMode(mode) + window.location.search + window.location.hash;
  window.history.pushState(null, '', next);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

/** Restore GitHub Pages 404 → index redirect (pathname preserved in sessionStorage). */
export function restoreGhPagesRedirect(): void {
  const redirect = sessionStorage.getItem('gh-pages-redirect');
  if (!redirect) return;
  sessionStorage.removeItem('gh-pages-redirect');
  window.history.replaceState(null, '', redirect);
}
