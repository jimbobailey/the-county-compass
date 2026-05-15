const { getStore } = require("@netlify/blobs");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const submission = {
      id: Date.now().toString(),
      status: "pending",
      submittedAt: new Date().toISOString(),
      ...data
    };

    const store = getStore("pending-submissions");
    await store.setJSON(submission.id, submission);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, submission })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to save submission.",
        details: error.message
      })
    };
  }
};