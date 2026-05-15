console.log("The County Compass Loaded");

let savedBusinesses =
  JSON.parse(localStorage.getItem("countyCompassBusinesses")) || [];

let savedAds =
  JSON.parse(localStorage.getItem("countyCompassAds")) || [];

const featuredContainer =
  document.getElementById("featuredBusinesses");

const homepageAdsContainer =
  document.getElementById("homepageAds");

const categoryImages = {
  "Automotive Repair": "images/categories/automotive.jpg",
  "Automotive Services": "images/categories/automotive.jpg",
  "Churches": "images/categories/churches.jpg",
  "Custom Crafts & Fabrication": "images/categories/shopping.jpg",
  "Catering & Event Services": "images/categories/catering-event-services.jpg",
  "Entertainment": "images/categories/entertainment.jpg",
  "Fitness": "images/categories/fitness.jpg",
  "Food & Dining": "images/categories/food-dining.jpg",
  "Gravel, Rock & Fill Dirt": "images/categories/home-services.jpg",
  "Handyman Services": "images/categories/home-services.jpg",
  "Health & Beauty": "images/categories/health-beauty.jpg",
  "Home Improvement": "images/categories/home-services.jpg",
  "IT & Computer Repair": "images/categories/professional-services.jpg",
  "Land Clearing & Tractor Services": "images/categories/home-services.jpg",
  "Landscaping": "images/categories/home-services.jpg",
  "Locksmithing": "images/categories/professional-services.jpg",
  "Professional Services": "images/categories/professional-services.jpg",
  "Real Estate": "images/categories/real-estate.jpg",
  "Shopping": "images/categories/shopping.jpg",
  "Other": "images/categories/professional-services.jpg"
};

loadHomepageData();

async function loadHomepageData() {
  await loadBusinessesFromServer();
  await loadAdsFromServer();

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
        JSON.stringify(savedBusinesses)
      );
    }
  } catch (error) {
    console.error("Homepage business load failed:", error);

    savedBusinesses =
      JSON.parse(localStorage.getItem("countyCompassBusinesses")) || [];
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
        JSON.stringify(savedAds)
      );
    }
  } catch (error) {
    console.error("Homepage ads load failed:", error);

    savedAds =
      JSON.parse(localStorage.getItem("countyCompassAds")) || [];
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

function getActiveAds(ads) {
  const today =
    new Date();

  today.setHours(0, 0, 0, 0);

  return ads.filter(function(ad) {
    if (ad.active !== "Yes") {
      return false;
    }

    if (!ad.expiration) {
      return true;
    }

    const expirationDate =
      new Date(ad.expiration + "T00:00:00");

    expirationDate.setHours(0, 0, 0, 0);

    return expirationDate >= today;
  });
}

function getActiveBusinesses(businesses) {
  const today =
    new Date();

  today.setHours(0, 0, 0, 0);

  return businesses.filter(function(business) {
    if (business.paid !== "Yes") {
      return true;
    }

    if (!business.expiration) {
      return true;
    }

    const expirationDate =
      new Date(business.expiration + "T00:00:00");

    expirationDate.setHours(0, 0, 0, 0);

    return expirationDate >= today;
  });
}

function getPageName() {
  const currentPage =
    window.location.pathname
      .split("/")
      .pop()
      .replace(".html", "") || "index";

  return currentPage === "index"
    ? "homepage"
    : currentPage;
}

function renderHomepageAds() {
  if (!homepageAdsContainer) {
    return;
  }

  const pageName =
    getPageName();

  const homepageAds =
    getActiveAds(savedAds)
      .filter(function(ad) {
        return ad.location === pageName;
      });

  homepageAdsContainer.innerHTML = "";

  if (homepageAds.length === 0) {
    return;
  }

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
          src="${ad.image || ""}"
          alt="${ad.title || "Advertisement"}"
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

  const pageName =
    getPageName();

  const activeBusinesses =
    getActiveBusinesses(savedBusinesses);

  const featuredBusinesses =
    activeBusinesses.filter(function(business) {
      return (
        business.featured === "Yes" &&
        (
          business.featuredLocation === "all" ||
          business.featuredLocation === pageName
        )
      );
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
    .slice(0, 20)
    .forEach(function(business) {
      const businessLink =
        business.website
          ? getGoodUrl(business.website)
          : "#";

      const fallbackImage =
        getCategoryImage(
          business.category
        );

      featuredContainer.innerHTML += `
        <a
          href="${businessLink}"
          target="_blank"
          class="site-ad ad-square"
        >
          <img
            src="${getBusinessImage(business)}"
            alt="${business.name || "Featured Business"}"
            class="site-ad-image"
            onerror="this.onerror=null; this.src='${fallbackImage}';"
          >
        </a>
      `;
    });
}