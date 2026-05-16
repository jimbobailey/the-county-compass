const { getStore } = require("@netlify/blobs");

const STORE_NAME = "county-compass-data";
const SUBMISSIONS_KEY = "pending-submissions";

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

    const submissions =
      await store.get(SUBMISSIONS_KEY, { type: "json" }) || [];

    const newSubmission = {
      id: "submission-" + Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
      data: body
    };

    submissions.push(newSubmission);

    await store.setJSON(SUBMISSIONS_KEY, submissions);

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