/**
 * Reveal — GSAP-driven clip-path animation
 * Uses gsap.fromTo() with autoAlpha + clipPath.
 * autoAlpha handles visibility (fixes FOUC from CSS visibility:hidden).
 */
WF.registerEffect("reveal-up", function (elements) {
  var mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", function () {
    elements.forEach(function (el) {
      var duration = parseFloat(el.dataset.animateDuration) || 0.8;
      var delay = parseFloat(el.dataset.animateDelay) || 0;

      gsap.fromTo(el,
        { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          autoAlpha: 1,
          duration: duration,
          delay: delay,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  });
});

WF.registerEffect("reveal-down", function (elements) {
  var mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", function () {
    elements.forEach(function (el) {
      var duration = parseFloat(el.dataset.animateDuration) || 0.8;
      var delay = parseFloat(el.dataset.animateDelay) || 0;

      gsap.fromTo(el,
        { clipPath: "inset(0% 0% 100% 0%)", autoAlpha: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          autoAlpha: 1,
          duration: duration,
          delay: delay,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  });
});

WF.registerEffect("reveal-left", function (elements) {
  var mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", function () {
    elements.forEach(function (el) {
      var duration = parseFloat(el.dataset.animateDuration) || 0.8;
      var delay = parseFloat(el.dataset.animateDelay) || 0;

      gsap.fromTo(el,
        { clipPath: "inset(0% 100% 0% 0%)", autoAlpha: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          autoAlpha: 1,
          duration: duration,
          delay: delay,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  });
});

WF.registerEffect("reveal-right", function (elements) {
  var mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", function () {
    elements.forEach(function (el) {
      var duration = parseFloat(el.dataset.animateDuration) || 0.8;
      var delay = parseFloat(el.dataset.animateDelay) || 0;

      gsap.fromTo(el,
        { clipPath: "inset(0% 0% 0% 100%)", autoAlpha: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          autoAlpha: 1,
          duration: duration,
          delay: delay,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  });
});
