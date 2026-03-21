/**
 * GSAP Default Configuration
 */
(function () {
  "use strict";

  gsap.defaults({
    duration: 0.6,
    ease: "power2.out",
  });

  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.defaults({
      toggleActions: "play none none none",
    });
  }

  window.WF = window.WF || {};
  window.WF.eases = {
    smooth: "power2.inOut",
    snappy: "power3.out",
    bounce: "back.out(1.4)",
    elastic: "elastic.out(1, 0.5)",
    expo: "expo.out",
  };
})();
