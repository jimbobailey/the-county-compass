const crypto = require("crypto");

const SESSION_LENGTH_SECONDS = 8 * 60 * 60;

function getSigningSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function sign(value) {
  return crypto
    .createHmac("sha256", getSigningSecret())
    .update(value)
    .digest("base64url");
}

function createAdminToken() {
  if (!getSigningSecret()) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  const payload = Buffer.from(JSON.stringify({
    role: "admin",
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_LENGTH_SECONDS
  })).toString("base64url");

  return payload + "." + sign(payload);
}

function isAdminRequest(request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";
  const parts = token.split(".");

  if (parts.length !== 2 || !getSigningSecret()) {
    return false;
  }

  const expected = Buffer.from(sign(parts[0]));
  const supplied = Buffer.from(parts[1]);

  if (
    expected.length !== supplied.length ||
    !crypto.timingSafeEqual(expected, supplied)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(parts[0], "base64url").toString("utf8")
    );

    return payload.role === "admin" &&
      Number(payload.expiresAt) > Math.floor(Date.now() / 1000);
  } catch (error) {
    return false;
  }
}

function unauthorizedResponse(headers = {}) {
  return new Response(
    JSON.stringify({ error: "Administrator authorization required." }),
    {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    }
  );
}

module.exports = {
  createAdminToken,
  isAdminRequest,
  unauthorizedResponse
};
