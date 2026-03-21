/**
 * Lenis Smooth Scroll Setup
 */
(function () {
  "use strict";

  window.WF = window.WF || {};

  if (typeof Lenis === "undefined") {
    return;
  }

  var lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  window.WF.lenis = lenis;
})();
