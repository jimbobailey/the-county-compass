const { getStore } = require("@netlify/blobs");

const STORE_NAME = "county-compass-data";
const HANDLED_KEY = "handled-submissions";

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
    const handled = await store.get(HANDLED_KEY, { type: "json" });

    return new Response(JSON.stringify(handled || []), {
      status: 200,
      headers
    });
  }

  if (request.method === "POST") {
    let body = {};

    try {
      body = await request.json();
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid JSON." }), {
        status: 400,
        headers
      });
    }

    const { submissionId, action, approvedAs, submissionData } = body;

    if (!submissionId || !action) {
      return new Response(
        JSON.stringify({ error: "Missing submissionId or action." }),
        { status: 400, headers }
      );
    }

    const handled = await store.get(HANDLED_KEY, { type: "json" }) || [];

    const existingIndex = handled.findIndex(
      item => item.submissionId === submissionId
    );

    const record = {
      submissionId,
      action,
      approvedAs: approvedAs || "",
      submissionData: submissionData || {},
      handledAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      handled[existingIndex] = record;
    } else {
      handled.push(record);
    }

    await store.setJSON(HANDLED_KEY, handled);

    return new Response(
      JSON.stringify({
        success: true,
        record
      }),
      { status: 200, headers }
    );
  }

  return new Response(JSON.stringify({ error: "Method not allowed." }), {
    status: 405,
    headers
  });
};