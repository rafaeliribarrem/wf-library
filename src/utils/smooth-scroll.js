/**
 * Smooth Scroll to Anchors
 * Intercepts clicks on [href^="#"] and scrolls smoothly via Lenis or native fallback.
 */
(function () {
  "use strict";

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var href = link.getAttribute("href");
    if (href === "#" || href === "#!") return;

    var target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    if (window.WF && window.WF.lenis) {
      window.WF.lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
})();
