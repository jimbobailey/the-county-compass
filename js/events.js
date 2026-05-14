const savedEvents =
  JSON.parse(
    localStorage.getItem("countyCompassEvents")
  ) || [];

const eventGrid =
  document.getElementById("eventGrid");

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

  if (!eventGrid) {
    return;
  }

  eventGrid.innerHTML = "";

  if (eventsToShow.length === 0) {

    eventGrid.innerHTML = `
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

      eventGrid.innerHTML += `

        <article class="business-card compact-business-card">

          <img
            src="${getEventImage(event)}"
            alt="${event.title}"
            class="business-card-image compact-business-image"
            loading="lazy"
            onerror="this.onerror=null; this.src='images/categories/events.jpg';"
          >

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

        </article>

      `;
    });

  if (
    eventsToShow.length >
    visibleEventCount
  ) {

    eventGrid.innerHTML += `
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