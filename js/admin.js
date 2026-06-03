let businesses = [];
let editingBusinessId = null;

let coupons = [];
let editingCouponId = null;

let events = [];
let editingEventId = null;

let ads = [];
let editingAdId = null;

let hiringPosts = [];
let editingHiringId = null;

loadAdminData();

async function loadAdminData() {
  await loadBusinessesFromServer();
  await loadCouponsFromServer();
  await loadEventsFromServer();
  await loadAdsFromServer();
  await loadHiringFromServer();

  renderBusinessPreviews();
  renderCouponPreviews();
  renderEventPreviews();
  renderHiringPreviews();
  renderAdPreviews();
  renderNeedsAttentionDashboard();
}

async function loadBusinessesFromServer() {
  try {
    const response = await fetch("/.netlify/functions/businesses");
    const data = await response.json();
    businesses = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Business load failed:", error);
    businesses = [];
  }
}

async function loadCouponsFromServer() {
  try {
    const response = await fetch("/.netlify/functions/coupons");
    const data = await response.json();
    coupons = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Coupon load failed:", error);
    coupons = [];
  }
}

async function loadEventsFromServer() {
  try {
    const response = await fetch("/.netlify/functions/events");
    const data = await response.json();
    events = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Event load failed:", error);
    events = [];
  }
}

async function loadAdsFromServer() {
  try {
    const response = await fetch("/.netlify/functions/ads");
    const data = await response.json();
    ads = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Ad load failed:", error);
    ads = [];
  }
}

async function loadHiringFromServer() {
  try {
    const response = await fetch("/.netlify/functions/hiring");
    const data = await response.json();
    hiringPosts = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Hiring load failed:", error);
    hiringPosts = [];
  }
}

async function saveBusinesses() {
  await saveToServer("/.netlify/functions/businesses", businesses, "Business");
}

async function saveCoupons() {
  await saveToServer("/.netlify/functions/coupons", coupons, "Coupon");
}

async function saveEvents() {
  await saveToServer("/.netlify/functions/events", events, "Event");
}

async function saveAds() {
  await saveToServer("/.netlify/functions/ads", ads, "Ad");
}

async function saveHiringPosts() {
  await saveToServer("/.netlify/functions/hiring", hiringPosts, "Hiring");
}

async function saveToServer(url, data, label) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(label + " save failed.");
    }
  } catch (error) {
    console.error(label + " sync failed:", error);
    alert(label + " could not be saved to the server.");
  }
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 100000);
}

function formatPhoneNumber(value) {
  const cleaned = String(value || "").replace(/\D/g, "");

  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return "(" + cleaned.slice(0, 3) + ") " + cleaned.slice(3);

  return "(" + cleaned.slice(0, 3) + ") " + cleaned.slice(3, 6) + "-" + cleaned.slice(6, 10);
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value || "";
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
  if (!link || link.trim() === "") return "";
  if (link.startsWith("http://") || link.startsWith("https://")) return link;
  return "https://" + link;
}

function getExpirationText(expiration) {
  if (!expiration) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expirationDate = new Date(expiration + "T00:00:00");

  if (expirationDate < today) {
    return "Expired: " + expiration;
  }

  return "Expires: " + expiration;
}

