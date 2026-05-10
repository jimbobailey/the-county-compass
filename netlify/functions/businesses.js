const { getStore } = require("@netlify/blobs");

const STORE_NAME = "county-compass-data";
const DATA_KEY = "businesses";

exports.handler = async function(event) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  const store = getStore(STORE_NAME);

  if (event.httpMethod === "GET") {
    const savedData = await store.get(DATA_KEY, { type: "json" });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(savedData || [])
    };
  }

  if (event.httpMethod === "POST") {
    let incomingData = [];

    try {
      incomingData = JSON.parse(event.body || "[]");
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Invalid JSON data."
        })
      };
    }

    if (!Array.isArray(incomingData)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Business data must be an array."
        })
      };
    }

    await store.setJSON(DATA_KEY, incomingData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: incomingData.length
      })
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({
      error: "Method not allowed."
    })
  };
};