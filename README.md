# CTF Notes

Built on [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) (MIT).
Layout, styling, search, TOC, taxonomy and math come from the upstream theme.

## Publish a writeup

Start from `_templates/writeup.md` — copy it anywhere you like (your Obsidian
vault, `/tmp`, wherever). Write in ordinary Markdown, then run:

```bash
cd ~/Documents
bin/publish path/to/note.md
```

The script normalises front matter, converts Obsidian syntax and creates
`_posts/YYYY-MM-DD-slug.md`, then commits and pushes it. It accepts any `.md`,
with or without front matter.

Set `ctf_author` in the front matter to credit the original CTF/machine author
(and `ctf_author_url` for a profile link). It renders as its own line below the
"By …" byline, which stays reserved for the writeup author.

| Obsidian syntax | Published as |
| --- | --- |
| `![[shot.png]]` | `![shot](/assets/img/inbox/shot.png)` |
| `[[Target]]` / `[[Target\|Label]]` | link to `/posts/target/` |
| `> [!tip] ...` | Chirpy `.prompt-tip` block |

Put screenshots in `assets/img/inbox/`. The script warns about any it can't find.

Useful flags:

```bash
bin/publish note.md --dry-run              # print the result, write nothing
bin/publish note.md --no-commit            # write the post, skip git
bin/publish note.md --no-push              # commit locally, don't push
bin/publish note.md --slug my-slug -d 2026-11-25
bin/publish note.md --force                # overwrite an existing post
```

The permalink comes from the slug: `/posts/my-slug/`.

Set `unlisted: true` in the front matter to publish a post that is reachable
by its direct URL but omitted from the homepage, archives, taxonomies, search,
feed and sitemap. It also gets a `noindex` robots tag.

## Add an event

Create `_events/slug.md` with `title`, `date`, optional `event_url`,
`ctftime_url`, `description` and `result`. Posts with `event: slug` in their
front matter are listed automatically on that event page and in the Events tab.

## Deploy

Pushes to `main` trigger `.github/workflows/pages-deploy.yml`. `CNAME` keeps the
custom domain `angio.bezv.uk`; `url` in `_config.yml` matches it.

Local preview:

```bash
bundle install
bundle exec jekyll serve
```

## Styling

`assets/css/jekyll-theme-chirpy.scss` is Chirpy's supported override file. It
adds a light, reading-first layer (serif article column, softer chrome) on top
of the untouched theme. Prefer changing that file over editing theme internals.
