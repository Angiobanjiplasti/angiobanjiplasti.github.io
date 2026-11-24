(function () {
  'use strict';

  /* ---------------------------------------------------------------- theme */
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');

  function syncToggle() {
    if (!toggle) return;
    var light = root.dataset.theme === 'light';
    toggle.setAttribute('aria-pressed', String(light));
    toggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  }

  syncToggle();
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('ctf-theme', next); } catch (e) { /* ignore */ }
      syncToggle();
    });
  }

  /* ------------------------------------------------------------- spoilers */
  var blurSpoilers = root.dataset.blur === 'true';
  document.querySelectorAll('[data-spoiler]').forEach(function (el) {
    el.dataset.blur = String(blurSpoilers);
    function reveal() {
      var revealed = el.classList.toggle('is-revealed');
      el.setAttribute('aria-expanded', String(revealed));
    }
    el.addEventListener('click', reveal);
    el.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        reveal();
      }
    });
  });

  /* ------------------------------------------------------------------ toc */
  var tocList = document.getElementById('toc-list');
  var body = document.querySelector('.post-body');
  if (tocList && body) {
    var headings = Array.prototype.slice.call(body.querySelectorAll('h2, h3'));

    function slugify(text) {
      return text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-') || 'section';
    }

    var used = {};
    var links = [];

    headings.forEach(function (heading, index) {
      if (!heading.id) {
        var base = slugify(heading.textContent);
        used[base] = (used[base] || 0) + 1;
        heading.id = used[base] > 1 ? base + '-' + used[base] : base;
      }

      var li = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent.trim();
      link.dataset.target = heading.id;
      li.appendChild(link);
      tocList.appendChild(li);
      links.push(link);

      if (heading.tagName === 'H3' && index > 0 && headings[index - 1].tagName === 'H2') {
        li.className = 'toc__nested';
      }
    });

    if (links.length === 0) {
      var aside = document.querySelector('.toc-aside');
      if (aside) aside.hidden = true;
    } else {
      links[0].classList.add('is-active');
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          links.forEach(function (other) { other.classList.remove('is-active'); });
          link.classList.add('is-active');
        });
      });

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (link) {
              link.classList.toggle('is-active', link.dataset.target === entry.target.id);
            });
          });
        }, { rootMargin: '-80px 0px -68% 0px' });
        headings.forEach(function (heading) { observer.observe(heading); });
      }
    }
  }

  /* ---------------------------------------------------------- copy button */
  if (root.dataset.codeCopy === 'true') {
    document.querySelectorAll('pre').forEach(function (pre) {
      if (pre.querySelector('.copy-code')) return;
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-code';
      button.textContent = 'copy';
      pre.appendChild(button);

      button.addEventListener('click', function () {
        var code = pre.querySelector('code') || pre;
        var text = code.textContent.replace(/\n$/, '');
        var done = function () {
          button.textContent = 'copied';
          setTimeout(function () { button.textContent = 'copy'; }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { button.textContent = 'failed'; });
        } else {
          var area = document.createElement('textarea');
          area.value = text;
          area.style.position = 'fixed';
          area.style.opacity = '0';
          document.body.appendChild(area);
          area.select();
          try { document.execCommand('copy'); done(); } catch (e) { button.textContent = 'failed'; }
          document.body.removeChild(area);
        }
      });
    });
  }
})();
