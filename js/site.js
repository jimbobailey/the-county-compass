console.log("The County Compass Loaded");

let savedBusinesses =
  JSON.parse(
    localStorage.getItem("countyCompassBusinesses")
  ) || [];

let savedAds =
  JSON.parse(
    localStorage.getItem("countyCompassAds")
  ) || [];

const featuredContainer =
  document.getElementById("featuredBusinesses");

const homepageAdsContainer =
  document.getElementById("homepageAds");

const categoryImages = {

  "Automotive":
    "images/categories/automotive.jpg",

  "Food & Dining":
    "images/categories/food-dining.jpg",

  "Home Services":
    "images/categories/home-services.jpg",

  "Health & Beauty":
    "images/categories/health-beauty.jpg",

  "Shopping":
    "images/categories/shopping.jpg",

  "Real Estate":
    "images/categories/real-estate.jpg",

  "Entertainment":
    "images/categories/entertainment.jpg",

  "Churches":
    "images/categories/churches.jpg",

  "Fitness":
    "images/categories/fitness.jpg",

  "Professional Services":
    "images/categories/professional-services.jpg",

  "Other":
    "images/categories/professional-services.jpg"
};

loadHomepageData();

function loadHomepageData() {

  savedBusinesses =
    JSON.parse(
      localStorage.getItem("countyCompassBusinesses")
    ) || [];

  savedAds =
    JSON.parse(
      localStorage.getItem("countyCompassAds")
    ) || [];

  renderHomepageAds();
  renderFeaturedBusinesses();
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

  today.setHours(0,0,0,0);

  return ads.filter(function(ad) {

    if (ad.active !== "Yes") {
      return false;
    }

    if (!ad.expiration) {
      return true;
    }

    const expirationDate =
      new Date(
        ad.expiration + "T00:00:00"
      );

    return expirationDate >= today;
  });
}

function getActiveBusinesses(businesses) {

  const today =
    new Date();

  today.setHours(0,0,0,0);

  return businesses.filter(function(business) {

    if (
      business.paid !== "Yes"
    ) {
      return true;
    }

    if (!business.expiration) {
      return true;
    }

    const expirationDate =
      new Date(
        business.expiration + "T00:00:00"
      );

    return expirationDate >= today;
  });
}

function renderHomepageAds() {

  if (!homepageAdsContainer) {
    return;
  }

  const homepageAds =
    getActiveAds(savedAds)
      .filter(function(ad) {

        return (
          ad.location === "homepage"
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

  const activeBusinesses =
    getActiveBusinesses(savedBusinesses);

  const featuredBusinesses =
    activeBusinesses.filter(function(business) {

      const currentPage =
        window.location.pathname
          .split("/")
          .pop()
          .replace(".html", "") || "index";

      return (
        business.featured === "Yes" &&
        (
          business.featuredLocation === "all" ||

          (
            currentPage === "index" &&
            business.featuredLocation === "homepage"
          ) ||

          (
            currentPage === "businesses" &&
            business.featuredLocation === "businesses"
          ) ||

          (
            currentPage === "coupons" &&
            business.featuredLocation === "coupons"
          ) ||

          (
            currentPage === "events" &&
            business.featuredLocation === "events"
          ) ||

          (
            currentPage === "hiring" &&
            business.featuredLocation === "hiring"
          )
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
            alt="${business.name}"
            class="site-ad-image"
            onerror="this.onerror=null; this.src='${fallbackImage}';"
          >

        </a>
      `;
    });
}