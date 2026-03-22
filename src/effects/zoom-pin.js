/**
 * Zoom Pin — Scroll-driven zoom with pinned section.
 * Child element scales up from reduced size to fill viewport.
 */
WF.registerEffect("zoom-pin", function (elements) {
  var tweens = [];
  var mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 768px)",
    isMobile: "(max-width: 767px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  }, function (context) {
    var c = context.conditions;

    if (c.reduceMotion) {
      elements.forEach(function (el) {
        var child = el.children[0];
        if (!child) return;
        gsap.set(child, { scale: 1, borderRadius: "0px" });
      });
      return;
    }

    elements.forEach(function (el) {
      var child = el.children[0];
      if (!child) return;

      if (c.isDesktop) {
        var scale = parseFloat(el.dataset.animateScale) || 0.6;
        var radius = parseFloat(el.dataset.animateRadius) || 24;
        var distance = parseFloat(el.dataset.animateDistance) || 600;

        el.style.overflow = "hidden";

        tweens.push(gsap.fromTo(child,
          { scale: scale, borderRadius: radius + "px" },
          {
            scale: 1,
            borderRadius: "0px",
            ease: "none",
            transformOrigin: "center center",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=" + distance,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        ));
      }

      if (c.isMobile) {
        tweens.push(gsap.fromTo(child,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        ));
      }
    });
  });

  WF.onCleanup(function () {
    tweens.forEach(function (t) { t.kill(); });
    elements.forEach(function (el) { el.style.overflow = ""; });
  });
});
