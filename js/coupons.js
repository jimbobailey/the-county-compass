const savedCoupons =
  JSON.parse(localStorage.getItem("countyCompassCoupons")) || [];

const couponGrid =
  document.getElementById("couponGrid");

let visibleCouponCount = 12;

const couponCategoryImages = {
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
  "Other": "images/categories/coupons.jpg"
};

renderCoupons(
  getActiveCoupons()
);

function getActiveCoupons() {
  const today =
    new Date();

  today.setHours(0, 0, 0, 0);

  return savedCoupons.filter(function(coupon) {
    if (!coupon.expiration) {
      return true;
    }

    const expirationDate =
      new Date(
        coupon.expiration + "T00:00:00"
      );

    return expirationDate >= today;
  });
}

function getCouponFallbackImage(coupon) {
  return (
    couponCategoryImages[coupon.category] ||
    "images/categories/coupons.jpg"
  );
}

function getCouponImage(coupon) {
  if (
    coupon.image &&
    coupon.image.trim() !== ""
  ) {
    return coupon.image;
  }

  return getCouponFallbackImage(coupon);
}

function formatExpirationDate(dateValue) {
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

function renderCoupons(couponsToShow) {
  if (!couponGrid) {
    return;
  }

  couponGrid.innerHTML = "";

  if (couponsToShow.length === 0) {
    couponGrid.innerHTML = `
      <p class="empty-message">
        No coupons found.
      </p>
    `;

    return;
  }

  couponsToShow
    .slice(0, visibleCouponCount)
    .forEach(function(coupon) {
      const fallbackImage =
        getCouponFallbackImage(coupon);

      const expirationLine =
        coupon.expiration
          ? `
            <p class="coupon-expiration">
              Expires ${formatExpirationDate(coupon.expiration)}
            </p>
          `
          : "";

      couponGrid.innerHTML += `
        <article class="coupon-card">

          <img
            src="${getCouponImage(coupon)}"
            alt="${coupon.title}"
            class="business-card-image"
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackImage}';"
          >

          <div class="coupon-tag">Local Deal</div>

          <h2>${coupon.title}</h2>

          <p class="coupon-business">
            ${coupon.businessName}
          </p>

          <p>
            ${coupon.category || "General"}
          </p>

          ${expirationLine}

          <p class="business-description">
            ${coupon.details}
          </p>

        </article>
      `;
    });

  if (
    couponsToShow.length >
    visibleCouponCount
  ) {
    couponGrid.innerHTML += `
      <div class="load-more-wrap">

        <button
          type="button"
          onclick="loadMoreCoupons()"
        >
          Load More Coupons
        </button>

      </div>
    `;
  }
}

function loadMoreCoupons() {
  visibleCouponCount += 12;

  renderCoupons(
    getActiveCoupons()
  );
}