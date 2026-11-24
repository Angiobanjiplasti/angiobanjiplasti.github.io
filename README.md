# CTF Notes

Built on [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) (MIT).
All layout, styling, search, TOC, taxonomy and math come from the upstream
theme — there is no custom CSS or hand-rolled theme code here.

There are deliberately **no example writeups**. `_posts/` is empty.

## Add a writeup

Create `_posts/YYYY-MM-DD-name.md`:

```yaml
---
title: "Challenge name"
date: 2026-11-24
categories: [web]
tags: [jwt]
event: event-slug        # optional, matches a file in _events/
toc: true
---
```

Then write the post below the front matter. Chirpy supports code highlighting,
MathJax math (`$$...$$`), spoilers via `<details>`, and more — see the
[Chirpy writing guide](https://chirpy.cotes.page/posts/write-a-new-post/).

## Add an event

Create `_events/slug.md` with `title`, `date`, optional `event_url`,
`ctftime_url`, `description` and `result`. Writeups with `event: slug` are
listed automatically on that event's page and in the Events tab.

## Deploy

Pushes to `main` trigger `.github/workflows/pages-deploy.yml`, which builds with
Bundler and deploys to GitHub Pages. `CNAME` keeps the custom domain
`angio.bezv.uk`; `url` in `_config.yml` matches it.

Local preview:

```bash
bundle install
bundle exec jekyll serve
```
