const savedCoupons =
  JSON.parse(localStorage.getItem("countyCompassCoupons")) || [];

const couponGrid =
  document.getElementById("couponGrid");

let visibleCouponCount = 12;

renderCoupons(getActiveCoupons());

function getActiveCoupons() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return savedCoupons.filter(function(coupon) {
    if (!coupon.expiration) {
      return true;
    }

    const expirationDate = new Date(coupon.expiration + "T00:00:00");
    expirationDate.setHours(0, 0, 0, 0);

    return expirationDate >= today;
  });
}

function getCouponImage(coupon) {
  if (coupon.image && coupon.image.trim() !== "") {
    return coupon.image;
  }

  return "images/categories/coupons.jpg";
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
      const expirationLine =
        coupon.expiration
          ? `
            <p class="coupon-expiration">
              Expires ${formatExpirationDate(coupon.expiration)}
            </p>
          `
          : "";

      couponGrid.innerHTML += `
        <article class="business-card compact-business-card">

          <img
            src="${getCouponImage(coupon)}"
            alt="${coupon.title || "Coupon"}"
            class="business-card-image compact-business-image"
            loading="lazy"
            onerror="this.onerror=null; this.src='images/categories/coupons.jpg';"
          >

          <div class="coupon-tag">Local Deal</div>

          <h2>
            ${coupon.title || ""}
          </h2>

          <p class="business-category">
            ${coupon.businessName || ""}
          </p>

          ${expirationLine}

          <p class="business-description compact-description">
            ${coupon.details || ""}
          </p>

        </article>
      `;
    });

  if (couponsToShow.length > visibleCouponCount) {
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
  renderCoupons(getActiveCoupons());
}