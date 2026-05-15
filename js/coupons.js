async function loadCouponsFromServer() {

  try {

    const response =
      await fetch("/.netlify/functions/coupons");

    const data =
      await response.json();

    savedCoupons =
      Array.isArray(data)
        ? data
        : [];

  } catch (error) {

    console.error("Coupon load failed:", error);

    savedCoupons = [];
  }

  renderCoupons(
    getActiveCoupons()
  );
}