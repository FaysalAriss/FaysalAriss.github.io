# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Faysal Ariss's personal portfolio site: plain HTML/CSS/JS, no build step, no npm, no framework, no dependencies.

## Commands

There is no build/lint/test tooling. To preview locally:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`. Opening `index.html` directly in a browser also works, but a local server makes relative paths behave exactly like production (GitHub Pages).

## Architecture

- `index.html` — the entire single-page site: sidebar (identity, nav, socials) + `#experience`, `#projects`, `#about`, `#contact` sections. All content lives inline in this file; there is no templating or data layer.
- `style.css` — all styling for every page (index + case studies). Design tokens (colors, fonts, layout widths) are CSS custom properties defined once under `:root` (light mode) and overridden under `[data-theme="dark"]`. Change a token there and it cascades everywhere — don't hardcode colors/fonts in markup.
- `script.js` (~50 lines, no dependencies) — two independent IIFEs: dark-mode toggle (persisted to `localStorage`, respects `prefers-color-scheme` on first visit) and scroll-based active-nav-link highlighting via `IntersectionObserver`. The initial theme is set synchronously in an inline `<script>` in each HTML file's `<head>` (before `style.css`/`script.js` load) to avoid a flash of the wrong theme — keep that inline snippet in sync across pages if it changes.
- `projects/project-1.html` — the case-study page template. Each project gets its own page by copying this file (`project-2.html`, `project-3.html`, ...); the suggested case-study structure is Problem → Approach → Interesting technical decisions → Result. Case-study pages reference `../style.css` and `../script.js` (one directory up) and duplicate the sidebar markup from `index.html`.
- `experiences/skykey.html` — same pattern as `projects/`, but for work-experience write-ups linked from the `#experience` section.
- `assets/` — images, GIFs, and video used by both `index.html` and the case-study pages.

## Content model

Projects and experience entries are hand-authored, duplicated `<article>` blocks — there is no data file or generator:
- A project card in `index.html`'s `#projects` section (`<article class="project">`) can either link to a full case-study page under `projects/`, or link `Code` straight to a GitHub repo and skip the case study for smaller projects.
- Adding a project means: (1) duplicate an existing `<article class="project">` block in `index.html`, (2) optionally copy `projects/project-1.html` to a new numbered file and fill it in, matching the link `href` between the two.
- Same duplication pattern applies to `<article class="experience">` blocks and `experiences/*.html` pages.

## Deploying

GitHub Pages, served from the `main` branch. If the repo is named `<username>.github.io`, any push to `main` deploys directly to `https://<username>.github.io`. Otherwise it deploys to `https://<username>.github.io/<repo-name>` once Pages is enabled in repo settings.
