let hiringPosts = [];

const hiringList = document.getElementById("hiringList");

loadHiringFromServer();

async function loadHiringFromServer() {
  try {
    const response = await fetch("/.netlify/functions/hiring");
    const data = await response.json();

    hiringPosts = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Hiring load failed:", error);
    hiringPosts = [];
  }

  renderHiringPosts();
}

function getPostExpiration(post) {
  return post.expiration || "";
}

function isExpired(dateValue) {
  if (!dateValue) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expirationDate = new Date(dateValue + "T00:00:00");
  expirationDate.setHours(0, 0, 0, 0);

  return expirationDate < today;
}

function getActiveHiringPosts() {
  return hiringPosts.filter(function(post) {
    return !isExpired(getPostExpiration(post));
  });
}

function formatPhoneNumber(value) {
  const cleaned = String(value || "").replace(/\D/g, "");

  if (cleaned.length <= 3) {
    return cleaned;
  }

  if (cleaned.length <= 6) {
    return "(" + cleaned.slice(0, 3) + ") " + cleaned.slice(3);
  }

  return (
    "(" +
    cleaned.slice(0, 3) +
    ") " +
    cleaned.slice(3, 6) +
    "-" +
    cleaned.slice(6, 10)
  );
}

function makeGoodUrl(link) {
  if (!link || link.trim() === "") {
    return "";
  }

  if (
    link.startsWith("http://") ||
    link.startsWith("https://")
  ) {
    return link;
  }

  return "https://" + link;
}

function formatExpirationDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const parts = dateValue.split("-");

  if (parts.length !== 3) {
    return dateValue;
  }

  return parts[1] + "/" + parts[2] + "/" + parts[0];
}

function renderHiringPosts() {
  const activePosts = getActiveHiringPosts();

  if (!hiringList) {
    return;
  }

  hiringList.innerHTML = "";

  if (activePosts.length === 0) {
    hiringList.innerHTML = `
      <p class="empty-message">
        No hiring opportunities available right now.
      </p>
    `;
    return;
  }

  activePosts.forEach(function(post) {
    const imagePath =
      post.image && post.image.trim() !== ""
        ? post.image
        : "images/categories/hiring.jpg";

    const expiration = getPostExpiration(post);

    const expirationLine = expiration
      ? `
        <p class="hiring-expiration">
          Expires ${formatExpirationDate(expiration)}
        </p>
      `
      : "";

    const websiteButton =
      post.website && post.website.trim() !== ""
        ? `
          <a
            href="${makeGoodUrl(post.website)}"
            target="_blank"
            class="compact-button"
          >
            Apply
          </a>
        `
        : "";

    hiringList.innerHTML += `
      <article class="business-card compact-business-card">

        <img
          src="${imagePath}"
          alt="${post.title || "Hiring opportunity"}"
          class="business-card-image compact-business-image"
          loading="lazy"
          onerror="this.onerror=null; this.src='images/categories/hiring.jpg';"
        >

        <h2>${post.title || ""}</h2>

        <p class="business-category">
          ${post.business || ""}
        </p>

        <p class="business-address">
          ${post.jobType || ""}
        </p>

        <p class="business-phone">
          ${post.pay || ""}
        </p>

        <p class="business-phone">
          ${formatPhoneNumber(post.phone)}
        </p>

        ${expirationLine}

        <p class="business-description compact-description">
          ${post.description || ""}
        </p>

        <div class="business-button-row">
          ${websiteButton}
        </div>

      </article>
    `;
  });
}