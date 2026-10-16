# Marvin Liu’s personal site

An Astro blog and portfolio with TypeScript and plain CSS.

## Development

Requires Node.js 22.22+ and pnpm 10.34.1.

```sh
pnpm install --frozen-lockfile
pnpm dev            # http://127.0.0.1:4321
pnpm build          # Check types, privacy, and generate dist/
pnpm preview        # Serve dist/
pnpm test           # Desktop and mobile browser checks
```

Install the test browser once with `pnpm exec playwright install chromium`. Build before running tests.

Astro telemetry is disabled in the project scripts. `pnpm-workspace.yaml` requires dependency releases to be at least seven days old.

## Content

| Content | Location |
| --- | --- |
| Posts | `src/content/posts/` |
| Biography and experience | `src/data/profile.ts` |
| Projects | `src/data/projects.ts` |
| Styles | `src/styles.css` |
| Logos | `public/logos/` ([sources](src/data/logo-sources.md)) |
| Site mark | `src/components/Brand.astro` and `public/favicon.svg` |

New posts need this frontmatter:

```yaml
---
title: "A new note"
date: "2026-10-15T12:00:00Z"
description: "A brief description."
permalink: /posts/a-new-note/
categories: Development
tags: [TypeScript]
---
```

Use a unique permalink with a trailing slash. Existing post URLs, including `/jquery-1-nothing-new.html`, are preserved.

## Publishing

The source and GitHub Pages deployment live together in [liuyang1520/liuyang1520.github.io](https://github.com/liuyang1520/liuyang1520.github.io). Push content changes to `main` to build, run the privacy and browser checks, and automatically deploy the tested `dist/` output. Pull requests only run the checks.

In Settings → Pages, the publishing source is **GitHub Actions**. Deployment uses GitHub's built-in workflow token; no deploy key or personal token is required. Generated files stay out of the source branch.

The canonical URL is in `astro.config.mjs`; update `public/robots.txt` when changing domains. RSS is available at `/feed.xml`.

## Privacy

Everything in `public/` is published. The build checks public assets and output for sensitive files, recognizable credentials, unexpected contact details, local paths, and PNG metadata. These checks complement manual review.

Personal originals stay in the ignored `private/` folder or the ignored local résumé file. This repository starts with a fresh history containing only the current site source and approved assets.

Regenerate the social preview with `node scripts/render-social-card.mjs` after installing the Playwright browser.
