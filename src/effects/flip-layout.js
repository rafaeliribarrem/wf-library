WF.registerEffect("flip-container", function (elements) {
  if (typeof Flip === "undefined") {
    console.warn("[wf-library] flip-layout requires Flip plugin");
    return;
  }

  elements.forEach(function (container) {
    var duration = parseFloat(container.dataset.flipDuration) || 0.6;
    var stagger = parseFloat(container.dataset.flipStagger) || 0.04;
    var items = container.querySelectorAll("[data-flip-id]");
    var buttons = document.querySelectorAll("[data-filter]");

    var clickHandlers = [];

    buttons.forEach(function (btn) {
      function onClick() {
        var filter = btn.dataset.filter;

        buttons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");

        var state = Flip.getState(items);

        items.forEach(function (item) {
          var match = filter === "all" || item.dataset.category === filter;
          item.style.display = match ? "" : "none";
        });

        Flip.from(state, {
          duration: duration,
          ease: "power2.inOut",
          stagger: stagger,
          absolute: true,
          onEnter: function (els) {
            gsap.fromTo(els,
              { autoAlpha: 0, scale: 0.9 },
              { autoAlpha: 1, scale: 1, duration: duration }
            );
          },
          onLeave: function (els) {
            gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: duration });
          },
        });
      }

      btn.addEventListener("click", onClick);
      clickHandlers.push({ el: btn, handler: onClick });
    });

    WF.onCleanup(function () {
      clickHandlers.forEach(function (h) {
        h.el.removeEventListener("click", h.handler);
      });
    });
  });
});
