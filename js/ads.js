let countyCompassAds = [];

loadAdsFromServer();

async function loadAdsFromServer() {
  try {
    const response = await fetch("/.netlify/functions/ads");
    const data = await response.json();

    countyCompassAds = Array.isArray(data)
      ? data.map(function(ad) {
          return {
            ...ad,
            location: String(ad.location || "").trim().toLowerCase(),
            active: String(ad.active || "").trim(),
            image: String(ad.image || "").replace(/\\/g, "/")
          };
        })
      : [];

  } catch (error) {
    console.error("Ads load failed:", error);
    countyCompassAds = [];
  }

  renderAds("homepage", "homepageAds");
  renderAds("businesses", "businessesAds");
  renderAds("deals", "couponsAds");
  renderAds("events", "eventsAds");
  renderAds("hiring", "hiringAds");
}

function makeGoodUrl(link) {
  if (!link || link.trim() === "") {
    return "";
  }

  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  }

  return "https://" + link;
}

function getActiveAds(locationName) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return countyCompassAds.filter(function(ad) {
    const adLocation = String(ad.location || "").trim().toLowerCase();

    if (adLocation !== locationName && adLocation !== "all") {
      return false;
    }

    if (ad.active !== "Yes") {
      return false;
    }

    if (
      ad.neverExpires === "Yes" ||
      ad.status === "Never Expires"
    ) {
      return true;
    }

    if (!ad.expiration) {
      return true;
    }

    const expirationDate = new Date(ad.expiration + "T00:00:00");
    expirationDate.setHours(0, 0, 0, 0);

    return expirationDate >= today;
  });
}

function renderAds(locationName, containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  const adsToShow = getActiveAds(locationName);

  container.innerHTML = "";

  adsToShow.forEach(function(ad) {
    const shapeClass = ad.shape ? ad.shape.toLowerCase() : "square";
    const adUrl = makeGoodUrl(ad.link || "");

    const adImage = `
      <img
        src="${ad.image || ""}"
        alt="${ad.title || "Advertisement"}"
        class="site-ad-image"
        onerror="this.onerror=null; this.style.display='none';"
      >
    `;

    if (adUrl) {
      container.innerHTML += `
        <a href="${adUrl}" target="_blank" class="site-ad site-ad-${shapeClass}">
          ${adImage}
        </a>
      `;
    } else {
      container.innerHTML += `
        <div class="site-ad site-ad-${shapeClass}">
          ${adImage}
        </div>
      `;
    }
  });
}