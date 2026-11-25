---
title: "Challenge name — one-line description"
date: 2026-11-25
categories: [web]          # up to two, e.g. [web, crypto]
tags: [jwt, auth]          # lowercase; a leading # is fine too
# event: hackthebox-backdoor  # optional, matches _events/<slug>.md
# description: "Summary for the home page and search. Otherwise the first paragraph is used."
# math: true               # uncomment only if the writeup uses $...$ or $$...$$
---

# Challenge name

A short opening paragraph: what the challenge was and what the end result was.
This becomes the description if you don't set one above.

## Recon

What you looked at first. Drop screenshots in `assets/img/inbox/` and embed them
with Obsidian syntax — the publish script turns them into proper Markdown:

![[recon.png]]

## Solving it

Describe the actual path you took, including dead ends. Fenced code keeps its
language for syntax highlighting:

```python
token = forge(secret, payload)
```

Math needs `math: true` in the front matter above:

$$
H = \text{HMAC}(key, message)
$$

Callouts become coloured prompts:

> [!tip] Shortcut
> The default key was in the repo history.

Spoilers stay hidden until clicked:

<details markdown="1">
<summary>Flag</summary>

flag{...}

</details>

## Takeaway

What you learned that would help on the next challenge.
