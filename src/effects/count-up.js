WF.registerEffect("count-up", function (elements) {
  elements.forEach(function (el) {
    var target = parseFloat(el.textContent.replace(/[^0-9.\-]/g, "")) || 0;
    var from = parseFloat(el.dataset.countFrom) || 0;
    var duration = parseFloat(el.dataset.countDuration) || 2;
    var prefix = el.dataset.countPrefix || "";
    var suffix = el.dataset.countSuffix || "";
    var decimals = parseInt(el.dataset.countDecimals) || 0;
    var separator = el.dataset.countSeparator !== undefined ? el.dataset.countSeparator : ",";

    function format(val) {
      var fixed = val.toFixed(decimals);
      if (!separator) return prefix + fixed + suffix;
      var parts = fixed.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return prefix + parts.join(".") + suffix;
    }

    el.textContent = format(from);
    // Make visible (CSS sets visibility:hidden for FOUC prevention)
    gsap.set(el, { autoAlpha: 1 });

    var counter = { value: from };

    gsap.to(counter, {
      value: target,
      duration: duration,
      ease: "power1.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
      },
      onUpdate: function () { el.textContent = format(counter.value); },
    });
  });
});
