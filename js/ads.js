let countyCompassAds = [];

const sponsorRotationKey = "countyCompassSponsorRotation";
const sponsorRotationDateKey = "countyCompassSponsorRotationDate";
const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

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
        JSON.stringify(data)
      );
    } else {
      countyCompassAds =
        JSON.parse(localStorage.getItem("countyCompassAds")) || [];
    }
  } catch (error) {
    console.error(error);

    countyCompassAds =
      JSON.parse(localStorage.getItem("countyCompassAds")) || [];
  }

  countyCompassAds =
    getRotatedSponsorAds(countyCompassAds);

  renderAllAds();
}

function getRotatedSponsorAds(ads) {
  const lastRotation =
    localStorage.getItem(sponsorRotationDateKey);

  const savedRotation =
    JSON.parse(localStorage.getItem(sponsorRotationKey)) || null;

  const now =
    Date.now();

  if (
    savedRotation &&
    lastRotation &&
    now - Number(lastRotation) < sevenDaysMs
  ) {
    return savedRotation;
  }

  const shuffledAds =
    [...ads].sort(function() {
      return Math.random() - 0.5;
    });

  localStorage.setItem(
    sponsorRotationKey,
    JSON.stringify(shuffledAds)
  );

  localStorage.setItem(
    sponsorRotationDateKey,
    String(now)
  );

  return shuffledAds;
}

function makeAdUrl(link) {
  if (!link || link.trim() === "") {
    return "#";
  }

  if (
    link.startsWith("http://") ||
    link.startsWith("https://")
  ) {
    return link;
  }

  return "https://" + link;
}

function renderAdContainer(containerId, locationName) {
  const container =
    document.getElementById(containerId);

  if (!container) {
    return;
  }

  const adsToShow =
    countyCompassAds.filter(function(ad) {
      return (
        ad.location === locationName &&
        ad.active === "Yes"
      );
    });

  container.innerHTML = "";

  if (adsToShow.length === 0) {
    return;
  }

  adsToShow.forEach(function(ad) {
    const shape =
      ad.shape
        ? ad.shape.toLowerCase()
        : "square";

    const adLink =
      makeAdUrl(ad.link);

    const adAnchor =
      document.createElement("a");

    adAnchor.href = adLink;
    adAnchor.target = "_blank";
    adAnchor.rel = "noopener noreferrer";
    adAnchor.title = ad.title || "Advertisement";
    adAnchor.className = "site-ad ad-" + shape;

    const adImage =
      document.createElement("img");

    adImage.src =
      ad.image.replace(/\\/g, "/");

    adImage.alt =
      ad.title || "Advertisement";

    adImage.className =
      "site-ad-image";

    adAnchor.appendChild(adImage);

    container.appendChild(adAnchor);
  });
}

function renderAllAds() {
  renderAdContainer("homepageAds", "homepage");
  renderAdContainer("businessesAds", "businesses");
  renderAdContainer("couponsAds", "coupons");
  renderAdContainer("eventsAds", "events");
  renderAdContainer("hiringAds", "hiring");
}

loadAdsFromServer();