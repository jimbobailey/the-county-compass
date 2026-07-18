const { getStore } = require("@netlify/blobs");
const nodemailer = require("nodemailer");

const STORE_NAME = "county-compass-data";
const SUBMISSIONS_KEY = "pending-submissions";
const IMAGE_STORE_NAME = "county-compass-submission-images";
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function decodeSubmittedImage(image) {
  if (!image || !image.dataUrl) {
    return null;
  }

  const match = String(image.dataUrl).match(
    /^data:(image\/(?:webp|png|jpeg));base64,([A-Za-z0-9+/=]+)$/
  );

  if (!match) {
    throw new Error("The uploaded image format is invalid.");
  }

  const buffer = Buffer.from(match[2], "base64");

  if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) {
    throw new Error("The prepared image must be smaller than 2 MB.");
  }

  return {
    buffer,
    contentType: match[1]
  };
}

exports.default = async function handler(request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (request.method === "OPTIONS") {
    return new Response("", { status: 200, headers });
  }

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed." }),
      { status: 405, headers }
    );
  }

  try {
    const body = await request.json();

    const store = getStore(STORE_NAME);
    const submissionId = "submission-" + Date.now();
    const decodedImage = decodeSubmittedImage(body.graphicUpload);
    let uploadedImageUrl = String(body.imageLink || "").trim();

    if (decodedImage) {
      const imageStore = getStore(IMAGE_STORE_NAME);
      const businessImageKey = "businesses/" + submissionId + ".webp";
      const adImageKey = "ads/" + submissionId + ".webp";

      const imageBytes = decodedImage.buffer.buffer.slice(
        decodedImage.buffer.byteOffset,
        decodedImage.buffer.byteOffset + decodedImage.buffer.byteLength
      );

      const imageOptions = {
        metadata: {
          contentType: decodedImage.contentType,
          originalName: body.graphicUpload.name || "listing-image"
        }
      };

      await Promise.all([
        imageStore.set(businessImageKey, imageBytes, imageOptions),
        imageStore.set(adImageKey, imageBytes, imageOptions)
      ]);

      const origin = new URL(request.url).origin;
      uploadedImageUrl =
        origin + "/.netlify/functions/submission-image?id=" +
        encodeURIComponent(businessImageKey);
      body.adImageUrl =
        origin + "/.netlify/functions/submission-image?id=" +
        encodeURIComponent(adImageKey);
    }

    delete body.graphicUpload;
    body.imageUrl = uploadedImageUrl;

    const submissions =
      await store.get(SUBMISSIONS_KEY, { type: "json" }) || [];

    const newSubmission = {
      id: submissionId,
      status: "pending",
      createdAt: new Date().toISOString(),
      data: body
    };

    submissions.push(newSubmission);

    await store.setJSON(SUBMISSIONS_KEY, submissions);

    if (
      process.env.NOTIFY_EMAIL &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS
    ) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"The County Compass" <${process.env.EMAIL_USER}>`,
        to: process.env.NOTIFY_EMAIL,
        subject: "New County Compass Submission",
        text:
`New submission received.

Type: ${body.submissionType || ""}
Business / Organization: ${body.businessName || ""}
Contact: ${body.contactName || ""}
Email: ${body.email || ""}
Phone: ${body.phone || ""}
Category: ${body.category || ""}
Title: ${body.title || ""}

Check admin submissions to review it.`
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        submission: newSubmission
      }),
      { status: 200, headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    );
  }
};