function getCategoryImage(category) {
  const categoryImages = {
    "Agriculture & Farm Services": "images/categories/professional-services.jpg",
    "Animals & Pet Services": "images/categories/professional-services.jpg",
    "Automotive Repair": "images/categories/automotive.jpg",
    "Automotive Services": "images/categories/automotive.jpg",
    "Catering & Event Services": "images/categories/catering-event-services.jpg",
    "Churches": "images/categories/churches.jpg",
    "Cleaning Services": "images/categories/home-services.jpg",
    "Construction": "images/categories/home-services.jpg",
    "Custom Crafts & Fabrication": "images/categories/shopping.jpg",
    "Education & Training": "images/categories/professional-services.jpg",
    "Entertainment": "images/categories/entertainment.jpg",
    "Financial Services": "images/categories/professional-services.jpg",
    "Fitness": "images/categories/fitness.jpg",
    "Food & Dining": "images/categories/food-dining.jpg",
    "Government & Community": "images/categories/professional-services.jpg",
    "Gravel, Rock & Fill Dirt": "images/categories/home-services.jpg",
    "Handyman Services": "images/categories/home-services.jpg",
    "Health & Beauty": "images/categories/health-beauty.jpg",
    "Home Improvement": "images/categories/home-services.jpg",
    "Insurance": "images/categories/professional-services.jpg",
    "IT & Computer Repair": "images/categories/professional-services.jpg",
    "Land Clearing & Tractor Services": "images/categories/home-services.jpg",
    "Landscaping": "images/categories/home-services.jpg",
    "Legal Services": "images/categories/professional-services.jpg",
    "Locksmithing": "images/categories/professional-services.jpg",
    "Lodging & Travel": "images/categories/professional-services.jpg",
    "Massage & Spa Services": "images/categories/health-beauty.jpg",
    "Medical & Dental": "images/categories/health-beauty.jpg",
    "Moving & Hauling": "images/categories/home-services.jpg",
    "Photography & Media": "images/categories/professional-services.jpg",
    "Pools & Outdoor Living": "images/categories/home-services.jpg",
    "Professional Services": "images/categories/professional-services.jpg",
    "Real Estate": "images/categories/real-estate.jpg",
    "RV Sales & Service": "images/categories/rv.jpg",
    "Shopping": "images/categories/shopping.jpg",
    "Towing & Recovery": "images/categories/automotive.jpg",
    "Weddings & Parties": "images/categories/catering-event-services.jpg",
    "Other": "images/categories/professional-services.jpg"
  };

  return categoryImages[category] || "images/categories/professional-services.jpg";
}

/* BUSINESS */

async function addBusinessPreview() {
  const name = getValue("businessName");
  const category = getValue("businessCategory");
  const address = getValue("businessAddress");
  const phone = formatPhoneNumber(getValue("businessPhone"));
  const email = getValue("businessEmail");
  const website = makeGoodUrl(getValue("businessWebsite"));
  const image = getValue("businessImage");
  const paid = getValue("businessPaid");
  const expiration = getValue("businessExpiration");
  const featured = getValue("businessFeatured");
  const featuredLocation = getValue("businessFeaturedLocation");
  const description = getValue("businessDescription");
  const status = getValue("businessStatus") || "Active";

  if (!name || !category || !address || !phone || !description) {
    alert("Please complete all required business fields.");
    return;
  }

  const duplicate = businesses.some(function(business) {
    return (
      String(business.name || "").toLowerCase() === name.toLowerCase() &&
      String(business.address || "").toLowerCase() === address.toLowerCase() &&
      business.id !== editingBusinessId
    );
  });

  if (duplicate) {
    alert("This business already exists.");
    return;
  }

  if (editingBusinessId !== null) {
    businesses = businesses.map(function(business) {
      if (business.id === editingBusinessId) {
        return {
          id: editingBusinessId,
          name,
          category,
          address,
          phone,
          email,
          website,
          image,
          paid,
          expiration,
          featured,
          featuredLocation,
          status,
          description
        };
      }

      return business;
    });

    editingBusinessId = null;

    const button = document.getElementById("businessSubmitButton");
    if (button) button.textContent = "Add Business";

    alert("Business updated.");
  } else {
    businesses.unshift({
      id: generateId(),
      name,
      category,
      address,
      phone,
      email,
      website,
      image,
      paid,
      expiration,
      featured,
      featuredLocation,
      status,
      description
    });

    alert("Business added.");
  }

  await saveBusinesses();
  renderBusinessPreviews();
  renderNeedsAttentionDashboard();
  clearBusinessForm();
}

