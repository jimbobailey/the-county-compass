const countyCompassAds =
  JSON.parse(localStorage.getItem("countyCompassAds")) || [];

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

    adImage.src = ad.image;
    adImage.alt = ad.title || "Advertisement";
    adImage.className = "site-ad-image";

    adAnchor.appendChild(adImage);
    container.appendChild(adAnchor);
  });
}

renderAdContainer("businessesAds", "businesses");
renderAdContainer("couponsAds", "coupons");
renderAdContainer("eventsAds", "events");