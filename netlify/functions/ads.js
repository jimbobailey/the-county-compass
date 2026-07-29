const { getStore } = require("@netlify/blobs");
const { isAdminRequest, unauthorizedResponse } = require("./_admin-auth");

const STORE_NAME = "county-compass-data";
const DATA_KEY = "ads";

exports.default = async function handler(request) {

  console.log("========== ADS REQUEST ==========");
  console.log("Time:", new Date().toISOString());
  console.log("Method:", request.method);
  console.log("URL:", request.url);
  console.log("User-Agent:", request.headers.get("user-agent"));
  console.log("Referer:", request.headers.get("referer"));
  console.log("CF-Connecting-IP:", request.headers.get("cf-connecting-ip"));
  console.log("X-Forwarded-For:", request.headers.get("x-forwarded-for"));
  console.log("=================================");

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (request.method === "OPTIONS") {

    return new Response("", {
      status: 200,
      headers
    });
  }

  const store =
    getStore(STORE_NAME);

  if (request.method === "GET") {

    const savedData =
      await store.get(DATA_KEY, {
        type: "json"
      });

    return new Response(
      JSON.stringify(savedData || []),
      {
        status: 200,
        headers
      }
    );
  }

  if (request.method === "POST") {
    if (!isAdminRequest(request)) {
      return unauthorizedResponse(headers);
    }

    let incomingData = [];

    try {

      incomingData =
        await request.json();

    } catch (error) {

      return new Response(
        JSON.stringify({
          error: "Invalid JSON data."
        }),
        {
          status: 400,
          headers
        }
      );
    }

    if (!Array.isArray(incomingData)) {

      return new Response(
        JSON.stringify({
          error: "Ad data must be an array."
        }),
        {
          status: 400,
          headers
        }
      );
    }

    await store.setJSON(
      DATA_KEY,
      incomingData
    );

    return new Response(
      JSON.stringify({
        success: true,
        count: incomingData.length
      }),
      {
        status: 200,
        headers
      }
    );
  }

  return new Response(
    JSON.stringify({
      error: "Method not allowed."
    }),
    {
      status: 405,
      headers
    }
  );
};