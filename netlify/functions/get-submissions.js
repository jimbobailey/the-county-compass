const { getStore } = require("@netlify/blobs");
const { isAdminRequest } = require("./_admin-auth");

const STORE_NAME = "county-compass-data";
const SUBMISSIONS_KEY = "pending-submissions";

exports.handler = async function (event) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  try {
    const authorization = event.headers && event.headers.authorization
      ? event.headers.authorization
      : "";
    const request = new Request("https://local/admin-submissions", {
      headers: { authorization }
    });

    if (!isAdminRequest(request)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Administrator authorization required." })
      };
    }

    const store = getStore({
  name: STORE_NAME,
  siteID: process.env.NETLIFY_SITE_ID,
  token: process.env.NETLIFY_API_TOKEN
});

    const submissions =
      await store.get(SUBMISSIONS_KEY, { type: "json" }) || [];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        submissions
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
