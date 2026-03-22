/**
 * Scale Reveal — Section scales from reduced size to full viewport.
 * Apple-style reveal with border-radius transition.
 */
WF.registerEffect("scale-reveal", function (elements) {
  var tweens = [];
  var mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 768px)",
    isMobile: "(max-width: 767px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  }, function (context) {
    var c = context.conditions;

    if (c.reduceMotion || c.isMobile) {
      elements.forEach(function (el) {
        gsap.set(el, { scale: 1, borderRadius: "0px" });
      });
      return;
    }

    elements.forEach(function (el) {
      var scale = parseFloat(el.dataset.animateScale) || 0.85;
      var radius = parseFloat(el.dataset.animateRadius) || 24;
      var distance = parseFloat(el.dataset.animateDistance) || 400;

      tweens.push(gsap.fromTo(el,
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
    });
  });

  WF.onCleanup(function () {
    tweens.forEach(function (t) { t.kill(); });
  });
});
