(function () {
  'use strict';

  var page = document.querySelector('.search-page');
  if (!page) return;

  var input = document.getElementById('search-input');
  var status = document.getElementById('search-status');
  var results = document.getElementById('search-results');
  var index = [];

  function text(value) { return String(value || '').toLowerCase(); }

  function score(doc, tokens) {
    var haystack = text([doc.title, doc.excerpt, doc.kind, (doc.categories || []).join(' '), (doc.tags || []).join(' ')].join(' '));
    return tokens.every(function (token) { return haystack.indexOf(token) !== -1; });
  }

  function render(items) {
    results.textContent = '';
    items.forEach(function (item) {
      var li = document.createElement('li');
      var heading = document.createElement('h2');
      var link = document.createElement('a');
      link.href = item.url;
      link.textContent = item.title;
      heading.appendChild(link);
      li.appendChild(heading);

      if (item.excerpt) {
        var excerpt = document.createElement('p');
        excerpt.textContent = item.excerpt;
        li.appendChild(excerpt);
      }

      var meta = document.createElement('div');
      meta.className = 'result-meta';
      [item.kind, item.date].concat(item.categories || [], item.tags || []).forEach(function (value) {
        if (!value) return;
        var span = document.createElement('span');
        span.textContent = value;
        meta.appendChild(span);
      });
      li.appendChild(meta);
      results.appendChild(li);
    });
  }

  function run() {
    var query = input.value.trim().toLowerCase();
    if (!query) {
      status.textContent = index.length + ' entries indexed. Start typing to filter.';
      render([]);
      return;
    }

    var tokens = query.split(/\s+/);
    var matches = index.filter(function (doc) { return score(doc, tokens); });
    matches.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });

    status.textContent = matches.length + ' result' + (matches.length === 1 ? '' : 's') + ' for “' + input.value.trim() + '”';
    render(matches.slice(0, 40));
  }

  input.addEventListener('input', run);

  fetch(page.dataset.endpoint)
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (data) {
      index = Array.isArray(data) ? data : [];
      input.disabled = false;
      status.textContent = index.length + ' entries indexed. Start typing to filter.';
    })
    .catch(function () {
      status.textContent = 'Could not load the search index. Check that search.json built correctly.';
    });

  input.disabled = true;
})();
