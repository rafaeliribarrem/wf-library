WF.registerEffect("marquee", function (elements) {
  elements.forEach(function (el) {
    var track = el.firstElementChild;
    if (!track) return;

    var speed = parseFloat(el.dataset.marqueeSpeed) || 40;
    var direction = el.dataset.marqueeDirection || "left";
    var pauseOnHover = el.dataset.marqueePauseHover !== "false";
    var isTouch = !window.matchMedia("(hover: hover)").matches;

    // Duplicate children for seamless loop
    var children = Array.from(track.children);
    children.forEach(function (child) {
      track.appendChild(child.cloneNode(true));
    });

    // Measure half width (one set of original items)
    var halfWidth = track.scrollWidth / 2;
    var dur = halfWidth / speed;

    // For left direction: animate from 0 to -halfWidth
    // For right direction: start at -halfWidth, animate to 0
    // Use gsap.utils.wrap to create seamless loop
    var wrapFn = gsap.utils.wrap(-halfWidth, 0);

    if (direction === "right") {
      gsap.set(track, { x: -halfWidth });
    }

    var tween = gsap.to(track, {
      x: direction === "left" ? "-=" + halfWidth : "+=" + halfWidth,
      duration: dur,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: function (x) {
          return wrapFn(parseFloat(x)) + "px";
        }
      }
    });

    if (pauseOnHover && !isTouch) {
      el.addEventListener("mouseenter", function () {
        gsap.to(tween, { timeScale: 0, duration: 0.4 });
      });
      el.addEventListener("mouseleave", function () {
        gsap.to(tween, { timeScale: 1, duration: 0.4 });
      });
    }

    WF.onCleanup(function () {
      tween.kill();
    });
  });
});
