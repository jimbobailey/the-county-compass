const savedEvents =
  JSON.parse(
    localStorage.getItem("countyCompassEvents")
  ) || [];

const eventsList =
  document.getElementById("eventsList");

let visibleEventCount = 12;

renderEvents(
  getActiveEvents()
);

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
      <p class="empty-message">
        No upcoming events found.
      </p>
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

        <article class="business-card">

          <img
            src="${getEventImage(event)}"
            alt="${event.title}"
            class="business-card-image"
            loading="lazy"
            onerror="this.onerror=null; this.src='images/categories/events.jpg';"
          >

          <h2>
            ${event.title}
          </h2>

          <p>
            <strong>Category:</strong>
            ${event.category}
          </p>

          <p>
            <strong>Location:</strong>
            ${event.location}
          </p>

          <p>
            <strong>Date:</strong>
            ${formatEventDate(event.date)}
          </p>

          <p>
            <strong>Time:</strong>
            ${event.time || ""}
          </p>

          <p class="business-description">
            ${event.description}
          </p>

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