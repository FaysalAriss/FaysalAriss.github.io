# Portfolio Template

A plain HTML/CSS/JS portfolio — no build step, no npm, no framework. Edit files directly and push.

## Structure

```
index.html              ← main page (sidebar + projects + about + contact)
style.css                ← all styling
script.js                 ← dark mode toggle + active-nav highlighting
projects/
  project-1.html          ← case study template — duplicate this per project
assets/                   ← put your images/screenshots here
```

## Getting started

1. **Edit `index.html`.** Every spot that needs your info is marked `<!-- TODO -->`:
   - Your name, role, and bio in the sidebar
   - Social links (GitHub, LinkedIn, email)
   - Each project entry (title, description, tags, links)
   - About section text and skills list
   - Contact email

2. **Add a project.** Copy `projects/project-1.html` to `projects/project-2.html`
   (etc.), fill in the TODOs, then add a matching `<article class="project">` block
   in `index.html`'s `#projects` section pointing to it. Not every project needs a
   full case-study page — you can also link `Code` straight to the GitHub repo and
   skip the case study entirely for smaller projects.

3. **Add screenshots.** Drop images in `assets/` and reference them from your case
   study pages, e.g. `<img src="../assets/my-screenshot.png" alt="...">`.

4. **Preview locally.** No build step needed — just open `index.html` in a browser,
   or run a local server so relative paths behave exactly like production:
   ```
   python3 -m http.server 8000
   ```
   then visit `http://localhost:8000`.

## Deploying to GitHub Pages

If this repo is already named `yourusername.github.io`:

```
git add .
git commit -m "Add portfolio"
git push
```

Your site will be live at `https://yourusername.github.io` within a minute or two.

If it's a different repo name, enable Pages under **Settings → Pages → Source: main branch**,
and it'll be live at `https://yourusername.github.io/repo-name`.

## Customizing

- **Colors, type, spacing** — all defined as CSS variables at the top of `style.css`
  under `:root` (light mode) and `[data-theme="dark"]` (dark mode). Change values there
  and they cascade everywhere.
- **Fonts** — currently Fraunces (headings), Inter (body), JetBrains Mono (labels),
  loaded from Google Fonts in the `<head>` of each HTML file. Swap the `<link>` and the
  `--serif` / `--sans` / `--mono` variables to change them.
- **Section order** — just reorder the `<section>` blocks in `index.html`; nav links
  use `#id` anchors so update `href`s to match if you rename a section.

## Notes

- Dark mode preference is saved in `localStorage` and respects system preference on first visit.
- The layout collapses to a single column under 900px width.
- No external JS dependencies — `script.js` is ~40 lines, easy to read and modify.
