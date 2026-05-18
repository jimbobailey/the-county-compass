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