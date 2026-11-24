# CTF Notes

A Jekyll theme for personal CTF writeups: dark "terminal academic" styling,
spoiler protection, event collections, categories/tags, KaTeX math, code
highlighting with copy buttons, client-side search and a generated table of
contents. Built to work on GitHub Pages with no custom build pipeline.

## 1. Configure it

Edit `_config.yml` first:

```yaml
url: "https://angio.bezv.uk"   # your custom domain (CNAME)
baseurl: ""                    # user site repo → served from the domain root
author:
  name: Angiobanjiplasti
  github: Angiobanjiplasti
```

Other knobs you will likely touch:

- `appearance.accent` — `mint` or `amber`. To add another colour, change the
  `--accent*` variables in `_sass/_base.scss`.
- `appearance.toc`, `appearance.search`, `appearance.code_copy`,
  `appearance.spoiler_blur` — switch theme features on/off.
- `nav` — header links.
- `category_meta` — display labels/icons/descriptions for categories.

## 2. Run it locally

Requires Ruby 3.x and Bundler.

```bash
cd ~/Documents
bundle install
bundle exec jekyll serve
```

Open <http://localhost:4000/>. `bundle exec jekyll build --trace` is useful
when a template fails.

## 3. Add a writeup

Create `_posts/YYYY-MM-DD-short-name.md`:

```markdown
---
title: "Challenge name — how I solved it"
date: 2026-11-24
categories: [web]
tags: [sqli, sqlite]
event: hackthebox-backdoor   # matches the filename in _events/
---

Your writeup starts here.

## Recon

...

<details class="spoiler" markdown="1">
### Flag

`flag{...}`
</details>
```

- `categories` comes from the keys in `category_meta`.
- `tags` are free-form; they appear on `/tags/`.
- `event` matches the **slug** of a file in `_events/` (e.g.
  `_events/hackthebox-backdoor.md` → `event: hackthebox-backdoor`).

To add an event, create `_events/slug.md`:

```markdown
---
title: HackTheBox — Backdoor
date: 2026-11-18
event_url: https://app.hackthebox.com/events
description: Short summary.
result: "Team name — 12th / 340"
---
```

Writeups with a matching `event` are listed on that event page automatically.

## 4. Writeups-specific syntax

| Feature | How to use it |
| --- | --- |
| Spoiler block | `<details class="spoiler" markdown="1">...</details>` — hidden until clicked |
| Inline spoiler | `{% capture f %}flag{...}{% endcapture %}{% include spoiler.html label="flag" content=f %}` |
| Inline math | `$$ E = mc^2 $$` in a paragraph (kramdown's inline delimiter) |
| Display math | Put `$$ ... $$` on its own lines |
| Code | Standard fenced code blocks; a copy button is added automatically |
| TOC | Automatic from `##` and `###` headings on writeup pages |

Math is rendered by KaTeX from a CDN. If you want `$...$` delimiters instead,
they are also enabled in `_includes/math.html`.

## 5. Push it to GitHub

This site is already wired to
`https://github.com/Angiobanjiplasti/angiobanjiplasti.github.io` on branch
`main`. Because it is a user site (repo name = username), `baseurl` is `""`.

If you ever need to connect a fresh folder to the repo:

```bash
git clone https://github.com/Angiobanjiplasti/angiobanjiplasti.github.io.git
cd angiobanjiplasti.github.io
# copy the theme files in, then:
git add .
git commit -m "Add CTF writeup theme"
git push
```

Authentication is via the GitHub CLI (`gh auth login`) or an HTTPS Personal
Access Token with `repo` scope.

The repo also contains a `CNAME` file for the custom domain `angio.bezv.uk`,
and `_config.yml` has `url: https://angio.bezv.uk`. Keep both in sync if the
domain changes.

Enable Pages in **Settings → Pages → Build and deployment**: choose
**Deploy from a branch**, `main`, `/ (root)`, and Save. Under **Custom
domain**, enter `angio.bezv.uk` and enable HTTPS. The site then appears at
`https://angio.bezv.uk/`.

Every later update is just:

```bash
git add .
git commit -m "Add writeup for ..."
git push
```

## Troubleshooting

- **Blank page or wrong links** — `url`/`baseurl` do not match the repo name.
- **Build failed on GitHub but works locally** — remove any gem from `Gemfile`
  that is not on the [GitHub Pages dependency list](https://pages.github.com/versions/);
  Pages ignores your Gemfile versions.
- **Search finds nothing** — check that `/search.json` loads and is valid JSON.
- **Math shows raw backslashes** — the KaTeX CDN scripts must be reachable;
  check your browser console.
- **`bundle install` complains about gem permissions** — install into the
  project instead: `bundle config set --local path vendor/bundle && bundle install`.
  `vendor/` and `.bundle/` are gitignored, so they will not be pushed.
