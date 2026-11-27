# frozen_string_literal: true

# Posts with `unlisted: true` are reachable by direct URL but stay out of
# Chirpy's post lists, taxonomies, search index, feed and sitemap.
#
# Jekyll writes documents from site.collections["posts"], so the real
# collection is left untouched. Only the collection exposed as `site.posts`
# (used by Liquid, pagination, tags and categories) is filtered.

module UnlistedPostNavigation
  def next_doc
    return super unless collection&.label == "posts"

    docs = collection.docs.reject { |doc| doc.data["unlisted"] == true }
    pos = docs.index { |doc| doc.equal?(self) }
    docs[pos + 1] if pos && pos < docs.length - 1
  end

  def previous_doc
    return super unless collection&.label == "posts"

    docs = collection.docs.reject { |doc| doc.equal?(self) }
    pos = docs.index { |doc| doc.equal?(self) }
    docs[pos - 1] if pos && pos.positive?
  end
end

Jekyll::Document.prepend(UnlistedPostNavigation)

Jekyll::Hooks.register :site, :post_read do |site|
  posts = site.collections["posts"]
  next unless posts

  posts.docs.each do |doc|
    next unless doc.data["unlisted"] == true

    doc.data["hidden"] = true
    doc.data["sitemap"] = false if doc.data["sitemap"].nil?
    doc.data["categories"] = []
    doc.data["tags"] = []
  end

  public_posts = Jekyll::Collection.new(site, "posts")
  public_posts.docs = posts.docs.reject { |doc| doc.data["unlisted"] == true }
  site.define_singleton_method(:posts) { public_posts }
end
