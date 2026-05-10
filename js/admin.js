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
        JSON.parse(
          localStorage.getItem("countyCompassBusinesses")
        ) || [];
    }

  } catch (error) {

    console.error(error);

    businesses =
      JSON.parse(
        localStorage.getItem("countyCompassBusinesses")
      ) || [];
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

    console.error(
      "Business sync failed:",
      error
    );
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
  localStorage.setItem("countyCompassCoupons", JSON.stringify(coupons));
}

function saveEvents() {
  localStorage.setItem("countyCompassEvents", JSON.stringify(events));
}

function saveAds() {
  localStorage.setItem("countyCompassAds", JSON.stringify(ads));
}

function getCategoryImage(category) {

  const categoryImages = {
    "Automotive": "images/categories/automotive.jpg",
    "Food & Dining": "images/categories/food-dining.jpg",
    "Home Services": "images/categories/home-services.jpg",
    "Health & Beauty": "images/categories/health-beauty.jpg",
    "IT & Computer Repair": "images/categories/professional-services.jpg",
    "Shopping": "images/categories/shopping.jpg",
    "Real Estate": "images/categories/real-estate.jpg",
    "Entertainment": "images/categories/entertainment.jpg",
    "Churches": "images/categories/churches.jpg",
    "Fitness": "images/categories/fitness.jpg",
    "Professional Services": "images/categories/professional-services.jpg",
    "Other": "images/categories/professional-services.jpg"
  };

  return (
    categoryImages[category] ||
    "images/categories/professional-services.jpg"
  );
}

/* BUSINESS */

async function addBusinessPreview() {

  const name =
    getValue("businessName");

  const category =
    getValue("businessCategory");

  const address =
    getValue("businessAddress");

  const phone =
    getValue("businessPhone");

  const website =
    makeGoodUrl(
      getValue("businessWebsite")
    );

  const image =
    getValue("businessImage");

  const paid =
    getValue("businessPaid");

  const featured =
    getValue("businessFeatured");

  const description =
    getValue("businessDescription");

  if (
    !name ||
    !category ||
    !address ||
    !phone ||
    !description
  ) {

    alert(
      "Please complete all required business fields."
    );

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

    alert(
      "This business already exists."
    );

    return;
  }

  if (editingBusinessId) {

    businesses =
      businesses.map(function(business) {

        if (
          business.id === editingBusinessId
        ) {

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

    const button =
      document.getElementById(
        "businessSubmitButton"
      );

    if (button) {
      button.textContent =
        "Add Business";
    }

    alert(
      "Business updated."
    );

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

    alert(
      "Business added."
    );
  }

  await saveBusinesses();

  renderBusinessPreviews();

  clearBusinessForm();
}

function renderBusinessPreviews() {

  const area =
    document.getElementById(
      "businessPreviewArea"
    );

  if (!area) {
    return;
  }

  area.innerHTML = "";

  businesses.forEach(function(business) {

    const imagePath =
      business.image &&
      business.image.trim() !== ""
        ? business.image
        : getCategoryImage(
            business.category
          );

    const fallbackImage =
      getCategoryImage(
        business.category
      );

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

  setPreviewImage(
    "businessImagePreview",
    business.image
  );

  const button =
    document.getElementById(
      "businessSubmitButton"
    );

  if (button) {
    button.textContent =
      "Update Business";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

async function deleteBusiness(id) {

  const confirmDelete =
    confirm(
      "Delete this business?\n\nThis cannot be undone unless you restore a backup."
    );

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

  resetPreviewImage(
    "businessImagePreview"
  );
}