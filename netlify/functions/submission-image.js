const { getStore } = require("@netlify/blobs");

const IMAGE_STORE_NAME = "county-compass-submission-images";

exports.default = async function handler(request) {
  if (request.method !== "GET") {
    return new Response("Method not allowed.", { status: 405 });
  }

  const imageKey = new URL(request.url).searchParams.get("id");

  if (!imageKey || !/^submission-[0-9]+\.webp$/.test(imageKey)) {
    return new Response("Invalid image.", { status: 400 });
  }

  const store = getStore(IMAGE_STORE_NAME);
  const image = await store.get(imageKey, { type: "arrayBuffer" });

  if (!image) {
    return new Response("Image not found.", { status: 404 });
  }

  return new Response(image, {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff"
    }
  });
};
