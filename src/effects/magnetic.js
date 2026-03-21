WF.registerEffect("magnetic", function (elements) {
  if (!window.matchMedia("(hover: hover)").matches) return;

  var mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", function () {
    elements.forEach(function (el) {
      var strength = parseFloat(el.dataset.magneticStrength) || 0.3;
      var duration = parseFloat(el.dataset.magneticDuration) || 0.4;

      var xTo = gsap.quickTo(el, "x", { duration: duration, ease: "power3.out" });
      var yTo = gsap.quickTo(el, "y", { duration: duration, ease: "power3.out" });

      function onMove(e) {
        var rect = el.getBoundingClientRect();
        var dx = e.clientX - (rect.left + rect.width / 2);
        var dy = e.clientY - (rect.top + rect.height / 2);
        xTo(dx * strength);
        yTo(dy * strength);
      }

      function onLeave() {
        xTo(0);
        yTo(0);
      }

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      WF.onCleanup(function () {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });
  });
});
