export type AppMode = 'collect' | 'planner';

function basePath(): string {
  return import.meta.env.BASE_URL.replace(/\/?$/, '/');
}

/** Parent-facing collect home, or Andrew’s planner at …/matrix */
export function modeFromPath(pathname = window.location.pathname): AppMode {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized.endsWith('/matrix')) return 'planner';
  return 'collect';
}

export function pathForMode(mode: AppMode): string {
  return mode === 'planner' ? `${basePath()}matrix` : basePath();
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
