let businesses = [];

let editingBusinessId = null;

let coupons =
  JSON.parse(localStorage.getItem("countyCompassCoupons")) || [];

let editingCouponId = null;

let events =
  JSON.parse(localStorage.getItem("countyCompassEvents")) || [];

let editingEventId = null;

let ads =
  JSON.parse(localStorage.getItem("countyCompassAds")) || [];

let editingAdId = null;

loadBusinessesFromServer();

renderCouponPreviews();
renderEventPreviews();
renderAdPreviews();

async function loadBusinessesFromServer() {
  try {
    const response =
      await fetch("/.netlify/functions/businesses");

    const data =
      await response.json();

    if (Array.isArray(data)) {
      businesses = data;

      localStorage.setItem(
        "countyCompassBusinesses",
        JSON.stringify(data)
      );
    } else {
      businesses =
        JSON.parse(localStorage.getItem("countyCompassBusinesses")) || [];
    }
  } catch (error) {
    console.error(error);

    businesses =
      JSON.parse(localStorage.getItem("countyCompassBusinesses")) || [];
  }

  renderBusinessPreviews();
}

async function saveBusinesses() {
  localStorage.setItem(
    "countyCompassBusinesses",
    JSON.stringify(businesses)
  );

  try {
    await fetch(
      "/.netlify/functions/businesses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(businesses)
      }
    );
  } catch (error) {
    console.error("Business sync failed:", error);
  }
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 100000);
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function setValue(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.value = value || "";
  }
}

function resetPreviewImage(id) {
  const preview = document.getElementById(id);

  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }
}

function setPreviewImage(id, imagePath) {
  const preview = document.getElementById(id);

  if (preview && imagePath) {
    preview.src = imagePath;
    preview.style.display = "block";
  }
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

function saveCoupons() {
  localStorage.setItem(
    "countyCompassCoupons",
    JSON.stringify(coupons)
  );
}

async function saveEvents() {
  localStorage.setItem(
    "countyCompassEvents",
    JSON.stringify(events)
  );

  try {
    await fetch(
      "/.netlify/functions/events",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(events)
      }
    );
  } catch (error) {
    console.error("Event sync failed:", error);
  }
}

async function saveAds() {
  localStorage.setItem(
    "countyCompassAds",
    JSON.stringify(ads)
  );

  try {
    await fetch(
      "/.netlify/functions/ads",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ads)
      }
    );
  } catch (error) {
    console.error("Ad sync failed:", error);
  }
}

function getCategoryImage(category) {
  const categoryImages = {

  "Automotive Repair":
    "images/categories/automotive.jpg",

  "Automotive Services":
    "images/categories/automotive.jpg",

  "Churches":
    "images/categories/churches.jpg",

  "Custom Crafts & Fabrication":
    "images/categories/shopping.jpg",

  "Entertainment":
    "images/categories/entertainment.jpg",

  "Fitness":
    "images/categories/fitness.jpg",

  "Food & Dining":
    "images/categories/food-dining.jpg",

  "Gravel, Rock & Fill Dirt":
    "images/categories/home-services.jpg",

  "Handyman Services":
    "images/categories/home-services.jpg",

  "Health & Beauty":
    "images/categories/health-beauty.jpg",

  "Home Improvement":
    "images/categories/home-services.jpg",

  "IT & Computer Repair":
    "images/categories/professional-services.jpg",

  "Land Clearing & Tractor Services":
    "images/categories/home-services.jpg",

  "Landscaping":
    "images/categories/home-services.jpg",

  "Professional Services":
    "images/categories/professional-services.jpg",

  "Real Estate":
    "images/categories/real-estate.jpg",

  "Shopping":
    "images/categories/shopping.jpg",

  "Other":
    "images/categories/professional-services.jpg"
};

  return categoryImages[category] || "images/categories/professional-services.jpg";
}

/* BUSINESS */