function renderBusinessPreviews() {
  const area = document.getElementById("businessPreviewArea");
  if (!area) return;

  area.innerHTML = "";

  businesses.forEach(function(business) {
    const imagePath =
      business.image && String(business.image).trim() !== ""
        ? business.image
        : getCategoryImage(business.category);

    const fallbackImage = getCategoryImage(business.category);
    const expirationText = getExpirationText(business.expiration);

    const emailLine =
      business.email && String(business.email).trim() !== ""
        ? `<p><strong>Email:</strong> ${business.email}</p>`
        : "";

    area.innerHTML += `
      <article class="business-card">
        <img
          src="${imagePath}"
          alt="${business.name || ""}"
          class="business-card-image"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        >

        <h2>${business.name || ""}</h2>

        <p><strong>Category:</strong> ${business.category || ""}</p>
        <p><strong>Address:</strong> ${business.address || ""}</p>
        ${emailLine}
        <p><strong>Phone:</strong> ${formatPhoneNumber(business.phone)}</p>
        <p><strong>Paid:</strong> ${business.paid || "No"}</p>
        <p><strong>Status:</strong> ${business.status || "Active"}</p>
        <p><strong>Featured:</strong> ${business.featured || "No"}</p>
        <p><strong>Featured Location:</strong> ${business.featuredLocation || "homepage"}</p>

        ${expirationText ? `<p><strong>${expirationText}</strong></p>` : ""}

        <p class="business-description">${business.description || ""}</p>

        <button type="button" class="edit-button" onclick='editBusiness(${JSON.stringify(business.id)})'>Edit</button>
        <button type="button" class="delete-button" onclick='deleteBusiness(${JSON.stringify(business.id)})'>Delete</button>
      </article>
    `;
  });
}

