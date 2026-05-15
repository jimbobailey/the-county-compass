exports.handler = async function () {
  try {
    const token = process.env.NETLIFY_API_TOKEN;
    const siteId = process.env.NETLIFY_SITE_ID;

    if (!token || !siteId) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing NETLIFY_API_TOKEN or NETLIFY_SITE_ID."
        })
      };
    }

    const formsResponse = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/forms`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!formsResponse.ok) {
      throw new Error("Could not load Netlify forms.");
    }

    const forms = await formsResponse.json();

    const targetForm = forms.find(
      form => form.name === "county-compass-submission"
    );

    if (!targetForm) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "county-compass-submission form not found."
        })
      };
    }

    const submissionsResponse = await fetch(
      `https://api.netlify.com/api/v1/forms/${targetForm.id}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!submissionsResponse.ok) {
      throw new Error("Could not load form submissions.");
    }

    const submissions = await submissionsResponse.json();

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
};