const savedBusinesses =
  JSON.parse(localStorage.getItem("countyCompassBusinesses")) || [];

const businessList = document.getElementById("businessList");
const categoryFilter = document.getElementById("categoryFilter");
const businessSearchInput = document.getElementById("businessSearchInput");

let visibleBusinessCount = 12;

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

applyCategoryFromUrl();
renderBusinesses(getFilteredBusinesses());

function makeGoodUrl(link) {
  if (!link || link.trim() === "") return "";
  if (link.startsWith("http://") || link.startsWith("https://")) return link;
  return "https://" + link;
}

function applyCategoryFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get("category");

  if (categoryFromUrl && categoryFilter) {
    categoryFilter.value = categoryFromUrl;
  }
}

function getCategoryImage(category) {
  return categoryImages[category] || "images/categories/professional-services.jpg";
}

function getBusinessImage(business) {
  if (business.image && business.image.trim() !== "") return business.image;
  return getCategoryImage(business.category);
}

function getFilteredBusinesses() {
  const searchInput =
    businessSearchInput ? businessSearchInput.value.toLowerCase() : "";

  const selectedCategory =
    categoryFilter ? categoryFilter.value : "";

  return savedBusinesses.filter(function(business) {
    const matchesSearch =
      business.name.toLowerCase().includes(searchInput) ||
      business.category.toLowerCase().includes(searchInput) ||
      business.address.toLowerCase().includes(searchInput) ||
      business.description.toLowerCase().includes(searchInput);

    const matchesCategory =
      selectedCategory === "" || business.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
}

function renderBusinesses(businessesToShow) {
  if (!businessList) return;

  businessList.innerHTML = "";

  if (businessesToShow.length === 0) {
    businessList.innerHTML = `<p class="empty-message">No businesses found.</p>`;
    return;
  }

  businessesToShow.slice(0, visibleBusinessCount).forEach(function(business) {
    const mapsLink =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(business.address);

    const websiteUrl = makeGoodUrl(business.website);

    const websiteButton =
      websiteUrl
        ? `<a href="${websiteUrl}" target="_blank">Visit Website</a>`
        : "";

    const fallbackImage = getCategoryImage(business.category);

    businessList.innerHTML += `
      <article class="business-card">
        <img
          src="${getBusinessImage(business)}"
          alt="${business.category}"
          class="business-card-image"
          loading="lazy"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        >

        <h2>${business.name}</h2>

        <p><strong>Category:</strong> ${business.category}</p>
        <p><strong>Address:</strong> ${business.address}</p>
        <p><strong>Phone:</strong> ${business.phone}</p>

        <p class="business-description">
          ${business.description}
        </p>

        <a href="${mapsLink}" target="_blank">Get Directions</a>
        ${websiteButton}
      </article>
    `;
  });

  if (businessesToShow.length > visibleBusinessCount) {
    businessList.innerHTML += `
      <div class="load-more-wrap">
        <button type="button" onclick="loadMoreBusinesses()">
          Load More Businesses
        </button>
      </div>
    `;
  }
}

function filterBusinesses() {
  visibleBusinessCount = 12;
  renderBusinesses(getFilteredBusinesses());
}

function loadMoreBusinesses() {
  visibleBusinessCount += 12;
  renderBusinesses(getFilteredBusinesses());
}