# frozen_string_literal: true

# Render the original CTF/machine author as its own line, from the
# `ctf_author` front matter field. The Chirpy "By …" byline stays reserved
# for the writeup author. An optional `ctf_author_url` turns the name into a link.

Jekyll::Hooks.register :posts, :pre_render do |post|
  author = post.data['ctf_author']
  next if author.nil? || author.to_s.strip.empty?

  post.content = "{% include ctf_author.html %}\n\n#{post.content}"
end
