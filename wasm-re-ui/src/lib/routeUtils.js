const GITHUB_PAGE_BASE = '/wasm-re-hw/';

export function getWebsiteBasePath() {
  const isGitHubPages = import.meta.env.VITE_DEPLOY_TARGET === 'github-pages';
  const basePath = isGitHubPages ? GITHUB_PAGE_BASE : '/';
  return basePath;
}
