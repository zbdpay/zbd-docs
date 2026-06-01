// Show the "Widgets" tab only when on /widget/* routes.
(function () {
  function toggle() {
    var onWidget = window.location.pathname.startsWith("/widget");
    // Find the Widgets tab link in the top nav by its text content
    var links = document.querySelectorAll("nav a, header a, [role='tablist'] a, [class*='tab'] a, a");
    for (var i = 0; i < links.length; i++) {
      var text = (links[i].textContent || "").trim();
      if (text === "Widgets") {
        links[i].style.display = onWidget ? "" : "none";
      }
    }
  }

  // Run on load and periodically (Mintlify hydrates async)
  toggle();
  setTimeout(toggle, 500);
  setTimeout(toggle, 1500);
  setTimeout(toggle, 3000);

  // Re-check on client-side navigation
  var _pushState = history.pushState;
  history.pushState = function () {
    _pushState.apply(this, arguments);
    setTimeout(toggle, 100);
  };
  window.addEventListener("popstate", function () {
    setTimeout(toggle, 100);
  });

  // MutationObserver to catch Mintlify's dynamic rendering
  var observer = new MutationObserver(function () { toggle(); });
  observer.observe(document.body, { childList: true, subtree: true });
})();
