/**
 * Fade In — GSAP-driven with gsap.fromTo() for reliable state management.
 * gsap.from() can leave elements in "from" state if tween is GC'd.
 * gsap.fromTo() explicitly defines both start and end states.
 */
(function () {
  "use strict";

  function createFadeEffect(name, getFromVars) {
    WF.registerEffect(name, function (elements) {
      var mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", function () {
        elements.forEach(function (el) {
          var duration = parseFloat(el.dataset.animateDuration) || 0.6;
          var delay = parseFloat(el.dataset.animateDelay) || 0;
          var blur = parseFloat(el.dataset.animateBlur) || 0;

          var fromVars = getFromVars(el);
          fromVars.autoAlpha = 0;
          if (blur > 0) fromVars.filter = "blur(" + blur + "px)";

          var toVars = {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: duration,
            delay: delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          };
          if (blur > 0) toVars.filter = "blur(0px)";

          gsap.fromTo(el, fromVars, toVars);
        });
      });
    });
  }

  createFadeEffect("fade-in", function (el) {
    return { y: parseFloat(el.dataset.animateY) || 16 };
  });

  createFadeEffect("fade-in-left", function (el) {
    return { x: parseFloat(el.dataset.animateX) || -20 };
  });

  createFadeEffect("fade-in-right", function (el) {
    return { x: parseFloat(el.dataset.animateX) || 20 };
  });

  createFadeEffect("fade-in-down", function (el) {
    return { y: parseFloat(el.dataset.animateY) || -16 };
  });

  createFadeEffect("fade-in-scale", function (el) {
    return { scale: parseFloat(el.dataset.animateScale) || 0.95 };
  });
})();