function editBusiness(id) {
  const business = businesses.find(function(item) {
    return item.id === id;
  });

  if (!business) return;

  editingBusinessId = id;

  setValue("businessName", business.name);
  setValue("businessCategory", business.category);
  setValue("businessAddress", business.address);
  setValue("businessPhone", formatPhoneNumber(business.phone));
  setValue("businessEmail", business.email || "");
  setValue("businessWebsite", business.website);
  setValue("businessImage", business.image);
  setValue("businessPaid", business.paid);
  setValue("businessExpiration", business.expiration || "");
  setValue("businessFeatured", business.featured);
  setValue("businessFeaturedLocation", business.featuredLocation || "homepage");
  setValue("businessStatus", business.status || "Active");
  setValue("businessDescription", business.description);

  setPreviewImage("businessImagePreview", business.image);

  const button = document.getElementById("businessSubmitButton");
  if (button) button.textContent = "Update Business";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteBusiness(id) {
  const confirmDelete = confirm("Delete this business?");
  if (!confirmDelete) return;

  businesses = businesses.filter(function(business) {
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
  setValue("businessEmail", "");
  setValue("businessWebsite", "");
  setValue("businessImage", "");
  setValue("businessPaid", "No");
  setValue("businessExpiration", "");
  setValue("businessFeatured", "No");
  setValue("businessFeaturedLocation", "homepage");
  setValue("businessStatus", "Active");
  setValue("businessDescription", "");
  resetPreviewImage("businessImagePreview");
}

/* COUPONS */

async function addCouponPreview() {
  const businessName = getValue("couponBusinessName");
  const category = getValue("couponCategory");
  const title = getValue("couponTitle");
  const image = getValue("couponImage");
  const expiration = getValue("couponExpiration");
  const website = makeGoodUrl(getValue("couponWebsite"));
  const details = getValue("couponDetails");
  const status = getValue("couponStatus") || "Active";

  if (!businessName || !category || !title || !details) {
    alert("Please complete all coupon fields.");
    return;
  }

  if (editingCouponId !== null) {
    coupons = coupons.map(function(coupon) {
      if (coupon.id === editingCouponId) {
        return {
          id: editingCouponId,
          businessName,
          category,
          title,
          image,
          expiration,
          website,
          status,
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
      expiration,
      website,
      status,
      details
    });

    alert("Coupon added.");
  }

  await saveCoupons();
  renderCouponPreviews();
  renderNeedsAttentionDashboard();
  clearCouponForm();
}

function renderCouponPreviews() {
  const area = document.getElementById("couponPreviewArea");
  if (!area) return;

  area.innerHTML = "";

  coupons.forEach(function(coupon) {
    const fallbackImage =
      getCategoryImage(coupon.category) || "images/categories/coupons.jpg";

    const imagePath =
      coupon.image && String(coupon.image).trim() !== ""
        ? coupon.image
        : fallbackImage;

    const expirationText = getExpirationText(coupon.expiration);

    area.innerHTML += `
      <article class="coupon-card">
        <img
          src="${imagePath}"
          alt="${coupon.title || ""}"
          class="business-card-image"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        >

        <div class="coupon-tag">Local Deal</div>

        <h2>${coupon.title || ""}</h2>

        <p><strong>${coupon.businessName || ""}</strong></p>
        <p><strong>Category:</strong> ${coupon.category || ""}</p>
        <p><strong>Status:</strong> ${coupon.status || "Active"}</p>

        ${expirationText ? `<p><strong>${expirationText}</strong></p>` : ""}

        <p class="business-description">${coupon.details || ""}</p>

        <button type="button" class="edit-button" onclick='editCoupon(${JSON.stringify(coupon.id)})'>Edit</button>
        <button type="button" class="delete-button" onclick='deleteCoupon(${JSON.stringify(coupon.id)})'>Delete</button>
      </article>
    `;
  });
}

function editCoupon(id) {
  const coupon = coupons.find(function(item) {
    return item.id === id;
  });

  if (!coupon) return;

  editingCouponId = id;

  setValue("couponBusinessName", coupon.businessName);
  setValue("couponCategory", coupon.category);
  setValue("couponTitle", coupon.title);
  setValue("couponImage", coupon.image);
  setValue("couponExpiration", coupon.expiration || "");
  setValue("couponWebsite", coupon.website || "");
  setValue("couponStatus", coupon.status || "Active");
  setValue("couponDetails", coupon.details);

  setPreviewImage("couponImagePreview", coupon.image);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteCoupon(id) {
  const confirmDelete = confirm("Delete this coupon?");
  if (!confirmDelete) return;

  coupons = coupons.filter(function(coupon) {
    return coupon.id !== id;
  });

  await saveCoupons();
  renderCouponPreviews();
}

function clearCouponForm() {
  setValue("couponBusinessName", "");
  setValue("couponCategory", "");
  setValue("couponTitle", "");
  setValue("couponImage", "");
  setValue("couponDuration", "");
  setValue("couponStartDate", "");
  setValue("couponExpiration", "");
  setValue("couponWebsite", "");
  setValue("couponStatus", "Active");
  setValue("couponDetails", "");
  resetPreviewImage("couponImagePreview");
}

/* EVENTS */

async function addEventPreview() {
  const title = getValue("eventTitle");
  const location = getValue("eventLocation");
  const category = getValue("eventCategory");
  const date = getValue("eventDate");
  const time = getValue("eventTime");
  const image = getValue("eventImage");
  const description = getValue("eventDescription");
  const status = getValue("eventStatus") || "Active";

  if (!title || !location || !category || !date || !time || !description) {
    alert("Please complete all event fields.");
    return;
  }

  if (editingEventId !== null) {
    events = events.map(function(event) {
      if (event.id === editingEventId) {
        return {
          id: editingEventId,
          title,
          location,
          category,
          date,
          time,
          image,
          status,
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
      status,
      description
    });

    alert("Event added.");
  }

  await saveEvents();
  renderEventPreviews();
  clearEventForm();
}

function renderEventPreviews() {
  const area = document.getElementById("eventPreviewArea");
  if (!area) return;

  area.innerHTML = "";

  events.forEach(function(event) {
    const fallbackImage = "images/categories/events.jpg";

    const imagePath =
      event.image && String(event.image).trim() !== ""
        ? event.image
        : fallbackImage;

    area.innerHTML += `
      <article class="business-card">
        <img
          src="${imagePath}"
          alt="${event.title || ""}"
          class="business-card-image"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        >

        <h2>${event.title || ""}</h2>

        <p><strong>Category:</strong> ${event.category || ""}</p>
        <p><strong>Location:</strong> ${event.location || ""}</p>
        <p><strong>Date:</strong> ${event.date || ""}</p>
        <p><strong>Time:</strong> ${event.time || ""}</p>
        <p><strong>Status:</strong> ${event.status || "Active"}</p>

        <p class="business-description">${event.description || ""}</p>

        <button type="button" class="edit-button" onclick='editEvent(${JSON.stringify(event.id)})'>Edit</button>
        <button type="button" class="delete-button" onclick='deleteEvent(${JSON.stringify(event.id)})'>Delete</button>
      </article>
    `;
  });
}

function editEvent(id) {
  const event = events.find(function(item) {
    return item.id === id;
  });

  if (!event) return;

  editingEventId = id;

  setValue("eventTitle", event.title);
  setValue("eventLocation", event.location);
  setValue("eventCategory", event.category);
  setValue("eventDate", event.date);
  setValue("eventTime", event.time);
  setValue("eventImage", event.image);
  setValue("eventStatus", event.status || "Active");
  setValue("eventDescription", event.description);

  setPreviewImage("eventImagePreview", event.image);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteEvent(id) {
  const confirmDelete = confirm("Delete this event?");
  if (!confirmDelete) return;

  events = events.filter(function(event) {
    return event.id !== id;
  });

  await saveEvents();
  renderEventPreviews();
}

function clearEventForm() {
  setValue("eventTitle", "");
  setValue("eventLocation", "");
  setValue("eventCategory", "");
  setValue("eventDate", "");
  setValue("eventTime", "");
  setValue("eventImage", "");
  setValue("eventStatus", "Active");
  setValue("eventDescription", "");
  resetPreviewImage("eventImagePreview");
}

/* ADS */

async function addAdPreview() {
  const title = getValue("adTitle");
  const location = getValue("adLocation");
  const shape = getValue("adShape");
  const image = getValue("adImage").replace(/\\/g, "/");
  const link = makeGoodUrl(getValue("adLink"));
  const active = getValue("adActive");
  const expiration = getValue("adExpiration");

  if (!title || !location || !shape || !image) {
    alert("Please complete all ad fields.");
    return;
  }

  if (editingAdId !== null) {
    ads = ads.map(function(ad) {
      if (ad.id === editingAdId) {
        return {
          id: editingAdId,
          title,
          location,
          shape,
          image,
          link,
          active,
          expiration
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
      active,
      expiration
    });

    alert("Advertisement added.");
  }

  await saveAds();
  renderAdPreviews();
  renderNeedsAttentionDashboard();
  clearAdForm();
}

function renderAdPreviews() {
  const area = document.getElementById("adPreviewArea");
  if (!area) return;

  area.innerHTML = "";

  ads.forEach(function(ad) {
    const shape = ad.shape ? ad.shape.toLowerCase() : "square";
    const expirationText = getExpirationText(ad.expiration);

    area.innerHTML += `
      <article class="ad-preview-card ad-${shape}">
        <a href="${makeGoodUrl(ad.link) || "#"}" target="_blank">
          <img src="${ad.image || ""}" alt="${ad.title || ""}" class="ad-preview-image">
        </a>

        <p><strong>${ad.title || ""}</strong></p>
        <p>${ad.location || ""} | ${shape} | Active: ${ad.active || ""}</p>

        ${expirationText ? `<p><strong>${expirationText}</strong></p>` : ""}

        <button type="button" class="edit-button" onclick='editAd(${JSON.stringify(ad.id)})'>Edit</button>
        <button type="button" class="delete-button" onclick='deleteAd(${JSON.stringify(ad.id)})'>Delete</button>
      </article>
    `;
  });
}

function editAd(id) {
  const ad = ads.find(function(item) {
    return item.id === id;
  });

  if (!ad) return;

  editingAdId = id;

  setValue("adTitle", ad.title);
  setValue("adLocation", ad.location);
  setValue("adShape", ad.shape);
  setValue("adImage", ad.image);
  setValue("adLink", ad.link);
  setValue("adActive", ad.active);
  setValue("adExpiration", ad.expiration || "");

  setPreviewImage("adImagePreview", ad.image);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteAd(id) {
  const confirmDelete = confirm("Delete this advertisement?");
  if (!confirmDelete) return;

  ads = ads.filter(function(ad) {
    return ad.id !== id;
  });

  await saveAds();
  renderAdPreviews();
}

function clearAdForm() {
  setValue("adTitle", "");
  setValue("adLocation", "");
  setValue("adShape", "");
  setValue("adImage", "");
  setValue("adLink", "");
  setValue("adActive", "Yes");
  setValue("adExpiration", "");
  resetPreviewImage("adImagePreview");
}

/* ADMIN BUSINESS SEARCH */

function filterBusinesses() {
  const searchInput = document.getElementById("adminBusinessSearch");

  if (!searchInput) {
    renderBusinessPreviews();
    return;
  }

  const search = searchInput.value.toLowerCase().trim();

  const filteredBusinesses = businesses.filter(function(business) {
    return (
      String(business.name || "").toLowerCase().includes(search) ||
      String(business.category || "").toLowerCase().includes(search) ||
      String(business.address || "").toLowerCase().includes(search) ||
      String(business.phone || "").toLowerCase().includes(search) ||
      String(business.email || "").toLowerCase().includes(search) ||
      String(business.description || "").toLowerCase().includes(search)
    );
  });

  const area = document.getElementById("businessPreviewArea");
  if (!area) return;

  area.innerHTML = "";

  filteredBusinesses.forEach(function(business) {
    const imagePath =
      business.image && String(business.image).trim() !== ""
        ? business.image
        : getCategoryImage(business.category);

    const fallbackImage = getCategoryImage(business.category);
    const expirationText = getExpirationText(business.expiration);

    const emailLine =
      business.email && String(business.email).trim() !== ""
        ? `<p><strong>Email:</strong> ${business.email}</p>`
        : "";

    area.innerHTML += `
      <article class="business-card">
        <img
          src="${imagePath}"
          alt="${business.name || ""}"
          class="business-card-image"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        >

        <h2>${business.name || ""}</h2>

        <p><strong>Category:</strong> ${business.category || ""}</p>
        <p><strong>Address:</strong> ${business.address || ""}</p>
        ${emailLine}
        <p><strong>Phone:</strong> ${formatPhoneNumber(business.phone)}</p>
        <p><strong>Paid:</strong> ${business.paid || "No"}</p>
        <p><strong>Status:</strong> ${business.status || "Active"}</p>
        <p><strong>Featured:</strong> ${business.featured || "No"}</p>
        <p><strong>Featured Location:</strong> ${business.featuredLocation || "homepage"}</p>

        ${expirationText ? `<p><strong>${expirationText}</strong></p>` : ""}

        <p class="business-description">${business.description || ""}</p>

        <button type="button" class="edit-button" onclick='editBusiness(${JSON.stringify(business.id)})'>Edit</button>
        <button type="button" class="delete-button" onclick='deleteBusiness(${JSON.stringify(business.id)})'>Delete</button>
      </article>
    `;
  });
}

/* HIRING */

async function addHiringPreview() {
  const business = getValue("hiringBusiness");
  const title = getValue("hiringTitle");
  const jobType = getValue("hiringType");
  const pay = getValue("hiringPay");
  const phone = formatPhoneNumber(getValue("hiringPhone"));
  const website = makeGoodUrl(getValue("hiringWebsite"));
  const image = getValue("hiringImage");
  const expiration = getValue("hiringExpiration");
  const description = getValue("hiringDescription");
  const status = getValue("hiringStatus") || "Active";

  if (!business || !title || !jobType || !phone || !description) {
    alert("Please complete all hiring fields.");
    return;
  }

  if (editingHiringId !== null) {
    hiringPosts = hiringPosts.map(function(post) {
      if (post.id === editingHiringId) {
        return {
          id: editingHiringId,
          business,
          title,
          jobType,
          pay,
          phone,
          website,
          image,
          expiration,
          status,
          description
        };
      }

      return post;
    });

    editingHiringId = null;
    alert("Hiring post updated.");
  } else {
    hiringPosts.unshift({
      id: generateId(),
      business,
      title,
      jobType,
      pay,
      phone,
      website,
      image,
      expiration,
      status,
      description
    });

    alert("Hiring post added.");
  }

  await saveHiringPosts();
  renderHiringPreviews();
  renderNeedsAttentionDashboard();
  clearHiringForm();
}

function renderHiringPreviews() {
  const area = document.getElementById("hiringPreviewArea");
  if (!area) return;

  area.innerHTML = "";

  hiringPosts.forEach(function(post) {
    const imagePath =
      post.image && String(post.image).trim() !== ""
        ? post.image
        : "images/categories/hiring.jpg";

    const expirationText = getExpirationText(post.expiration);

    area.innerHTML += `
      <article class="business-card">
        <img src="${imagePath}" alt="${post.title || ""}" class="business-card-image">

        <h2>${post.title || ""}</h2>

        <p><strong>Business:</strong> ${post.business || ""}</p>
        <p><strong>Type:</strong> ${post.jobType || post.type || ""}</p>
        <p><strong>Pay:</strong> ${post.pay || ""}</p>
        <p><strong>Phone:</strong> ${formatPhoneNumber(post.phone)}</p>
        <p><strong>Status:</strong> ${post.status || "Active"}</p>

        ${expirationText ? `<p><strong>${expirationText}</strong></p>` : ""}

        <p class="business-description">${post.description || ""}</p>

        <button type="button" class="edit-button" onclick='editHiringPost(${JSON.stringify(post.id)})'>Edit</button>
        <button type="button" class="delete-button" onclick='deleteHiringPost(${JSON.stringify(post.id)})'>Delete</button>
      </article>
    `;
  });
}

function editHiringPost(id) {
  const post = hiringPosts.find(function(item) {
    return item.id === id;
  });

  if (!post) return;

  editingHiringId = id;

  setValue("hiringBusiness", post.business);
  setValue("hiringTitle", post.title);
  setValue("hiringType", post.jobType || post.type || "");
  setValue("hiringPay", post.pay);
  setValue("hiringPhone", formatPhoneNumber(post.phone));
  setValue("hiringWebsite", post.website);
  setValue("hiringImage", post.image);
  setValue("hiringExpiration", post.expiration || "");
  setValue("hiringStatus", post.status || "Active");
  setValue("hiringDescription", post.description);

  setPreviewImage("hiringImagePreview", post.image);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteHiringPost(id) {
  const confirmDelete = confirm("Delete this hiring post?");
  if (!confirmDelete) return;

  hiringPosts = hiringPosts.filter(function(post) {
    return post.id !== id;
  });

  await saveHiringPosts();
  renderHiringPreviews();
}

function clearHiringForm() {
  setValue("hiringBusiness", "");
  setValue("hiringTitle", "");
  setValue("hiringType", "");
  setValue("hiringPay", "");
  setValue("hiringPhone", "");
  setValue("hiringWebsite", "");
  setValue("hiringImage", "");
  setValue("hiringExpiration", "");
  setValue("hiringStatus", "Active");
  setValue("hiringDescription", "");
  resetPreviewImage("hiringImagePreview");
}


/* NEEDS ATTENTION DASHBOARD */

function getDaysUntilExpiration(dateValue) {
  if (!dateValue) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expirationDate = new Date(dateValue + "T00:00:00");
  expirationDate.setHours(0, 0, 0, 0);

  return Math.ceil((expirationDate - today) / 86400000);
}

function isMarkedNeverExpires(item) {
  return (
    item &&
    (
      item.neverExpires === "Yes" ||
      item.status === "Never Expires"
    )
  );
}

function addAttentionItems(sourceArray, typeLabel, nameGetter, attentionItems) {
  if (!Array.isArray(sourceArray)) {
    return;
  }

  sourceArray.forEach(function(item) {
    if (!item || isMarkedNeverExpires(item)) {
      return;
    }

    const expiration = item.expiration;

    if (!expiration) {
      return;
    }

    const days = getDaysUntilExpiration(expiration);

    if (days === null || days > 14) {
      return;
    }

    attentionItems.push({
      type: typeLabel,
      name: nameGetter(item),
      expiration: expiration,
      days: days
    });
  });
}

function renderNeedsAttentionDashboard() {
  const area = document.getElementById("needsAttentionBox");

  if (!area) {
    return;
  }

  const attentionItems = [];

  addAttentionItems(
    businesses,
    "Business",
    function(item) {
      return item.name || "Unnamed business";
    },
    attentionItems
  );

  addAttentionItems(
    coupons,
    "Deal",
    function(item) {
      return item.title || item.businessName || "Unnamed deal";
    },
    attentionItems
  );

  addAttentionItems(
    hiringPosts,
    "Hiring",
    function(item) {
      return item.title || item.business || "Unnamed hiring post";
    },
    attentionItems
  );

  addAttentionItems(
    ads,
    "Ad",
    function(item) {
      return item.title || "Unnamed ad";
    },
    attentionItems
  );

  attentionItems.sort(function(a, b) {
    return a.days - b.days;
  });

  if (attentionItems.length === 0) {
    area.innerHTML = `
      <p class="needs-attention-good">
        Nothing expires within the next 14 days.
      </p>
    `;
    return;
  }

  area.innerHTML = attentionItems.map(function(item) {
    let message = "";

    if (item.days < 0) {
      message = "Expired " + Math.abs(item.days) + " day(s) ago";
    } else if (item.days === 0) {
      message = "Expires today";
    } else {
      message = "Expires in " + item.days + " day(s)";
    }

    return `
      <div class="needs-attention-item">
        <strong>${item.type}: ${item.name}</strong>
        <span>${message}</span>
        <small>${item.expiration}</small>
      </div>
    `;
  }).join("");
}


/* PAGE SETUP */

document.addEventListener("DOMContentLoaded", function() {
  const phoneFields = [
    "businessPhone",
    "hiringPhone"
  ];

  phoneFields.forEach(function(fieldId) {
    const input = document.getElementById(fieldId);

    if (!input) return;

    input.addEventListener("input", function() {
      input.value = formatPhoneNumber(input.value);
    });
  });

  const couponDuration = document.getElementById("couponDuration");
  const couponStartDate = document.getElementById("couponStartDate");
  const couponExpiration = document.getElementById("couponExpiration");

  function updateCouponExpirationDate() {
    if (!couponDuration || !couponStartDate || !couponExpiration) return;

    const durationDays = parseInt(couponDuration.value);
    const startDate = couponStartDate.value;

    if (!durationDays || !startDate) {
      couponExpiration.value = "";
      return;
    }

    const calculatedDate = new Date(startDate + "T00:00:00");
    calculatedDate.setDate(calculatedDate.getDate() + durationDays);

    const year = calculatedDate.getFullYear();
    const month = String(calculatedDate.getMonth() + 1).padStart(2, "0");
    const day = String(calculatedDate.getDate()).padStart(2, "0");

    couponExpiration.value = `${year}-${month}-${day}`;
  }

  if (couponDuration && couponStartDate) {
    couponDuration.addEventListener("change", updateCouponExpirationDate);
    couponStartDate.addEventListener("change", updateCouponExpirationDate);
  }

  const hiringDuration = document.getElementById("hiringDuration");
  const hiringStartDate = document.getElementById("hiringStartDate");
  const hiringExpiration = document.getElementById("hiringExpiration");

  function updateHiringExpirationDate() {
    if (!hiringDuration || !hiringStartDate || !hiringExpiration) {
      return;
    }

    const durationDays = parseInt(hiringDuration.value);
    const startDate = hiringStartDate.value;

    if (!durationDays || !startDate) {
      hiringExpiration.value = "";
      return;
    }

    const calculatedDate = new Date(startDate + "T00:00:00");
    calculatedDate.setDate(calculatedDate.getDate() + durationDays);

    const year = calculatedDate.getFullYear();
    const month = String(calculatedDate.getMonth() + 1).padStart(2, "0");
    const day = String(calculatedDate.getDate()).padStart(2, "0");

    hiringExpiration.value = `${year}-${month}-${day}`;
  }

  if (hiringDuration && hiringStartDate) {
    hiringDuration.addEventListener("change", updateHiringExpirationDate);
    hiringStartDate.addEventListener("change", updateHiringExpirationDate);
  }

  const businessDuration = document.getElementById("businessDuration");
  const businessStartDate = document.getElementById("businessStartDate");
  const businessExpiration = document.getElementById("businessExpiration");

  function updateBusinessExpirationDate() {
    if (!businessDuration || !businessStartDate || !businessExpiration) {
      return;
    }

    const durationDays = parseInt(businessDuration.value);
    const startDate = businessStartDate.value;

    if (!durationDays || !startDate) {
      businessExpiration.value = "";
      return;
    }

    const calculatedDate = new Date(startDate + "T00:00:00");
    calculatedDate.setDate(calculatedDate.getDate() + durationDays);

    const year = calculatedDate.getFullYear();
    const month = String(calculatedDate.getMonth() + 1).padStart(2, "0");
    const day = String(calculatedDate.getDate()).padStart(2, "0");

    businessExpiration.value = `${year}-${month}-${day}`;
  }

  if (businessDuration && businessStartDate) {
    businessDuration.addEventListener("change", updateBusinessExpirationDate);
    businessStartDate.addEventListener("change", updateBusinessExpirationDate);
  }
});