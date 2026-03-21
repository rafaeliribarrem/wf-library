/**
 * Stagger Children — GSAP-driven
 * Uses gsap.fromTo() for reliable start/end states.
 */
(function () {
  "use strict";

  window.WF = window.WF || {};
  window.WF._cssAnimations = window.WF._cssAnimations || [];

  window.WF._cssAnimations.push(function () {
    var parents = document.querySelectorAll("[data-animate-stagger]");
    if (!parents.length) return;

    var mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", function () {
      parents.forEach(function (parent) {
        var staggerDelay = parseFloat(parent.dataset.animateStagger) || 0.1;
        var duration = parseFloat(parent.dataset.animateDuration) || 0.6;
        var y = parseFloat(parent.dataset.animateY) || 16;
        var blur = parseFloat(parent.dataset.animateBlur) || 0;

        var children = Array.from(parent.children);
        if (!children.length) return;

        var fromVars = { autoAlpha: 0, y: y };
        var toVars = {
          autoAlpha: 1,
          y: 0,
          duration: duration,
          stagger: staggerDelay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: parent,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        };

        if (blur > 0) {
          fromVars.filter = "blur(" + blur + "px)";
          toVars.filter = "blur(0px)";
        }

        gsap.fromTo(children, fromVars, toVars);
      });
    });
  });
})();
