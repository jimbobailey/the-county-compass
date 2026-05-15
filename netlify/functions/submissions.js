<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Submit Listing | The County Compass</title>

  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #111;
      color: #fff;
    }

    header {
      background: #1b1b1b;
      border-bottom: 3px solid orange;
      padding: 20px;
      text-align: center;
    }

    header h1 {
      color: orange;
      margin: 0;
    }

    .container {
      max-width: 900px;
      margin: 30px auto;
      padding: 20px;
      background: #1b1b1b;
      border-radius: 12px;
      border: 1px solid #333;
    }

    h2 {
      color: orange;
    }

    .info-box {
      background: #222;
      border: 1px solid #444;
      border-left: 4px solid orange;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .pricing-box {
      background: #181818;
      border: 1px solid #444;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 25px;
    }

    .pricing-box h3 {
      color: orange;
      margin-top: 0;
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }

    .price-card {
      background: #222;
      border: 1px solid #444;
      border-radius: 8px;
      padding: 12px;
    }

    .price-card strong {
      display: block;
      color: orange;
      font-size: 20px;
      margin-top: 6px;
    }

    label {
      display: block;
      margin-top: 18px;
      margin-bottom: 6px;
      font-weight: bold;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #444;
      background: #111;
      color: #fff;
      box-sizing: border-box;
    }

    textarea {
      min-height: 120px;
      resize: vertical;
    }

    button {
      width: 100%;
      padding: 15px;
      margin-top: 25px;
      background: orange;
      border: none;
      border-radius: 8px;
      color: #111;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
    }

    button:hover {
      background: #ffb84d;
    }

    .status {
      margin-top: 20px;
      padding: 15px;
      border-radius: 8px;
      display: none;
    }

    .success {
      background: #123d1f;
      border: 1px solid #2f8f46;
      color: #b7ffca;
    }

    .error {
      background: #3d1212;
      border: 1px solid #9b3434;
      color: #ffc0c0;
    }

    .small-note {
      color: #bbb;
      font-size: 14px;
      margin-top: 5px;
      line-height: 1.5;
    }
  </style>
</head>

<body>

<header>
  <h1>The County Compass</h1>
  <p>Public Listing Submission Form</p>
</header>

<div class="container">

  <div class="info-box">
    All submissions are reviewed before being published.<br><br>
    No payment is required during submission.<br>
    You will only be contacted for payment AFTER approval.
  </div>

  <div class="pricing-box">

    <h3>Listing & Advertising Options</h3>

    <div class="pricing-grid">

      <div class="price-card">
        Standard Business Listing
        <strong>$149 / Year</strong>

        <div class="small-note">
          Directory business listing with category placement, business details, image/logo, and searchable visibility.
        </div>
      </div>

      <div class="price-card">
        Featured Business Listing
        <strong>$249 / Year</strong>

        <div class="small-note">
          Includes full business listing PLUS featured placement across the website including homepage, events, coupons, and hiring pages.
        </div>
      </div>

      <div class="price-card">
        Sponsor Placement
        <strong>$299 / Year</strong>

        <div class="small-note">
          Premium sponsor placement for businesses wanting maximum visibility and community support recognition.
        </div>
      </div>

      <div class="price-card">
        Coupon Listing
        <strong>$10 / Week</strong>

        <div class="small-note">
          Promote special offers, discounts, and limited-time promotions.
        </div>
      </div>

      <div class="price-card">
        Event Listing
        <strong>$10 / Event</strong>

        <div class="small-note">
          Promote community events, church gatherings, fundraisers, festivals, and more.
        </div>
      </div>

      <div class="price-card">
        Hiring Listing
        <strong>$15 / Month</strong>

        <div class="small-note">
          Advertise available job positions within your business or organization.
        </div>
      </div>

    </div>

  </div>

  <h2>Submit Your Listing</h2>

  <form id="submissionForm">

    <label>Submission Type</label>

    <select name="submissionType" required>
      <option value="">Select Type</option>
      <option value="business">Business Listing</option>
      <option value="featured-business">Featured Business Listing</option>
      <option value="sponsor">Sponsor Placement</option>
      <option value="coupon">Coupon</option>
      <option value="event">Event</option>
      <option value="hiring">Hiring / Job Posting</option>
    </select>

    <label>Business / Organization Name</label>
    <input type="text" name="businessName" required>

    <label>Contact Name</label>
    <input type="text" name="contactName" required>

    <label>Email Address</label>
    <input type="email" name="email" required>

    <label>Phone Number</label>
    <input type="text" name="phone">

    <label>Business Address</label>
    <input type="text" name="address">

    <label>Website or Facebook Link</label>
    <input type="text" name="website">

    <label>Category</label>

    <select name="category" required>
      <option value="">Select Category</option>

      <option>Agriculture & Farm Services</option>
      <option>Animals & Pet Services</option>
      <option>Automotive Repair</option>
      <option>Automotive Services</option>
      <option>Catering & Event Services</option>
      <option>Churches</option>
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
      <option>Moving & Hauling</option>
      <option>Photography & Media</option>
      <option>Pools & Outdoor Living</option>
      <option>Professional Services</option>
      <option>Real Estate</option>
      <option>Shopping</option>
      <option>Towing & Recovery</option>
      <option>Weddings & Parties</option>
      <option>Other</option>

    </select>

    <div class="small-note">
      If your category does not exist, choose "Other" and explain the needed category in the notes section below.
    </div>

    <label>Listing Headline / Title</label>

    <input
      type="text"
      name="title"
      placeholder="Example: 20% Off This Month, Now Hiring, Grand Opening"
    >

    <div class="small-note">
      This is the main title people will see publicly.
    </div>

    <label>Description</label>
    <textarea name="description" required></textarea>

    <label>Package Length</label>

    <select name="packageLength" id="packageLength">
      <option value="">Select Duration</option>
      <option value="7">Weekly</option>
      <option value="30">Monthly</option>
      <option value="90">Quarterly</option>
      <option value="365">Yearly</option>
    </select>

    <label>Start Date</label>
    <input type="date" name="startDate" id="startDate">

    <label>End Date</label>
    <input type="date" name="endDate" id="endDate" readonly>

    <div class="small-note">
      End date is automatically calculated from the selected package length.
    </div>

    <label>Image Link</label>
    <input type="text" name="imageUrl">

    <div class="small-note">
      For security reasons, direct uploads are not enabled yet.<br>
      You may also email images to: thecountycompass@gmail.com
    </div>

    <label>Additional Notes</label>
    <textarea name="notes"></textarea>

    <button type="submit">Submit For Review</button>

    <div id="statusBox" class="status"></div>

  </form>

</div>

<script>

const form = document.getElementById("submissionForm");
const statusBox = document.getElementById("statusBox");

const packageLength = document.getElementById("packageLength");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

function updateEndDate() {

  const days = parseInt(packageLength.value);
  const start = startDate.value;

  if (!days || !start) {
    endDate.value = "";
    return;
  }

  const date = new Date(start);

  date.setDate(date.getDate() + days);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  endDate.value = `${yyyy}-${mm}-${dd}`;
}

packageLength.addEventListener("change", updateEndDate);
startDate.addEventListener("change", updateEndDate);

function showStatus(message, type) {

  statusBox.style.display = "block";
  statusBox.className = "status " + type;
  statusBox.innerText = message;
}

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const formData = new FormData(form);

  const payload = Object.fromEntries(formData.entries());

  try {

    const response = await fetch("/.netlify/functions/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Submission failed");
    }

    form.reset();

    showStatus(
      "Submission received successfully. Your listing will be reviewed before approval.",
      "success"
    );

  } catch (error) {

    console.error(error);

    showStatus(
      "There was a problem submitting the form. Please try again.",
      "error"
    );
  }

});

</script>

</body>
</html>