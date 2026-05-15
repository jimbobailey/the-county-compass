exports.handler = async function () {

  try {

    const token = process.env.NETLIFY_API_TOKEN;
    const siteId = process.env.NETLIFY_SITE_ID;

    if (!token) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "NETLIFY_API_TOKEN missing"
        })
      };
    }

    if (!siteId) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "NETLIFY_SITE_ID missing"
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

    const forms = await formsResponse.json();

    const targetForm = forms.find(
      form => form.name === "county-compass-submission"
    );

    if (!targetForm) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Form not found"
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
        error: error.message
      })
    };

  }

};