async function addBusinessPreview() {
  const name = getValue("businessName");
  const category = getValue("businessCategory");
  const address = getValue("businessAddress");
  const phone = getValue("businessPhone");
  const website = makeGoodUrl(getValue("businessWebsite"));
  const image = getValue("businessImage");
  const paid = getValue("businessPaid");
  const featured = getValue("businessFeatured");
  const description = getValue("businessDescription");

  if (!name || !category || !address || !phone || !description) {
    alert("Please complete all required business fields.");
    return;
  }

  const duplicate =
    businesses.some(function(business) {
      return (
        business.name.toLowerCase() === name.toLowerCase() &&
        business.address.toLowerCase() === address.toLowerCase() &&
        business.id !== editingBusinessId
      );
    });

  if (duplicate) {
    alert("This business already exists.");
    return;
  }

  if (editingBusinessId) {
    businesses =
      businesses.map(function(business) {
        if (business.id === editingBusinessId) {
          return {
            id: editingBusinessId,
            name,
            category,
            address,
            phone,
            website,
            image,
            paid,
            featured,
            description
          };
        }

        return business;
      });

    editingBusinessId = null;

    const button = document.getElementById("businessSubmitButton");

    if (button) {
      button.textContent = "Add Business";
    }

    alert("Business updated.");
  } else {
    businesses.unshift({
      id: generateId(),
      name,
      category,
      address,
      phone,
      website,
      image,
      paid,
      featured,
      description
    });

    alert("Business added.");
  }

  await saveBusinesses();
  renderBusinessPreviews();
  clearBusinessForm();
}

function renderBusinessPreviews() {
  const area = document.getElementById("businessPreviewArea");

  if (!area) {
    return;
  }

  area.innerHTML = "";

  businesses.forEach(function(business) {
    const imagePath =
      business.image && business.image.trim() !== ""
        ? business.image
        : getCategoryImage(business.category);

    const fallbackImage =
      getCategoryImage(business.category);

    area.innerHTML += `
      <article class="business-card">

        <img
          src="${imagePath}"
          alt="${business.name}"
          class="business-card-image"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        >

        <h2>${business.name}</h2>

        <p><strong>Category:</strong> ${business.category}</p>
        <p><strong>Address:</strong> ${business.address}</p>
        <p><strong>Phone:</strong> ${business.phone}</p>

        <p class="business-description">
          ${business.description}
        </p>

        <button
          type="button"
          class="edit-button"
          onclick="editBusiness(${business.id})"
        >
          Edit
        </button>

        <button
          type="button"
          class="delete-button"
          onclick="deleteBusiness(${business.id})"
        >
          Delete
        </button>

      </article>
    `;
  });
}

