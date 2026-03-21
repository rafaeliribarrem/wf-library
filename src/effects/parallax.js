WF.registerEffect("parallax", function (elements) {
  var mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 768px)",
    isMobile: "(max-width: 767px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  }, function (context) {
    var c = context.conditions;
    if (c.reduceMotion) return;

    elements.forEach(function (el) {
      var speed = parseFloat(el.dataset.parallaxSpeed) || 0.2;
      if (c.isMobile) speed *= 0.5;
      var direction = el.dataset.parallaxDirection || "up";
      var distance = speed * 80;

      var movement = {};
      if (direction === "up") movement.y = -distance;
      else if (direction === "down") movement.y = distance;
      else if (direction === "left") movement.x = -distance;
      else movement.x = distance;

      gsap.to(el, Object.assign(movement, {
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }));
    });
  });
});
