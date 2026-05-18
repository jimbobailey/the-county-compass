let savedCoupons = [];

const couponGrid = document.getElementById("couponGrid");

let visibleCouponCount = 12;

loadCouponsFromServer();

async function loadCouponsFromServer() {
  try {
    const response = await fetch("/.netlify/functions/coupons");
    const data = await response.json();

    savedCoupons = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Coupon load failed:", error);
    savedCoupons = [];
  }

  renderCoupons(getActiveCoupons());
}

function getActiveCoupons() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return savedCoupons.filter(function(coupon) {
    if ((coupon.status || "Active") === "Hidden") {
      return false;
    }

    if (
      coupon.neverExpires === "Yes" ||
      coupon.status === "Never Expires"
    ) {
      return true;
    }

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
      const expirationLine = coupon.expiration
        ? `
          <p class="coupon-expiration">
            Expires ${formatExpirationDate(coupon.expiration)}
          </p>
        `
        : "";

      const couponLink =
        makeGoodUrl(
          coupon.website ||
          coupon.link ||
          ""
        );

      couponGrid.innerHTML += `
        <article class="business-card compact-business-card">

          ${
            couponLink
              ? `
                <a
                  href="${couponLink}"
                  target="_blank"
                  class="card-image-link"
                  aria-label="Open deal link"
                >
                  <span class="card-link-badge">Take Me There ↗</span>
                  <img
                    src="${getCouponImage(coupon)}"
                    alt="${coupon.title || "Coupon"}"
                    class="business-card-image compact-business-image"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='images/categories/coupons.jpg';"
                  >
                </a>
              `
              : `
                <img
                  src="${getCouponImage(coupon)}"
                  alt="${coupon.title || "Coupon"}"
                  class="business-card-image compact-business-image"
                  loading="lazy"
                  onerror="this.onerror=null; this.src='images/categories/coupons.jpg';"
                >
              `
          }

          <div class="coupon-tag">Local Deal</div>

          <h2>${coupon.title || ""}</h2>

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
        <button type="button" onclick="loadMoreCoupons()">
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