WF.registerEffect("text-split", function (elements) {
  if (typeof SplitText === "undefined") {
    console.warn("[wf-library] text-split requires SplitText plugin");
    return;
  }

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    elements.forEach(function (el) {
      var type = el.dataset.textType || "words";
      var stagger = parseFloat(el.dataset.textStagger) || 0.04;
      var duration = parseFloat(el.dataset.textDuration) || 0.6;
      var y = parseFloat(el.dataset.textY) || 16;
      var blur = parseFloat(el.dataset.textBlur) || 0;
      var useMask = el.dataset.textMask === "true";

      var splitConfig = { type: type };
      if (useMask) splitConfig.mask = (type === "chars") ? "chars" : "words";

      var split = SplitText.create(el, splitConfig);
      var targets = type === "chars" ? split.chars
        : type === "lines" ? split.lines
        : split.words;

      var fromVars = { y: y, autoAlpha: 0 };
      var toVars = {
        y: 0,
        autoAlpha: 1,
        duration: duration,
        stagger: stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      };

      if (blur > 0) {
        fromVars.filter = "blur(" + blur + "px)";
        toVars.filter = "blur(0px)";
      }

      gsap.fromTo(targets, fromVars, toVars);

      WF.onCleanup(function () { split.revert(); });
    });
  });
});
