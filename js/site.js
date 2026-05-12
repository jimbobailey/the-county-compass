console.log("The County Compass Loaded");

let savedBusinesses = [];
let savedAds = [];

const featuredContainer =
  document.getElementById("featuredBusinesses");

const homepageAdsContainer =
  document.getElementById("homepageAds");

const categoryImages = {
  "Automotive": "images/categories/automotive.jpg",
  "Food & Dining": "images/categories/food-dining.jpg",
  "Home Services": "images/categories/home-services.jpg",
  "Health & Beauty": "images/categories/health-beauty.jpg",
  "Shopping": "images/categories/shopping.jpg",
  "Real Estate": "images/categories/real-estate.jpg",
  "Entertainment": "images/categories/entertainment.jpg",
  "Churches": "images/categories/churches.jpg",
  "Fitness": "images/categories/fitness.jpg",
  "Professional Services": "images/categories/professional-services.jpg",
  "Other": "images/categories/professional-services.jpg"
};

loadHomepageData();

async function loadHomepageData() {

  await Promise.all([
    loadBusinessesFromServer(),
    loadAdsFromServer()
  ]);

  renderHomepageAds();
  renderFeaturedBusinesses();
}

async function loadBusinessesFromServer() {

  try {

    const response =
      await fetch("/.netlify/functions/businesses");

    const data =
      await response.json();

    if (Array.isArray(data)) {

      savedBusinesses = data;

      localStorage.setItem(
        "countyCompassBusinesses",
        JSON.stringify(data)
      );

    } else {

      savedBusinesses =
        JSON.parse(
          localStorage.getItem("countyCompassBusinesses")
        ) || [];
    }

  } catch (error) {

    console.error(error);

    savedBusinesses =
      JSON.parse(
        localStorage.getItem("countyCompassBusinesses")
      ) || [];
  }
}

async function loadAdsFromServer() {

  try {

    const response =
      await fetch("/.netlify/functions/ads");

    const data =
      await response.json();

    if (Array.isArray(data)) {

      savedAds = data;

      localStorage.setItem(
        "countyCompassAds",
        JSON.stringify(data)
      );

    } else {

      savedAds =
        JSON.parse(
          localStorage.getItem("countyCompassAds")
        ) || [];
    }

  } catch (error) {

    console.error(error);

    savedAds =
      JSON.parse(
        localStorage.getItem("countyCompassAds")
      ) || [];
  }
}

function getCategoryImage(category) {

  return (
    categoryImages[category] ||
    "images/categories/professional-services.jpg"
  );
}

function getBusinessImage(business) {

  if (
    business.image &&
    business.image.trim() !== ""
  ) {
    return business.image;
  }

  return getCategoryImage(
    business.category
  );
}

function getGoodUrl(link) {

  if (!link || link.trim() === "") {
    return "#";
  }

  if (
    link.startsWith("http://") ||
    link.startsWith("https://")
  ) {
    return link;
  }

  return "https://" + link;
}

function renderHomepageAds() {

  if (!homepageAdsContainer) {
    return;
  }

  const homepageAds =
    savedAds.filter(function(ad) {

      return (
        ad.location === "homepage" &&
        ad.active === "Yes"
      );
    });

  homepageAdsContainer.innerHTML = "";

  homepageAds.forEach(function(ad) {

    const shapeClass =
      ad.shape
        ? "ad-" + ad.shape.toLowerCase()
        : "ad-square";

    const adLink =
      getGoodUrl(ad.link);

    homepageAdsContainer.innerHTML += `
      <a
        href="${adLink}"
        target="_blank"
        class="site-ad ${shapeClass}"
      >
        <img
          src="${ad.image}"
          alt="${ad.title}"
          class="site-ad-image"
          onerror="this.onerror=null; this.style.display='none';"
        >
      </a>
    `;
  });
}

function renderFeaturedBusinesses() {

  if (!featuredContainer) {
    return;
  }

  const featuredBusinesses =
    savedBusinesses.filter(function(business) {

      return business.featured === "Yes";
    });

  if (featuredBusinesses.length === 0) {

    featuredContainer.innerHTML = `
      <p class="empty-message">
        No featured businesses available yet.
      </p>
    `;

    return;
  }

  featuredContainer.innerHTML = "";

  featuredBusinesses
    .slice(0, 6)
    .forEach(function(business) {

      const mapsLink =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(
          business.address
        );

      const websiteButton =
        business.website
          ? `
            <a
              href="${getGoodUrl(business.website)}"
              target="_blank"
            >
              Visit Website
            </a>
          `
          : "";

      const fallbackImage =
        getCategoryImage(
          business.category
        );

      featuredContainer.innerHTML += `
        <article class="business-card">

          <img
            src="${getBusinessImage(business)}"
            alt="${business.category}"
            class="business-card-image"
            onerror="this.onerror=null; this.src='${fallbackImage}';"
          >

          <h2>
            ${business.name}
          </h2>

          <p>
            <strong>Category:</strong>
            ${business.category}
          </p>

          <p class="business-description">
            ${business.description}
          </p>

          <a
            href="${mapsLink}"
            target="_blank"
          >
            Get Directions
          </a>

          ${websiteButton}

        </article>
      `;
    });
}