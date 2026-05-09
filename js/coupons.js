const savedCoupons =
  JSON.parse(localStorage.getItem("countyCompassCoupons")) || [];

const couponGrid = document.getElementById("couponGrid");

let visibleCouponCount = 12;

const couponCategoryImages = {
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
  "Other": "images/categories/coupons.jpg"
};

renderCoupons(savedCoupons);

function getCouponFallbackImage(coupon) {
  return couponCategoryImages[coupon.category] || "images/categories/coupons.jpg";
}

function getCouponImage(coupon) {
  if (coupon.image && coupon.image.trim() !== "") return coupon.image;
  return getCouponFallbackImage(coupon);
}

function renderCoupons(couponsToShow) {
  if (!couponGrid) return;

  couponGrid.innerHTML = "";

  if (couponsToShow.length === 0) {
    couponGrid.innerHTML = `<p class="empty-message">No coupons found.</p>`;
    return;
  }

  couponsToShow.slice(0, visibleCouponCount).forEach(function(coupon) {
    const fallbackImage = getCouponFallbackImage(coupon);

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

        <p class="coupon-business">${coupon.businessName}</p>

        <p>
          <strong>Category:</strong>
          ${coupon.category || "General"}
        </p>

        <p class="business-description">
          ${coupon.details}
        </p>
      </article>
    `;
  });

  if (couponsToShow.length > visibleCouponCount) {
    couponGrid.innerHTML += `
      <div class="load-more-wrap">
        <button type="button" onclick="loadMoreCoupons()">
          Load More Coupons
        </button>
      </div>
    `;
  }
}

function loadMoreCoupons() {
  visibleCouponCount += 12;
  renderCoupons(savedCoupons);
}