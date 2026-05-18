document.addEventListener("DOMContentLoaded", function () {

    const submissionType = document.getElementById("submissionType");
    const categorySelect = document.getElementById("categorySelect");
    const packageLength = document.getElementById("packageLength");
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const submissionForm = document.getElementById("submissionForm");

    const businessCategories = `
        <option value="">Select Category</option>
        <option>Agriculture & Farm Services</option>
        <option>Animals & Pet Services</option>
        <option>Automotive Repair</option>
        <option>Automotive Services</option>
        <option>Catering & Event Services</option>
        <option>Churches</option>
        <option>Clothing & Apparel</option>
        <option>Construction</option>
        <option>Custom Crafts & Fabrication</option>
        <option>Education & Training</option>
        <option>Entertainment</option>
        <option>Financial Services</option>
        <option>Fitness</option>
        <option>Food & Dining</option>
        <option>Government & Community</option>
        <option>Gravel, Rock & Fill Dirt</option>
        <option>Handyman Services</option>
        <option>Health & Beauty</option>
        <option>Home Improvement</option>
        <option>Insurance</option>
        <option>IT & Computer Repair</option>
        <option>Land Clearing & Tractor Services</option>
        <option>Landscaping</option>
        <option>Legal Services</option>
        <option>Locksmithing</option>
        <option>Lodging & Travel</option>
        <option>Medical & Dental</option>
        <option>Mobile Home Sales & Services</option>
        <option>Moving & Hauling</option>
        <option>Photography & Media</option>
        <option>Pools & Outdoor Living</option>
        <option>Professional Services</option>
        <option>Real Estate & Title Services</option>
        <option>Salon / Barber / Nail Services</option>
        <option>Shopping</option>
        <option>Tattoo & Piercing</option>
        <option>Towing & Recovery</option>
        <option>Weddings & Parties</option>
        <option>Welding & Fabrication</option>
        <option>Other</option>
    `;

    const eventCategories = `
        <option value="">Select Event Type</option>
        <option>Church Event</option>
        <option>Community Gathering</option>
        <option>Event Promotion</option>
        <option>Festival</option>
        <option>Fundraiser</option>
        <option>Live Music</option>
        <option>Car Show</option>
        <option>Food Event</option>
        <option>Market / Vendor Event</option>
        <option>Kids & Family Event</option>
        <option>Holiday Event</option>
        <option>Sports Event</option>
        <option>Grand Opening</option>
        <option>Class / Workshop</option>
        <option>Other Event</option>
    `;

    function updateCategoryOptions() {

        if (!submissionType || !categorySelect) {
            return;
        }

        if (submissionType.value === "event") {
            categorySelect.innerHTML = eventCategories;
        } else {
            categorySelect.innerHTML = businessCategories;
        }
    }

    function updatePackageOptions() {

        if (!submissionType || !packageLength) {
            return;
        }

        let options = [];

        switch (submissionType.value) {

            case "business":
                options = [
                    { value: "30", text: "Monthly" },
                    { value: "90", text: "Quarterly" },
                    { value: "365", text: "Yearly" }
                ];
                break;

            case "featured-business":
            case "featured":
                options = [
                    { value: "30", text: "Monthly" },
                    { value: "90", text: "Quarterly" },
                    { value: "365", text: "Yearly" }
                ];
                break;

            case "coupon":
            case "coupons":
            case "deal":
            case "deals":
                options = [
                    { value: "1", text: "1 Week" },
                    { value: "2", text: "2 Weeks" },
                    { value: "3", text: "3 Weeks" },
                    { value: "4", text: "4 Weeks" },
                    { value: "5", text: "5 Weeks" },
                    { value: "6", text: "6 Weeks" },
                    { value: "7", text: "7 Weeks" },
                    { value: "8", text: "8 Weeks" }
                ];
                break;

            case "event":
            case "community-event":
            case "communityEvent":
                options = [
                    { value: "1", text: "Single Event" }
                ];
                break;

            case "hiring":
            case "job":
            case "jobs":
                options = [
                    { value: "30", text: "Monthly" },
                    { value: "90", text: "Quarterly" }
                ];
                break;

            case "sponsor":
                options = [
                    { value: "30", text: "Monthly" },
                    { value: "90", text: "Quarterly" },
                    { value: "365", text: "Yearly" }
                ];
                break;

            default:
                options = [
                    { value: "", text: "Select Duration" }
                ];
        }

        packageLength.innerHTML = "";

        options.forEach(function (option) {
            const opt = document.createElement("option");
            opt.value = option.value;
            opt.textContent = option.text;
            packageLength.appendChild(opt);
        });

        updatePricingSummary();
        updateEndDate();
    }

    function updatePricingSummary() {

        const pricingDetails = document.getElementById("pricingDetails");
        const pricingTotal = document.getElementById("pricingTotal");

        if (!submissionType || !packageLength || !pricingDetails || !pricingTotal) {
            return;
        }

        const type = submissionType.value;
        const duration = parseInt(packageLength.value || 0, 10);

        let total = 0;
        let details = "Select a listing type";

        if (type === "business") {
            if (duration === 30) {
                total = 15;
                details = "Business Listing - Monthly";
            } else if (duration === 90) {
                total = 40;
                details = "Business Listing - Quarterly";
            } else if (duration === 365) {
                total = 149;
                details = "Business Listing - Yearly";
            }
        }

        if (type === "featured-business" || type === "featured") {
            if (duration === 30) {
                total = 25;
                details = "Featured Business - Monthly";
            } else if (duration === 90) {
                total = 75;
                details = "Featured Business - Quarterly";
            } else if (duration === 365) {
                total = 249;
                details = "Featured Business - Yearly";
            }
        }

        if (type === "coupon" || type === "coupons" || type === "deal" || type === "deals") {
            total = duration * 10;
            details = "Coupon Listing - " + duration + " Week(s)";
        }

        if (type === "hiring" || type === "job" || type === "jobs") {
            if (duration === 30) {
                total = 15;
                details = "Hiring Listing - Monthly";
            } else if (duration === 90) {
                total = 40;
                details = "Hiring Listing - Quarterly";
            }
        }

        if (type === "event" || type === "community-event" || type === "communityEvent") {
            total = 10;
            details = "Community Event Listing";
        }

        if (type === "sponsor") {
            if (duration === 30) {
                total = 30;
                details = "Sponsor Ad - Monthly";
            } else if (duration === 90) {
                total = 80;
                details = "Sponsor Ad - Quarterly";
            } else if (duration === 365) {
                total = 299;
                details = "Sponsor Ad - Yearly";
            }
        }

        pricingDetails.textContent = details;
        pricingTotal.textContent = "Total: $" + total;
    }

    function toggleDealFields() {

        const dealCodeLabel = document.getElementById("dealCodeLabel");
        const dealCodeField = document.getElementById("dealCodeField");
        const dealValueLabel = document.getElementById("dealValueLabel");
        const dealValueField = document.getElementById("dealValueField");

        if (!submissionType || !dealCodeLabel || !dealCodeField || !dealValueLabel || !dealValueField) {
            return;
        }

        const showDeals =
            submissionType.value === "coupon" ||
            submissionType.value === "deal" ||
            submissionType.value === "coupons" ||
            submissionType.value === "deals";

        dealCodeLabel.style.display = showDeals ? "block" : "none";
        dealCodeField.style.display = showDeals ? "block" : "none";
        dealValueLabel.style.display = showDeals ? "block" : "none";
        dealValueField.style.display = showDeals ? "block" : "none";

        const eventTimeLabel = document.getElementById("eventTimeLabel");
        const eventTimeField = document.getElementById("eventTimeField");
        const showEventTime = submissionType.value === "event";

        if (eventTimeLabel && eventTimeField) {
            eventTimeLabel.style.display = showEventTime ? "block" : "none";
            eventTimeField.style.display = showEventTime ? "block" : "none";
        }
    }


    function toggleEventAddressField() {

        const eventAddressLabel = document.getElementById("eventAddressLabel");
        const eventAddressField = document.getElementById("eventAddressField");

        if (!submissionType || !eventAddressLabel || !eventAddressField) {
            return;
        }

        const showEventAddress =
            submissionType.value === "event" ||
            submissionType.value === "community-event" ||
            submissionType.value === "communityEvent";

        eventAddressLabel.style.display = showEventAddress ? "block" : "none";
        eventAddressField.style.display = showEventAddress ? "block" : "none";

        if (!showEventAddress) {
            eventAddressField.value = "";
        }
    }

    function updateEndDate() {

        if (!packageLength || !startDate || !endDate) {
            return;
        }

        const amount = parseInt(packageLength.value || 0, 10);
        const start = startDate.value;

        if (!amount || !start) {
            endDate.value = "";
            return;
        }

        const type = submissionType ? submissionType.value : "";
        let days;

        if (
            type === "coupon" ||
            type === "coupons" ||
            type === "deal" ||
            type === "deals"
        ) {
            days = amount * 7;
        }

        else if (
            type === "event" ||
            type === "community-event" ||
            type === "communityEvent"
        ) {
            endDate.value = start;
            return;
        }

        else {
            days = amount;
        }

        const date = new Date(start + "T00:00:00");
        date.setDate(date.getDate() + days);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        endDate.value = `${yyyy}-${mm}-${dd}`;
    }
     
  if (submissionType) {

    submissionType.addEventListener("change", function () {
        updateCategoryOptions();
        toggleDealFields();
        updatePackageOptions();
        toggleEventAddressField();
    });
}

    if (packageLength) {
        packageLength.addEventListener("change", function () {
            updatePricingSummary();
            updateEndDate();
        });
    }

    if (startDate) {
        startDate.addEventListener("change", updateEndDate);
    }

    if (submissionForm) {
        submissionForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const formData = new FormData(submissionForm);
            const data = {};

            formData.forEach(function (value, key) {
                data[key] = value;
            });

            try {

                const response = await fetch(
                    "/.netlify/functions/submit-listing",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    }
                );

                const result = await response.json();

                if (result.success) {
                    alert("Submission sent successfully for review.");
                    submissionForm.reset();
                    updateCategoryOptions();
                    toggleDealFields();
                    updatePackageOptions();
                    toggleEventAddressField();
                } else {
                    alert("Submission failed.");
                }

            } catch (error) {

                console.error(error);
                alert("There was a problem submitting the form.");
            }
        });
    }
    updateCategoryOptions();
    toggleDealFields();
    updatePackageOptions();
    toggleEventAddressField();
    updatePricingSummary();
});
