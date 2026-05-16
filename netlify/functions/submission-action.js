const { getStore } = require("@netlify/blobs");

const STORE_NAME = "county-compass-data";
const HANDLED_KEY = "handled-submissions";
const BUSINESS_KEY = "businesses";
const COUPON_KEY = "coupons";
const EVENT_KEY = "events";
const HIRING_KEY = "hiring";
const AD_KEY = "ads";

exports.default = async function handler(request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (request.method === "OPTIONS") {
    return new Response("", {
      status: 200,
      headers
    });
  }

  const store = getStore(STORE_NAME);

  if (request.method === "GET") {
    const handled =
      await store.get(HANDLED_KEY, {
        type: "json"
      }) || [];

    return new Response(
      JSON.stringify(handled),
      {
        status: 200,
        headers
      }
    );
  }

  if (request.method === "POST") {

    let body = {};

    try {
      body = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON."
        }),
        {
          status: 400,
          headers
        }
      );
    }

    const {
      submissionId,
      action,
      approvedAs,
      submissionData
    } = body;

    if (!submissionId || !action) {
      return new Response(
        JSON.stringify({
          error: "Missing submissionId or action."
        }),
        {
          status: 400,
          headers
        }
      );
    }

    const handled =
      await store.get(HANDLED_KEY, {
        type: "json"
      }) || [];

    const businesses =
      await store.get(BUSINESS_KEY, {
        type: "json"
      }) || [];

    const coupons =
      await store.get(COUPON_KEY, {
        type: "json"
      }) || [];

    const events =
      await store.get(EVENT_KEY, {
        type: "json"
      }) || [];

    const hiring =
      await store.get(HIRING_KEY, {
        type: "json"
      }) || [];

    const ads =
      await store.get(AD_KEY, {
        type: "json"
      }) || [];

    const existingIndex = handled.findIndex(
      item =>
        item.submissionId === submissionId
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

    // APPROVE BUSINESS
    if (
      action === "approved" &&
      approvedAs === "business"
    ) {

      const businessEntry = {
        id: Date.now(),

        name:
          submissionData.businessName || "",

        category:
          submissionData.category || "",

        address:
          submissionData.address || "",

        phone:
          submissionData.phone || "",

        email:
          submissionData.email || "",

        website:
          submissionData.website || "",

        image:
          submissionData.imageUrl || "",

        description:
          submissionData.description || "",

        paid: "No",

        featured: "No",

        featuredLocation:
          "homepage"
      };

      businesses.push(
        businessEntry
      );

      await store.setJSON(
        BUSINESS_KEY,
        businesses
      );
    }

    // APPROVE COUPON
    if (
      action === "approved" &&
      approvedAs === "coupon"
    ) {

      const couponEntry = {
        id: Date.now(),

        businessName:
          submissionData.businessName || "",

        title:
          submissionData.title || "",

        category:
          submissionData.category || "",

        details:
          submissionData.description || "",

        image:
          submissionData.imageUrl || "",

        expiration: "",

        active: "Yes"
      };

      coupons.push(
        couponEntry
      );

      await store.setJSON(
        COUPON_KEY,
        coupons
      );
    }

    // APPROVE EVENT
    if (
      action === "approved" &&
      approvedAs === "event"
    ) {

      const eventEntry = {
        id: Date.now(),

        title:
          submissionData.title || "",

        location:
          submissionData.address || "",

        category:
          submissionData.category || "",

        date:
          submissionData.startDate || "",

        time: "",

        image:
          submissionData.imageUrl || "",

        description:
          submissionData.description || ""
      };

      events.push(
        eventEntry
      );

      await store.setJSON(
        EVENT_KEY,
        events
      );
    }

    // APPROVE HIRING
    if (
      action === "approved" &&
      approvedAs === "hiring"
    ) {

      const hiringEntry = {
        id: Date.now(),

        business:
          submissionData.businessName || "",

        title:
          submissionData.title || "",

        phone:
          submissionData.phone || "",

        website:
          submissionData.website || "",

        image:
          submissionData.imageUrl || "",

        description:
          submissionData.description || "",

        type:
          "Full Time",

        pay:
          ""
      };

      hiring.push(
        hiringEntry
      );

      await store.setJSON(
        HIRING_KEY,
        hiring
      );
    }

    // APPROVE SPONSOR
    if (
      action === "approved" &&
      approvedAs === "sponsor"
    ) {

      const sponsorEntry = {
        id: Date.now(),

        title:
          submissionData.businessName || "",

        image:
          submissionData.imageUrl || "",

        link:
          submissionData.website || "",

        active:
          "Yes",

        shape:
          "square",

        location:
          "all",

        expiration:
          ""
      };

      ads.push(
        sponsorEntry
      );

      await store.setJSON(
        AD_KEY,
        ads
      );
    }

    await store.setJSON(
      HANDLED_KEY,
      handled
    );

    return new Response(
      JSON.stringify({
        success: true,
        record
      }),
      {
        status: 200,
        headers
      }
    );
  }

  return new Response(
    JSON.stringify({
      error: "Method not allowed."
    }),
    {
      status: 405,
      headers
    }
  );
};