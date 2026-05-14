let savedBusinesses = [];

const businessList =
  document.getElementById("businessList");

const categoryFilter =
  document.getElementById("categoryFilter");

const businessSearchInput =
  document.getElementById("businessSearchInput");

let visibleBusinessCount = 12;

const categoryImages = {
  "Automotive Repair": "images/categories/automotive.jpg",
  "Automotive Services": "images/categories/automotive.jpg",
  "Churches": "images/categories/churches.jpg",
  "Custom Crafts & Fabrication": "images/categories/shopping.jpg",
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

function loadBusinessesFromServer() {

  savedBusinesses =
    JSON.parse(
      localStorage.getItem("countyCompassBusinesses")
    ) || [];

  applyCategoryFromUrl();

  renderBusinesses(
    getFilteredBusinesses()
  );
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

function formatPhoneNumber(value) {

  const cleaned =
    String(value || "").replace(/\D/g, "");

  if (cleaned.length <= 3) {
    return cleaned;
  }

  if (cleaned.length <= 6) {
    return "(" + cleaned.slice(0,3) + ") " + cleaned.slice(3);
  }

  return (
    "(" +
    cleaned.slice(0,3) +
    ") " +
    cleaned.slice(3,6) +
    "-" +
    cleaned.slice(6,10)
  );
}

function applyCategoryFromUrl() {

  const urlParams =
    new URLSearchParams(window.location.search);

  const categoryFromUrl =
    urlParams.get("category");

  if (
    categoryFromUrl &&
    categoryFilter
  ) {
    categoryFilter.value =
      categoryFromUrl;
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

function getFilteredBusinesses() {

  const activeBusinesses =
    getActiveBusinesses(savedBusinesses);

  const searchInput =
    businessSearchInput
      ? businessSearchInput.value.toLowerCase().trim()
      : "";

  const selectedCategory =
    categoryFilter
      ? categoryFilter.value
      : "all";

  return activeBusinesses.filter(
    function(business) {

      const name =
        business.name
          ? business.name.toLowerCase()
          : "";

      const category =
        business.category
          ? business.category.toLowerCase()
          : "";

      const address =
        business.address
          ? business.address.toLowerCase()
          : "";

      const phone =
        business.phone
          ? business.phone.toLowerCase()
          : "";

      const description =
        business.description
          ? business.description.toLowerCase()
          : "";

      const matchesSearch =
        name.includes(searchInput) ||
        category.includes(searchInput) ||
        address.includes(searchInput) ||
        phone.includes(searchInput) ||
        description.includes(searchInput);

      const matchesCategory =
        selectedCategory === "all" ||
        selectedCategory === "" ||
        business.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );
}

function renderBusinesses(businessesToShow) {

  if (!businessList) {
    return;
  }

  businessList.innerHTML = "";

  if (businessesToShow.length === 0) {

    businessList.innerHTML = `
      <p class="empty-message">
        No businesses found.
      </p>
    `;

    return;
  }

  businessesToShow
    .slice(0, visibleBusinessCount)
    .forEach(function(business) {

      const mapsLink =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(
          business.address
        );

      const websiteUrl =
        makeGoodUrl(
          business.website
        );

      const fallbackImage =
        getCategoryImage(
          business.category
        );

      const displayPhone =
        formatPhoneNumber(
          business.phone
        );

      businessList.innerHTML += `

        <article class="business-card compact-business-card">

          <img
            src="${getBusinessImage(business)}"
            alt="${business.category}"
            class="business-card-image compact-business-image"
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackImage}';"
          >

          <h2>
            ${business.name}
          </h2>

          <p class="business-category">
            ${business.category}
          </p>

          <p class="business-address">
            ${business.address}
          </p>

          <p class="business-phone">
            ${displayPhone}
          </p>

          <p class="business-description compact-description">
            ${business.description}
          </p>

          <div class="business-button-row">

            <a
              href="${mapsLink}"
              target="_blank"
              class="compact-button"
            >
              Directions
            </a>

            ${
              websiteUrl
                ? `
                  <a
                    href="${websiteUrl}"
                    target="_blank"
                    class="compact-button"
                  >
                    Website
                  </a>
                `
                : ""
            }

          </div>

        </article>

      `;
    });

  if (
    businessesToShow.length >
    visibleBusinessCount
  ) {

    businessList.innerHTML += `
      <div class="load-more-wrap">

        <button
          type="button"
          onclick="loadMoreBusinesses()"
        >
          Load More Businesses
        </button>

      </div>
    `;
  }
}

function filterBusinesses() {

  visibleBusinessCount = 12;

  renderBusinesses(
    getFilteredBusinesses()
  );
}

function loadMoreBusinesses() {

  visibleBusinessCount += 12;

  renderBusinesses(
    getFilteredBusinesses()
  );
}

loadBusinessesFromServer();