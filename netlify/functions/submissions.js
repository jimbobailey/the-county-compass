const { getStore } = require("@netlify/blobs");

exports.handler = async function (event) {
  const store = getStore("pending-submissions");

  if (event.httpMethod === "GET") {
    try {
      const list = await store.list();
      const submissions = [];

      for (const item of list.blobs) {
        const submission = await store.get(item.key, { type: "json" });
        if (submission) {
          submissions.push(submission);
        }
      }

      submissions.sort((a, b) => {
        return new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0);
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          submissions
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to load submissions.",
          details: error.message
        })
      };
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body || "{}");

      const submission = {
        id: Date.now().toString(),
        status: "pending",
        submittedAt: new Date().toISOString(),
        ...data
      };

      await store.setJSON(submission.id, submission);

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Submission saved.",
          submission
        })
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
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method not allowed" })
  };
};