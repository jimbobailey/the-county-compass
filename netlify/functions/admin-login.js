const crypto = require("crypto");
const { createAdminToken } = require("./_admin-auth");

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));

  return leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

exports.default = async function handler(request) {
  const headers = { "Content-Type": "application/json" };

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed." }),
      { status: 405, headers }
    );
  }

  const configuredPassword = process.env.ADMIN_PASSWORD || "";
  const body = await request.json().catch(() => ({}));

  if (
    !configuredPassword ||
    !safeEqual(body.password, configuredPassword)
  ) {
    return new Response(
      JSON.stringify({ error: "Incorrect administrator password." }),
      { status: 401, headers }
    );
  }

  return new Response(
    JSON.stringify({ success: true, token: createAdminToken() }),
    { status: 200, headers }
  );
};
