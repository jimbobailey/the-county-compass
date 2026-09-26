/* The County Compass — site menu helpers
   1. Marks the menu button for the page you're on.
   2. On phones, folds the menu into a single "Menu" button. */
(function () {
  function init() {
    var header = document.querySelector(".site-header");
    var nav = header && header.querySelector(".main-nav");
    if (!nav) return;

    // 1. Current page
    var here = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "") || "index";
    var links = nav.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      var target = (links[i].getAttribute("href") || "").split("/").pop().replace(/\.html$/, "") || "index";
      if (target === here) {
        links[i].classList.add("is-current");
        links[i].setAttribute("aria-current", "page");
      }
    }

    // 2. Phone menu button
    if (!nav.id) nav.id = "mainNav";
    var button = document.createElement("button");
    button.type = "button";
    button.className = "menu-toggle";
    button.setAttribute("aria-controls", nav.id);
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = '<span class="menu-toggle-bars" aria-hidden="true"></span>Menu';
    button.addEventListener("click", function () {
      var open = header.classList.toggle("menu-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.insertBefore(button, nav);
    header.classList.add("has-menu-toggle");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
