/**
 * WF Effect Registry
 * Manages effect registration, cleanup callbacks, and the global WF API.
 */
(function () {
  "use strict";

  var effects = {};
  var cleanupFns = [];

  window.WF = window.WF || {};

  window.WF.registerEffect = function (name, initFn) {
    effects[name] = initFn;
  };

  window.WF.onCleanup = function (fn) {
    cleanupFns.push(fn);
  };

  window.WF.cleanup = function () {
    cleanupFns.forEach(function (fn) {
      try { fn(); } catch (e) { console.warn("[wf-library] Cleanup error:", e); }
    });
    cleanupFns = [];

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    }

    if (window.WF.lenis) {
      window.WF.lenis.destroy();
      window.WF.lenis = null;
    }
  };

  window.WF.refresh = function () {
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  };

  window.WF._effects = effects;
})();
