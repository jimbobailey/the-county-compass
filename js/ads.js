let countyCompassAds = [];

loadAdsFromServer();

async function loadAdsFromServer() {

  try {

    const response =
      await fetch("/.netlify/functions/ads");

    const data =
      await response.json();

    if (Array.isArray(data)) {

      countyCompassAds = data;

      localStorage.setItem(
        "countyCompassAds",
        JSON.stringify(countyCompassAds)
      );

    } else {

      countyCompassAds =
        JSON.parse(
          localStorage.getItem("countyCompassAds")
        ) || [];
    }

  } catch (error) {

    console.error("Ads load failed:", error);

    countyCompassAds =
      JSON.parse(
        localStorage.getItem("countyCompassAds")
      ) || [];
  }

  renderAds("homepage", "homepageAds");
  renderAds("businesses", "businessesAds");
  renderAds("coupons", "couponsAds");
  renderAds("events", "eventsAds");
  renderAds("hiring", "hiringAds");
}

function shuffleArray(array) {

  const newArray =
    [...array];

  for (
    let i = newArray.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      newArray[i],
      newArray[j]
    ] = [
      newArray[j],
      newArray[i]
    ];
  }

  return newArray;
}

function getRotatedAds(locationName) {

  const rotationKey =
    "countyCompassRotation_" +
    locationName;

  const rotationDateKey =
    rotationKey + "_date";

  const now =
    new Date();

  const today =
    now.toISOString().split("T")[0];

  const lastRotationDate =
    localStorage.getItem(rotationDateKey);

  const todayDate =
    new Date(today + "T00:00:00");

  const storedDate =
    lastRotationDate
      ? new Date(lastRotationDate + "T00:00:00")
      : null;

  let daysDifference = 999;

  if (storedDate) {

    daysDifference =
      Math.floor(
        (
          todayDate - storedDate
        ) /
        (1000 * 60 * 60 * 24)
      );
  }

  const todayFilter =
    new Date();

  todayFilter.setHours(0,0,0,0);

  const activeAds =
    countyCompassAds.filter(function(ad) {

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
        new Date(
          ad.expiration + "T00:00:00"
        );

      return expirationDate >= todayFilter;
    });

  if (
    !lastRotationDate ||
    daysDifference >= 7
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

  const savedOrder =
    JSON.parse(
      localStorage.getItem(rotationKey)
    ) || [];

  return savedOrder.filter(function(savedAd) {

    return activeAds.some(function(activeAd) {

      return activeAd.id === savedAd.id;
    });
  });
}

function renderAds(locationName, containerId) {

  const container =
    document.getElementById(containerId);

  if (!container) {
    return;
  }

  const adsToShow =
    getRotatedAds(locationName);

  if (adsToShow.length === 0) {

    container.innerHTML = "";

    return;
  }

  container.innerHTML = "";

  adsToShow.forEach(function(ad) {

    const shapeClass =
      ad.shape
        ? ad.shape.toLowerCase()
        : "square";

    const linkStart =
      ad.link &&
      ad.link.trim() !== ""
        ? `
          <a
            href="${ad.link}"
            target="_blank"
            class="site-ad site-ad-${shapeClass}"
          >
        `
        : `
          <div
            class="site-ad site-ad-${shapeClass}"
          >
        `;

    const linkEnd =
      ad.link &&
      ad.link.trim() !== ""
        ? "</a>"
        : "</div>";

    container.innerHTML += `

      ${linkStart}

        <img
          src="${ad.image}"
          alt="${ad.title}"
          class="site-ad-image"
        >

      ${linkEnd}

    `;
  });
}
