console.log("The County Compass Loaded");

let savedBusinesses = [];

const featuredContainer =
  document.getElementById("featuredBusinesses");

const categoryImages = {
  "Automotive Repair": "images/categories/automotive.jpg",
  "Automotive Services": "images/categories/automotive.jpg",
  "Churches": "images/categories/churches.jpg",
  "Cleaning Services": "images/categories/home-services.jpg",
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
  "Massage & Spa Services": "images/categories/health-beauty.jpg",
  "Medical & Dental": "images/categories/health-beauty.jpg",
  "Professional Services": "images/categories/professional-services.jpg",
  "Real Estate": "images/categories/real-estate.jpg",
  "RV Sales & Service": "images/categories/automotive.jpg",
  "Shopping": "images/categories/shopping.jpg",
  "Other": "images/categories/professional-services.jpg"
};

loadFeaturedBusinesses();

async function loadFeaturedBusinesses() {
  try {
    const response = await fetch("/.netlify/functions/businesses");
    const data = await response.json();

    savedBusinesses = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Featured business load failed:", error);
    savedBusinesses = [];
  }

  renderFeaturedBusinesses();
}

function getCategoryImage(category) {
  return (
    categoryImages[category] ||
    "images/categories/professional-services.jpg"
  );
}

function getBusinessImage(business) {
  if (business.image && business.image.trim() !== "") {
    return business.image;
  }

  return getCategoryImage(business.category);
}

function getGoodUrl(link) {
  if (!link || link.trim() === "") {
    return "#";
  }

  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  }

  return "https://" + link;
}

function getActiveBusinesses(businesses) {
  const today = new Date();
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

function renderFeaturedBusinesses() {
  if (!featuredContainer) {
    return;
  }

  const currentPage =
    window.location.pathname
      .split("/")
      .pop()
      .replace(".html", "") || "index";

  const pageName =
    currentPage === "index"
      ? "homepage"
      : currentPage;

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

  featuredContainer.innerHTML = "";

  if (featuredBusinesses.length === 0) {
    featuredContainer.innerHTML = `
      <p class="empty-message">
        No featured businesses available yet.
      </p>
    `;
    return;
  }

  featuredBusinesses
    .slice(0, 20)
    .forEach(function(business) {
      const businessLink =
        business.website
          ? getGoodUrl(business.website)
          : "#";

      const fallbackImage =
        getCategoryImage(business.category);

      featuredContainer.innerHTML += `
        <a
          href="${businessLink}"
          target="_blank"
          class="site-ad site-ad-link ad-square"
        >
          <span class="card-link-badge">Take Me There ↗</span>

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