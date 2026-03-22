/**
 * Cards Stack — Sticky cards that stack with scale-down and darken.
 * Each card covers the previous one as user scrolls.
 */
WF.registerEffect("cards-stack", function (elements) {
  var tweens = [];
  var mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 768px)",
    isMobile: "(max-width: 767px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  }, function (context) {
    var c = context.conditions;

    if (c.reduceMotion) {
      elements.forEach(function (container) {
        Array.from(container.children).forEach(function (card) {
          gsap.set(card, { autoAlpha: 1 });
        });
      });
      return;
    }

    elements.forEach(function (container) {
      var cards = Array.from(container.children);
      if (cards.length < 2) return;

      if (c.isDesktop) {
        var offset = parseFloat(container.dataset.animateOffset) || 40;
        var scaleStep = parseFloat(container.dataset.animateScale) || 0.05;
        var baseTop = 80;

        // Measure card height (fallback to 400 if not rendered yet)
        var cardHeight = cards[0].offsetHeight || 400;
        // Include cumulative offset in total height for proper scroll distance
        var totalHeight = (cards.length * cardHeight) + window.innerHeight + (cards.length * offset);
        container.style.height = totalHeight + "px";
        container.style.position = "relative";

        cards.forEach(function (card, i) {
          var topVal = baseTop + (i * offset);

          gsap.set(card, {
            position: "sticky",
            top: topVal + "px",
            zIndex: i + 1,
            willChange: "transform",
          });

          // All cards except last get scale-down + darken animation
          if (i < cards.length - 1) {
            tweens.push(gsap.to(card, {
              scale: 1 - scaleStep,
              opacity: 0.7,
              ease: "none",
              scrollTrigger: {
                trigger: cards[i + 1],
                start: "top bottom",
                end: "top " + (baseTop + ((i + 1) * offset)) + "px",
                scrub: 1,
              },
            }));
          }
        });
      }

      if (c.isMobile) {
        cards.forEach(function (card) {
          tweens.push(gsap.fromTo(card,
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 90%" },
            }
          ));
        });
      }
    });
  });

  WF.onCleanup(function () {
    tweens.forEach(function (t) { t.kill(); });
    elements.forEach(function (container) {
      container.style.height = "";
      container.style.position = "";
      Array.from(container.children).forEach(function (card) {
        gsap.set(card, { clearProps: "position,top,zIndex,willChange,scale,opacity" });
      });
    });
  });
});
