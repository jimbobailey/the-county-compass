const { getStore } = require("@netlify/blobs");
const { isAdminRequest, unauthorizedResponse } = require("./_admin-auth");

const STORE_NAME = "county-compass-data";
const SUBMISSIONS_KEY = "pending-submissions";

exports.default = async function handler(request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS"
  };

  if (request.method === "OPTIONS") {
    return new Response("", { status: 200, headers });
  }

  if (!isAdminRequest(request)) {
    return unauthorizedResponse(headers);
  }

  if (request.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed." }),
      { status: 405, headers }
    );
  }

  try {
    const store = getStore(STORE_NAME);
    const submissions =
      await store.get(SUBMISSIONS_KEY, { type: "json" }) || [];

    return new Response(
      JSON.stringify({ success: true, submissions }),
      { status: 200, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    );
  }
};
