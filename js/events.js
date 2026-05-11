let savedEvents = [];

const eventList =
  document.getElementById("eventList");

let visibleEventCount = 12;

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
        JSON.stringify(data)
      );

    } else {

      savedEvents =
        JSON.parse(
          localStorage.getItem("countyCompassEvents")
        ) || [];
    }

  } catch (error) {

    console.error(error);

    savedEvents =
      JSON.parse(
        localStorage.getItem("countyCompassEvents")
      ) || [];
  }

  renderEvents(
    getSortedUpcomingEvents()
  );
}

function getSortedUpcomingEvents() {

  return savedEvents
    .filter(function(event) {

      if (!event.date) {
        return false;
      }

      const today =
        new Date();

      today.setHours(0, 0, 0, 0);

      const eventDate =
        new Date(event.date + "T00:00:00");

      return eventDate >= today;
    })

    .sort(function(a, b) {

      const aDate =
        new Date(
          a.date + "T" + (a.time || "00:00")
        );

      const bDate =
        new Date(
          b.date + "T" + (b.time || "00:00")
        );

      return aDate - bDate;
    });
}

function getEventFallbackImage() {

  return "images/categories/events.jpg";
}

function getEventImage(event) {

  if (
    event.image &&
    event.image.trim() !== ""
  ) {
    return event.image;
  }

  return getEventFallbackImage();
}

function renderEvents(eventsToShow) {

  if (!eventList) {
    return;
  }

  eventList.innerHTML = "";

  if (eventsToShow.length === 0) {

    eventList.innerHTML = `
      <p class="empty-message">
        No upcoming events found.
      </p>
    `;

    return;
  }

  eventsToShow
    .slice(0, visibleEventCount)
    .forEach(function(event) {

      const fallbackImage =
        getEventFallbackImage();

      eventList.innerHTML += `
        <article class="business-card">

          <img
            src="${getEventImage(event)}"
            alt="${event.title}"
            class="business-card-image"
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackImage}';"
          >

          <h2>${event.title}</h2>

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
            ${event.date}
          </p>

          <p>
            <strong>Time:</strong>
            ${event.time}
          </p>

          <p class="business-description">
            ${event.description}
          </p>

        </article>
      `;
    });

  if (eventsToShow.length > visibleEventCount) {

    eventList.innerHTML += `
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
    getSortedUpcomingEvents()
  );
}

loadEventsFromServer();