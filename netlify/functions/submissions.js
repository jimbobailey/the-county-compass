const { getStore } = require("@netlify/blobs");

const STORE_NAME = "county-compass-data";
const DATA_KEY = "submissions";

exports.default = async function handler(request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (request.method === "OPTIONS") {
    return new Response("", { status: 200, headers });
  }

  const store = getStore(STORE_NAME);

  if (request.method === "GET") {
    const savedData = await store.get(DATA_KEY, { type: "json" });

    return new Response(JSON.stringify(savedData || []), {
      status: 200,
      headers
    });
  }

  if (request.method === "POST") {
    let incomingData = {};

    try {
      incomingData = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid submission data." }),
        { status: 400, headers }
      );
    }

    const savedData =
      await store.get(DATA_KEY, { type: "json" }) || [];

    const newSubmission = {
      id: Date.now() + Math.floor(Math.random() * 100000),
      status: "Pending",
      dateSubmitted: new Date().toISOString(),
      ...incomingData
    };

    savedData.unshift(newSubmission);

    await store.setJSON(DATA_KEY, savedData);

    return new Response(
      JSON.stringify({
        success: true,
        submission: newSubmission
      }),
      {
        status: 200,
        headers
      }
    );
  }

  return new Response(
    JSON.stringify({ error: "Method not allowed." }),
    { status: 405, headers }
  );
}