WF.registerEffect("cursor", function (elements) {
  var cursor = elements[0];
  if (!cursor) return;
  if (!window.matchMedia("(hover: hover)").matches) {
    cursor.style.display = "none";
    return;
  }

  var lag = parseFloat(cursor.dataset.cursorLag) || 0.1;
  var size = cursor.dataset.cursorSize;
  if (size) {
    cursor.style.width = size + "px";
    cursor.style.height = size + "px";
  }

  gsap.set(cursor, { xPercent: -50, yPercent: -50 });

  var xTo = gsap.quickTo(cursor, "x", { duration: lag, ease: "power3.out" });
  var yTo = gsap.quickTo(cursor, "y", { duration: lag, ease: "power3.out" });

  function onMouseMove(e) {
    xTo(e.clientX);
    yTo(e.clientY);
  }

  window.addEventListener("mousemove", onMouseMove);

  var hoverHandlers = [];
  var hoverTargets = document.querySelectorAll("[data-cursor='hover']");
  hoverTargets.forEach(function (el) {
    function onEnter() { cursor.classList.add("is-hover"); }
    function onLeaveH() { cursor.classList.remove("is-hover"); }
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeaveH);
    hoverHandlers.push({ el: el, enter: onEnter, leave: onLeaveH });
  });

  var hideHandlers = [];
  var hideTargets = document.querySelectorAll("[data-cursor='hide']");
  hideTargets.forEach(function (el) {
    function onEnterHide() { gsap.to(cursor, { autoAlpha: 0, duration: 0.2 }); }
    function onLeaveHide() { gsap.to(cursor, { autoAlpha: 1, duration: 0.2 }); }
    el.addEventListener("mouseenter", onEnterHide);
    el.addEventListener("mouseleave", onLeaveHide);
    hideHandlers.push({ el: el, enter: onEnterHide, leave: onLeaveHide });
  });

  WF.onCleanup(function () {
    window.removeEventListener("mousemove", onMouseMove);
    hoverHandlers.forEach(function (h) {
      h.el.removeEventListener("mouseenter", h.enter);
      h.el.removeEventListener("mouseleave", h.leave);
    });
    hideHandlers.forEach(function (h) {
      h.el.removeEventListener("mouseenter", h.enter);
      h.el.removeEventListener("mouseleave", h.leave);
    });
  });
});
