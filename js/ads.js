let countyCompassAds = [];

loadAdsFromServer();

async function loadAdsFromServer() {
  try {
    const response = await fetch("/.netlify/functions/ads");
    const data = await response.json();

    if (Array.isArray(data)) {
      countyCompassAds = data;

      localStorage.setItem(
        "countyCompassAds",
        JSON.stringify(countyCompassAds)
      );
    } else {
      countyCompassAds =
        JSON.parse(localStorage.getItem("countyCompassAds")) || [];
    }
  } catch (error) {
    console.error("Ads load failed:", error);

    countyCompassAds =
      JSON.parse(localStorage.getItem("countyCompassAds")) || [];
  }

  renderAds("homepage", "homepageAds");
  renderAds("businesses", "businessesAds");
  renderAds("coupons", "couponsAds");
  renderAds("events", "eventsAds");
  renderAds("hiring", "hiringAds");
}

function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j =
      Math.floor(Math.random() * (i + 1));

    [newArray[i], newArray[j]] =
      [newArray[j], newArray[i]];
  }

  return newArray;
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

function getActiveAds(locationName) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return countyCompassAds.filter(function(ad) {
    if (
      ad.location !== locationName ||
      ad.active !== "Yes"
    ) {
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

function getRotatedAds(locationName) {
  const rotationKey =
    "countyCompassRotation_" + locationName;

  const rotationDateKey =
    rotationKey + "_date";

  const today =
    new Date().toISOString().split("T")[0];

  const activeAds =
    getActiveAds(locationName);

  if (activeAds.length === 0) {
    localStorage.removeItem(rotationKey);
    localStorage.removeItem(rotationDateKey);
    return [];
  }

  const lastRotationDate =
    localStorage.getItem(rotationDateKey);

  const savedOrder =
    JSON.parse(localStorage.getItem(rotationKey)) || [];

  const stillValidSavedOrder =
    savedOrder.filter(function(savedAd) {
      return activeAds.some(function(activeAd) {
        return activeAd.id === savedAd.id;
      });
    });

  if (
    !lastRotationDate ||
    lastRotationDate !== today ||
    stillValidSavedOrder.length === 0
  ) {
    const shuffledAds =
      shuffleArray(activeAds);

    localStorage.setItem(
      rotationKey,
      JSON.stringify(shuffledAds)
    );

    localStorage.setItem(
      rotationDateKey,
      today
    );

    return shuffledAds;
  }

  return stillValidSavedOrder;
}

function renderAds(locationName, containerId) {
  const container =
    document.getElementById(containerId);

  if (!container) {
    return;
  }

  const adsToShow =
    getRotatedAds(locationName);

  container.innerHTML = "";

  adsToShow.forEach(function(ad) {
    const shapeClass =
      ad.shape
        ? ad.shape.toLowerCase()
        : "square";

    const adUrl =
      makeGoodUrl(ad.link || "");

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
        <a
          href="${adUrl}"
          target="_blank"
          class="site-ad site-ad-${shapeClass}"
        >
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