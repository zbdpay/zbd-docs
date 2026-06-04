// Show the "Widgets" tab only when on /widget routes.
(function () {
  function isWidgetRoute() {
    var pathname = window.location.pathname.replace(/\/+$/, "");
    return pathname === "/widget" || pathname.startsWith("/widget/");
  }

  function updateRouteClass(onWidget) {
    document.documentElement.classList.toggle("zbd-widget-route", onWidget);
  }

  function toggle() {
    var onWidget = isWidgetRoute();
    updateRouteClass(onWidget);

    // Find the Widgets tab link in the top nav by its text content.
    var links = document.querySelectorAll("nav a, header a, [role='tablist'] a, [class*='tab'] a");
    for (var i = 0; i < links.length; i++) {
      var text = (links[i].textContent || "").trim();
      if (text === "Widgets") {
        if (onWidget) {
          links[i].style.removeProperty("display");
        } else {
          links[i].style.display = "none";
        }
      }
    }
  }

  updateRouteClass(isWidgetRoute());

  // Run on load and periodically (Mintlify hydrates async).
  toggle();
  setTimeout(toggle, 500);
  setTimeout(toggle, 1500);
  setTimeout(toggle, 3000);

  // Re-check on client-side navigation.
  ["pushState", "replaceState"].forEach(function (method) {
    var original = history[method];
    history[method] = function () {
      original.apply(this, arguments);
      setTimeout(toggle, 100);
    };
  });

  window.addEventListener("popstate", function () {
    setTimeout(toggle, 100);
  });

  // MutationObserver to catch Mintlify's dynamic rendering.
  function observeBody() {
    if (!document.body) {
      setTimeout(observeBody, 0);
      return;
    }

    var observer = new MutationObserver(function () { toggle(); });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  observeBody();
})();
