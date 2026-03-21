WF.registerEffect("horizontal-scroll", function (elements) {
  var mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", function () {
    elements.forEach(function (section) {
      var wrapper = section.firstElementChild;
      if (!wrapper) return;

      var scrub = parseFloat(section.dataset.horizontalScrub) || 1;

      function getDistance() {
        return wrapper.scrollWidth - section.offsetWidth;
      }

      gsap.to(wrapper, {
        x: function () { return -getDistance(); },
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: function () { return "+=" + getDistance(); },
          pin: true,
          scrub: scrub,
          invalidateOnRefresh: true,
        },
      });
    });
  });

  mm.add("(max-width: 767px)", function () {
    elements.forEach(function (section) {
      section.style.overflowX = "auto";
      section.style.webkitOverflowScrolling = "touch";
      if (section.firstElementChild) {
        section.firstElementChild.style.display = "flex";
      }
    });
  });
});
