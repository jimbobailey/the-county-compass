const crypto = require("crypto");
const { getStore } = require("@netlify/blobs");

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

function reply(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "https://thecountycompass.com"
    },
    body: JSON.stringify(body)
  };
}

function clientFingerprint(event, race) {
  const h = event.headers || {};
  const ip = (h["x-nf-client-connection-ip"] || h["x-forwarded-for"] || "").split(",")[0].trim();
  const ua = h["user-agent"] || "";
  const lang = h["accept-language"] || "";
  const salt = process.env.POLL_FINGERPRINT_SALT;
  if (!salt) throw new Error("POLL_FINGERPRINT_SALT is not configured");
  return crypto.createHmac("sha256", salt).update(`${race}|${ip}|${ua}|${lang}`).digest("hex");
}

exports.handler = async (event) => {
  try {
    const store = getStore("community-poll");

    if (event.httpMethod === "GET") {
      const race = event.queryStringParameters && event.queryStringParameters.race;
      if (!VALID[race]) return reply(400, { error: "Invalid race" });
      const tally = (await store.get(`tally-${race}`, { type: "json" })) || {};
      const total = Object.values(tally).reduce((a,b)=>a+Number(b||0),0);
      return reply(200, { tally, total });
    }

    if (event.httpMethod !== "POST") return reply(405, { error: "Method not allowed" });

    let body;
    try { body = JSON.parse(event.body || "{}"); }
    catch { return reply(400, { error: "Invalid request" }); }

    const { race, candidate } = body;
    if (!VALID[race] || !VALID[race].has(candidate)) return reply(400, { error: "Invalid vote" });

    const fingerprint = clientFingerprint(event, race);
    const voterKey = `voter-${race}-${fingerprint}`;

    const existing = await store.get(voterKey);
    if (existing) return reply(409, { error: "Already voted" });

    // Reserve this anonymous fingerprint before incrementing the tally.
    await store.set(voterKey, "1");

    const tallyKey = `tally-${race}`;
    const tally = (await store.get(tallyKey, { type: "json" })) || {};
    tally[candidate] = Number(tally[candidate] || 0) + 1;
    await store.setJSON(tallyKey, tally);

    const total = Object.values(tally).reduce((a,b)=>a+Number(b||0),0);
    return reply(200, { ok: true, tally, total });
  } catch (err) {
    console.error(err);
    return reply(500, { error: "Server error" });
  }
};
