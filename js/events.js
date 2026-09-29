let savedEvents = [];

const eventsList =
  document.getElementById("eventsList");

let visibleEventCount = 12;

loadEventsFromServer();

async function loadEventsFromServer() {

  try {

    const response =
      await fetch("/.netlify/functions/events");

    const data =
      await response.json();

    if (Array.isArray(data)) {

      savedEvents = data;

      localStorage.setItem(
        "countyCompassEvents",
        JSON.stringify(savedEvents)
      );

    } else {

      savedEvents =
        JSON.parse(
          localStorage.getItem("countyCompassEvents")
        ) || [];
    }

  } catch (error) {

    console.error("Event load failed:", error);

    savedEvents =
      JSON.parse(
        localStorage.getItem("countyCompassEvents")
      ) || [];
  }

  renderEvents(
    getActiveEvents()
  );
}

function getActiveEvents() {

  const today =
    new Date();

  today.setHours(0,0,0,0);

  return savedEvents.filter(function(event) {

    if (!event.date) {
      return true;
    }

    const eventDate =
      new Date(
        event.date + "T00:00:00"
      );

    return eventDate >= today;
  });
}

function makeGoodUrl(link) {

  if (!link || String(link).trim() === "") {
    return "";
  }

  link = String(link).trim();

  if (
    link.startsWith("http://") ||
    link.startsWith("https://")
  ) {
    return link;
  }

  return "https://" + link;
}

function formatEventDate(dateValue) {

  if (!dateValue) {
    return "";
  }

  const parts =
    dateValue.split("-");

  if (parts.length !== 3) {
    return dateValue;
  }

  return (
    parts[1] +
    "/" +
    parts[2] +
    "/" +
    parts[0]
  );
}

function getEventImage(event) {

  if (
    event.image &&
    event.image.trim() !== ""
  ) {
    return event.image;
  }

  return "images/categories/events.jpg";
}

function renderEvents(eventsToShow) {

  if (!eventsList) {
    return;
  }

  eventsList.innerHTML = "";

  if (eventsToShow.length === 0) {

    eventsList.innerHTML = `
<div class="empty-message">
        <p>No upcoming events yet. Got something happening in Jackson County?</p>
        <a class="empty-cta" href="submit-listing.html">Add Your Event</a>
      </div>
    `;

    return;
  }

  eventsToShow
    .sort(function(a, b) {

      return (
        new Date(a.date) -
        new Date(b.date)
      );
    })
    .slice(0, visibleEventCount)
    .forEach(function(event) {

      eventsList.innerHTML += `

        <article class="business-card compact-business-card event-card flyer-card">

          <a
            class="event-flyer"
            href="${getEventImage(event)}"
            target="_blank"
            rel="noopener"
            title="Open full-size flyer"
          >
            <img
              src="${getEventImage(event)}"
              alt="${event.title}"
              class="event-flyer-image"
              loading="lazy"
              onerror="this.onerror=null; this.src='images/categories/events.jpg';"
            >
          </a>

          <h2>
            ${event.title}
          </h2>

          <p class="business-category">
            ${event.category}
          </p>

          <p class="business-address">
            ${event.location}
          </p>

          <p class="business-phone">
            ${formatEventDate(event.date)}
          </p>

          <p class="business-phone">
            ${event.time || ""}
          </p>

          <p class="business-description compact-description">
            ${event.description}
          </p>

          ${makeGoodUrl(event.link) ? `
          <a
            class="event-link"
            href="${makeGoodUrl(event.link)}"
            target="_blank"
            rel="noopener"
          >
            Event Details ↗
          </a>` : ""}

        </article>
      `;
    });

  if (
    eventsToShow.length >
    visibleEventCount
  ) {

    eventsList.innerHTML += `

      <div class="load-more-wrap">

        <button
          type="button"
          onclick="loadMoreEvents()"
        >
          Load More Events
        </button>

      </div>
    `;
  }
}

function loadMoreEvents() {

  visibleEventCount += 12;

  renderEvents(
    getActiveEvents()
  );
}