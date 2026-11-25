---
icon: fas fa-calendar-days
order: 5
---

<div class="content">
  {% assign sorted_events = site.events | sort: "date" | reverse %}

  {% if sorted_events.size > 0 %}
    <ul>
      {% for event in sorted_events %}
        {% assign count = site.posts | where: "event", event.slug | size %}
        <li>
          <a href="{{ event.url | relative_url }}">{{ event.title }}</a>
          <small>{{ event.date | date: "%d %b %Y" }} · {{ count }} writeup{% unless count == 1 %}s{% endunless %}</small>
        </li>
      {% endfor %}
    </ul>
  {% else %}
    <p>No events yet.</p>
  {% endif %}
</div>
