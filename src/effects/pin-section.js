WF.registerEffect("pin", function (elements) {
  elements.forEach(function (el) {
    var distance = parseFloat(el.dataset.pinDuration) || 500;

    ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "+=" + distance,
      pin: true,
    });
  });
});
