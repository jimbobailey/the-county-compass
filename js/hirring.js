let hiringPosts =
  JSON.parse(
    localStorage.getItem("countyCompassHiring")
  ) || [];

const hiringList =
  document.getElementById("hiringList");

function renderHiringPosts() {

  if (!hiringList) {
    return;
  }

  hiringList.innerHTML = "";

  if (hiringPosts.length === 0) {

    hiringList.innerHTML = `
      <p class="empty-message">
        No hiring posts available yet.
      </p>
    `;

    return;
  }

  hiringPosts.forEach(function(post) {

    const image =
      post.image && post.image.trim() !== ""
        ? post.image
        : "images/site/hiring.png";

    const websiteButton =
      post.website && post.website.trim() !== ""
        ? `
          <a
            href="${makeGoodUrl(post.website)}"
            target="_blank"
          >
            Apply Now
          </a>
        `
        : "";

    hiringList.innerHTML += `

      <article class="business-card">

        <img
          src="${image}"
          alt="${post.business}"
          class="business-card-image"
        >

        <h2>
          ${post.title}
        </h2>

        <p>
          <strong>Business:</strong>
          ${post.business}
        </p>

        <p>
          <strong>Job Type:</strong>
          ${post.jobType}
        </p>

        <p>
          <strong>Pay:</strong>
          ${post.pay}
        </p>

        <p>
          <strong>Phone:</strong>
          ${post.phone}
        </p>

        <p class="business-description">
          ${post.description}
        </p>

        ${websiteButton}

      </article>
    `;
  });
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

renderHiringPosts();