function editBusiness(id) {
  const business =
    businesses.find(function(item) {
      return item.id === id;
    });

  if (!business) {
    return;
  }

  editingBusinessId = id;

  setValue("businessName", business.name);
  setValue("businessCategory", business.category);
  setValue("businessAddress", business.address);
  setValue("businessPhone", business.phone);
  setValue("businessWebsite", business.website);
  setValue("businessImage", business.image);
  setValue("businessPaid", business.paid);
  setValue("businessFeatured", business.featured);
  setValue("businessDescription", business.description);

  setPreviewImage("businessImagePreview", business.image);

  const button = document.getElementById("businessSubmitButton");

  if (button) {
    button.textContent = "Update Business";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

async function deleteBusiness(id) {
  const confirmDelete =
    confirm("Delete this business?\n\nThis cannot be undone unless you restore a backup.");

  if (!confirmDelete) {
    return;
  }

  businesses =
    businesses.filter(function(business) {
      return business.id !== id;
    });

  await saveBusinesses();
  renderBusinessPreviews();
}

function clearBusinessForm() {
  setValue("businessName", "");
  setValue("businessCategory", "");
  setValue("businessAddress", "");
  setValue("businessPhone", "");
  setValue("businessWebsite", "");
  setValue("businessImage", "");
  setValue("businessPaid", "No");
  setValue("businessFeatured", "No");
  setValue("businessDescription", "");

  resetPreviewImage("businessImagePreview");
}

/* COUPONS */

function addCouponPreview() {
  const businessName = getValue("couponBusinessName");
  const category = getValue("couponCategory");
  const title = getValue("couponTitle");
  const image = getValue("couponImage");
  const details = getValue("couponDetails");

  if (!businessName || !category || !title || !details) {
    alert("Please complete all coupon fields.");
    return;
  }

  if (editingCouponId) {
    coupons =
      coupons.map(function(coupon) {
        if (coupon.id === editingCouponId) {
          return {
            id: editingCouponId,
            businessName,
            category,
            title,
            image,
            details
          };
        }

        return coupon;
      });

    editingCouponId = null;

    alert("Coupon updated.");
  } else {
    coupons.unshift({
      id: generateId(),
      businessName,
      category,
      title,
      image,
      details
    });

    alert("Coupon added.");
  }

  saveCoupons();
  renderCouponPreviews();
  clearCouponForm();
}

function renderCouponPreviews() {
  const area = document.getElementById("couponPreviewArea");

  if (!area) {
    return;
  }

  area.innerHTML = "";

  coupons.forEach(function(coupon) {
    const fallbackImage =
      getCategoryImage(coupon.category) || "images/categories/coupons.jpg";

    const imagePath =
      coupon.image && coupon.image.trim() !== ""
        ? coupon.image
        : fallbackImage;

    area.innerHTML += `
      <article class="coupon-card">

        <img
          src="${imagePath}"
          alt="${coupon.title}"
          class="business-card-image"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        >

        <div class="coupon-tag">Local Deal</div>

        <h2>${coupon.title}</h2>

        <p><strong>${coupon.businessName}</strong></p>

        <p>
          <strong>Category:</strong>
          ${coupon.category}
        </p>

        <p class="business-description">
          ${coupon.details}
        </p>

        <button
          type="button"
          class="edit-button"
          onclick="editCoupon(${coupon.id})"
        >
          Edit
        </button>

        <button
          type="button"
          class="delete-button"
          onclick="deleteCoupon(${coupon.id})"
        >
          Delete
        </button>

      </article>
    `;
  });
}

function editCoupon(id) {
  const coupon =
    coupons.find(function(item) {
      return item.id === id;
    });

  if (!coupon) {
    return;
  }

  editingCouponId = id;

  setValue("couponBusinessName", coupon.businessName);
  setValue("couponCategory", coupon.category);
  setValue("couponTitle", coupon.title);
  setValue("couponImage", coupon.image);
  setValue("couponDetails", coupon.details);

  setPreviewImage("couponImagePreview", coupon.image);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function deleteCoupon(id) {
  const confirmDelete =
    confirm("Delete this coupon?\n\nThis cannot be undone unless you restore a backup.");

  if (!confirmDelete) {
    return;
  }

  coupons =
    coupons.filter(function(coupon) {
      return coupon.id !== id;
    });

  saveCoupons();
  renderCouponPreviews();
}

function clearCouponForm() {
  setValue("couponBusinessName", "");
  setValue("couponCategory", "");
  setValue("couponTitle", "");
  setValue("couponImage", "");
  setValue("couponDetails", "");

  resetPreviewImage("couponImagePreview");
}

/* EVENTS */

function addEventPreview() {
  const title = getValue("eventTitle");
  const location = getValue("eventLocation");
  const category = getValue("eventCategory");
  const date = getValue("eventDate");
  const time = getValue("eventTime");
  const image = getValue("eventImage");
  const description = getValue("eventDescription");

  if (!title || !location || !category || !date || !time || !description) {
    alert("Please complete all event fields.");
    return;
  }

  if (editingEventId) {
    events =
      events.map(function(event) {
        if (event.id === editingEventId) {
          return {
            id: editingEventId,
            title,
            location,
            category,
            date,
            time,
            image,
            description
          };
        }

        return event;
      });

    editingEventId = null;

    alert("Event updated.");
  } else {
    events.unshift({
      id: generateId(),
      title,
      location,
      category,
      date,
      time,
      image,
      description
    });

    alert("Event added.");
  }

  saveEvents();
  renderEventPreviews();
  clearEventForm();
}

function renderEventPreviews() {
  const area = document.getElementById("eventPreviewArea");

  if (!area) {
    return;
  }

  area.innerHTML = "";

  events.forEach(function(event) {
    const fallbackImage =
      "images/categories/events.jpg";

    const imagePath =
      event.image && event.image.trim() !== ""
        ? event.image
        : fallbackImage;

    area.innerHTML += `
      <article class="business-card">

        <img
          src="${imagePath}"
          alt="${event.title}"
          class="business-card-image"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        >

        <h2>${event.title}</h2>

        <p><strong>Category:</strong> ${event.category}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Time:</strong> ${event.time}</p>

        <p class="business-description">
          ${event.description}
        </p>

        <button
          type="button"
          class="edit-button"
          onclick="editEvent(${event.id})"
        >
          Edit
        </button>

        <button
          type="button"
          class="delete-button"
          onclick="deleteEvent(${event.id})"
        >
          Delete
        </button>

      </article>
    `;
  });
}

function editEvent(id) {
  const event =
    events.find(function(item) {
      return item.id === id;
    });

  if (!event) {
    return;
  }

  editingEventId = id;

  setValue("eventTitle", event.title);
  setValue("eventLocation", event.location);
  setValue("eventCategory", event.category);
  setValue("eventDate", event.date);
  setValue("eventTime", event.time);
  setValue("eventImage", event.image);
  setValue("eventDescription", event.description);

  setPreviewImage("eventImagePreview", event.image);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function deleteEvent(id) {
  const confirmDelete =
    confirm("Delete this event?\n\nThis cannot be undone unless you restore a backup.");

  if (!confirmDelete) {
    return;
  }

  events =
    events.filter(function(event) {
      return event.id !== id;
    });

  saveEvents();
  renderEventPreviews();
}

function clearEventForm() {
  setValue("eventTitle", "");
  setValue("eventLocation", "");
  setValue("eventCategory", "");
  setValue("eventDate", "");
  setValue("eventTime", "");
  setValue("eventImage", "");
  setValue("eventDescription", "");

  resetPreviewImage("eventImagePreview");
}

/* ADS */

async function addAdPreview() {
  const title = getValue("adTitle");
  const location = getValue("adLocation");
  const shape = getValue("adShape");
  const image = getValue("adImage");
  const link = makeGoodUrl(getValue("adLink"));
  const active = getValue("adActive");

  if (!title || !location || !shape || !image) {
    alert("Please complete all ad fields.");
    return;
  }

  if (editingAdId) {
    ads =
      ads.map(function(ad) {
        if (ad.id === editingAdId) {
          return {
            id: editingAdId,
            title,
            location,
            shape,
            image,
            link,
            active
          };
        }

        return ad;
      });

    editingAdId = null;

    alert("Advertisement updated.");
  } else {
    ads.unshift({
      id: generateId(),
      title,
      location,
      shape,
      image,
      link,
      active
    });

    alert("Advertisement added.");
  }

  await saveAds();
  renderAdPreviews();
  clearAdForm();
}

function renderAdPreviews() {
  const area = document.getElementById("adPreviewArea");

  if (!area) {
    return;
  }

  area.innerHTML = "";

  ads.forEach(function(ad) {
    const shape =
      ad.shape
        ? ad.shape.toLowerCase()
        : "square";

    area.innerHTML += `
      <article class="ad-preview-card ad-${shape}">

        <a
          href="${makeGoodUrl(ad.link) || "#"}"
          target="_blank"
        >
          <img
            src="${ad.image}"
            alt="${ad.title}"
            class="ad-preview-image"
          >
        </a>

        <p><strong>${ad.title}</strong></p>
        <p>${ad.location} | ${shape} | Active: ${ad.active}</p>

        <button
          type="button"
          class="edit-button"
          onclick="editAd(${ad.id})"
        >
          Edit
        </button>

        <button
          type="button"
          class="delete-button"
          onclick="deleteAd(${ad.id})"
        >
          Delete
        </button>

      </article>
    `;
  });
}

function editAd(id) {
  const ad =
    ads.find(function(item) {
      return item.id === id;
    });

  if (!ad) {
    return;
  }

  editingAdId = id;

  setValue("adTitle", ad.title);
  setValue("adLocation", ad.location);
  setValue("adShape", ad.shape);
  setValue("adImage", ad.image);
  setValue("adLink", ad.link);
  setValue("adActive", ad.active);

  setPreviewImage("adImagePreview", ad.image);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function deleteAd(id) {
  const confirmDelete =
    confirm("Delete this advertisement?\n\nThis cannot be undone unless you restore a backup.");

  if (!confirmDelete) {
    return;
  }

  ads =
    ads.filter(function(ad) {
      return ad.id !== id;
    });

  saveAds();
  renderAdPreviews();
}

function clearAdForm() {
  setValue("adTitle", "");
  setValue("adLocation", "");
  setValue("adShape", "");
  setValue("adImage", "");
  setValue("adLink", "");
  setValue("adActive", "Yes");

  resetPreviewImage("adImagePreview");
}

/* ADMIN BUSINESS SEARCH */

function filterBusinesses() {
  const searchInput =
    document.getElementById("adminBusinessSearch");

  if (!searchInput) {
    renderBusinessPreviews();
    return;
  }

  const search =
    searchInput.value.toLowerCase().trim();

  const originalBusinesses =
    businesses;

  businesses =
    originalBusinesses.filter(function(business) {
      return (
        business.name.toLowerCase().includes(search) ||
        business.category.toLowerCase().includes(search) ||
        business.address.toLowerCase().includes(search) ||
        business.phone.toLowerCase().includes(search) ||
        business.description.toLowerCase().includes(search)
      );
    });

  renderBusinessPreviews();

  businesses =
    originalBusinesses;
}