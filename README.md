# DocuMind

AI-powered documentation generator.

## 🚀 Deployment

This project is configured to deploy automatically to GitHub Pages via GitHub Actions.

### Setup Instructions

1.  **Add Secrets**: Go to **Settings > Secrets and variables > Actions** and add:
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`
2.  **Enable Pages**: Go to **Settings > Pages** and ensure:
    *   **Source**: "Deploy from a branch"
    *   **Branch**: `gh-pages` (this branch is created automatically after the first successful build).

Each push to `main` will trigger a new deployment.
