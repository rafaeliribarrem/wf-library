/**
 * WF-Library Core Init
 *
 * Boot sequence:
 * 1. Check GSAP exists
 * 2. Register plugins once
 * 3. Load registry
 * 4. Set GSAP defaults
 * 5. Init Lenis
 * 6. Load all animation & effect modules (they register via WF.registerEffect)
 * 7. Init all registered effects (try/catch per effect)
 * 8. Init stagger (uses data-animate-stagger, not data-animate)
 * 9. Refresh ScrollTrigger after fonts
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined") {
    console.warn("[wf-library] GSAP not found. Make sure Webflow GSAP is enabled.");
    return;
  }

  var plugins = [];
  if (typeof ScrollTrigger !== "undefined") plugins.push(ScrollTrigger);
  if (typeof Flip !== "undefined") plugins.push(Flip);
  if (typeof SplitText !== "undefined") plugins.push(SplitText);
  if (plugins.length) gsap.registerPlugin.apply(gsap, plugins);

  require("./registry.js");
  require("../utils/gsap-defaults.js");
  require("../utils/lenis-setup.js");

  require("../animations/fade-in.js");
  require("../animations/stagger.js");
  require("../animations/reveal.js");
  require("../effects/parallax.js");
  require("../effects/text-split.js");
  require("../effects/count-up.js");
  require("../effects/marquee.js");
  require("../effects/magnetic.js");
  require("../effects/cursor.js");
  require("../effects/navbar.js");
  require("../effects/horizontal-scroll.js");
  require("../effects/pin-section.js");
  require("../effects/flip-layout.js");
  require("../effects/zoom-pin.js");
  require("../effects/scale-reveal.js");
  require("../effects/cards-stack.js");
  require("../utils/smooth-scroll.js");

  function initEffects() {
    var effects = window.WF._effects || {};
    Object.keys(effects).forEach(function (name) {
      var elements = document.querySelectorAll('[data-animate="' + name + '"]');
      if (!elements.length) return;
      try {
        effects[name](elements);
      } catch (e) {
        console.warn("[wf-library] Effect '" + name + "' failed:", e);
      }
    });
  }

  function initStagger() {
    var staggerInits = window.WF._cssAnimations || [];
    staggerInits.forEach(function (initFn) {
      try {
        initFn();
      } catch (e) {
        console.warn("[wf-library] Stagger init failed:", e);
      }
    });
  }

  function boot() {
    initEffects();
    initStagger();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
