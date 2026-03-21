WF.registerEffect("navbar-scroll", function (elements) {
  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    elements.forEach(function (nav) {
      var threshold = parseFloat(nav.dataset.navbarThreshold) || 50;
      var duration = parseFloat(nav.dataset.navbarDuration) || 0.3;

      var showAnim = gsap.from(nav, {
        yPercent: -100,
        paused: true,
        duration: duration,
        ease: "power2.out",
      }).progress(1);

      ScrollTrigger.create({
        start: "top top-=" + threshold,
        end: "max",
        onUpdate: function (self) {
          self.direction === -1 ? showAnim.play() : showAnim.reverse();
        },
      });
    });
  });
});
