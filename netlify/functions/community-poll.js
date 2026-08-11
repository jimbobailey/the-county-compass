const crypto = require("crypto");
const { getStore } = require("@netlify/blobs");

const STORE_NAME = "county-compass-data";

const VALID = {
  governor: new Set([
    "Charles Burkett","Jay Collins","Shea Cruel","Jenny Patricia Curtman","Byron Donalds",
    "James Fishback","Jim Holcomb","Daniel J. Imperato","John Joseph Mercadante","Paul Renner",
    "Rachel Rodriguez","James Walker Shaw","Caneste Succe","Bobby Williams","Jerry Demings",
    "David Jolly","Dayna Marie Foster","Moliere Dimanche","Jason Pizzo","Scott Jewett"
  ]),
  cd2: new Set([
    "Keith Gross","Austin Rogers","Audie Rowell","Jim Norton","Evan Power","Luke Murphy",
    "Nick Lewis","Yen Bailey","Brice Barnes","Amanda Green","Nic Zateslo"
  ])
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    }
  });
}

function fingerprint(request, race) {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "";
  const ua = request.headers.get("user-agent") || "";
  const lang = request.headers.get("accept-language") || "";
  const salt = process.env.POLL_FINGERPRINT_SALT;
  if (!salt) throw new Error("POLL_FINGERPRINT_SALT is not configured");
  return crypto.createHmac("sha256", salt)
    .update(`${race}|${ip}|${ua}|${lang}`)
    .digest("hex");
}

exports.default = async function handler(request) {
  try {
    if (request.method === "OPTIONS") return json({}, 200);

    const store = getStore(STORE_NAME);
    const url = new URL(request.url);

    if (request.method === "GET") {
      const race = url.searchParams.get("race");
      if (!VALID[race]) return json({ error: "Invalid race" }, 400);

      const tally = (await store.get(`poll-tally-${race}`, { type: "json" })) || {};
      const total = Object.values(tally).reduce((a, b) => a + Number(b || 0), 0);
      return json({ tally, total });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid request" }, 400);
    }

    if (body.action === "suggestion") {
      const text = String(body.suggestion || "").trim();
      if (!text || text.length > 1000) return json({ error: "Invalid suggestion" }, 400);
      const suggestionKey = `poll-suggestion-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
      await store.setJSON(suggestionKey, { text, submittedAt: new Date().toISOString() });
      return json({ ok: true });
    }

    const { race, candidate } = body;
    if (!VALID[race] || !VALID[race].has(candidate)) {
      return json({ error: "Invalid vote" }, 400);
    }

    const voterKey = `poll-voter-${race}-${fingerprint(request, race)}`;
    if (await store.get(voterKey)) {
      return json({ error: "Already voted" }, 409);
    }

    await store.set(voterKey, "1");

    const tallyKey = `poll-tally-${race}`;
    const tally = (await store.get(tallyKey, { type: "json" })) || {};
    tally[candidate] = Number(tally[candidate] || 0) + 1;
    await store.setJSON(tallyKey, tally);

    const total = Object.values(tally).reduce((a, b) => a + Number(b || 0), 0);
    return json({ ok: true, tally, total });
  } catch (error) {
    console.error("COMMUNITY POLL ERROR:", error);
    return json({ error: "Server error" }, 500);
  }
};
