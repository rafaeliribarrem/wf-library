# Scroll Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three scroll-driven animation effects (zoom-pin, scale-reveal, cards-stack) to wf-library.

**Architecture:** Each effect is a standalone JS file in `src/effects/` registered via `WF.registerEffect()`. All use GSAP ScrollTrigger with pin/scrub for scroll-linked animation, gsap.matchMedia() for responsive and reduced-motion handling, and WF.onCleanup() for teardown. Preview demos are added to `preview.html`.

**Tech Stack:** GSAP 3 + ScrollTrigger, vanilla JS (ES5-compatible IIFEs), esbuild bundler

**Spec:** `docs/superpowers/specs/2026-03-22-new-scroll-animations-design.md`

---

### Task 1: Implement zoom-pin effect

**Files:**
- Create: `src/effects/zoom-pin.js`

- [ ] **Step 1: Create zoom-pin.js**

```javascript
/**
 * Zoom Pin — Scroll-driven zoom with pinned section.
 * Child element scales up from reduced size to fill viewport.
 */
WF.registerEffect("zoom-pin", function (elements) {
  var tweens = [];
  var mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 768px)",
    isMobile: "(max-width: 767px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  }, function (context) {
    var c = context.conditions;

    if (c.reduceMotion) {
      elements.forEach(function (el) {
        var child = el.children[0];
        if (!child) return;
        gsap.set(child, { scale: 1, borderRadius: "0px" });
      });
      return;
    }

    elements.forEach(function (el) {
      var child = el.children[0];
      if (!child) return;

      if (c.isDesktop) {
        var scale = parseFloat(el.dataset.animateScale) || 0.6;
        var radius = parseFloat(el.dataset.animateRadius) || 24;
        var distance = parseFloat(el.dataset.animateDistance) || 600;

        el.style.overflow = "hidden";

        tweens.push(gsap.fromTo(child,
          { scale: scale, borderRadius: radius + "px" },
          {
            scale: 1,
            borderRadius: "0px",
            ease: "none",
            transformOrigin: "center center",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=" + distance,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        ));
      }

      if (c.isMobile) {
        tweens.push(gsap.fromTo(child,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        ));
      }
    });
  });

  WF.onCleanup(function () {
    tweens.forEach(function (t) { t.kill(); });
    elements.forEach(function (el) { el.style.overflow = ""; });
  });
});
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: `JS: dist/effects/zoom-pin.min.js` appears in output, no errors

- [ ] **Step 3: Commit**

```bash
git add src/effects/zoom-pin.js
git commit -m "feat: add zoom-pin scroll effect"
```

---

### Task 2: Implement scale-reveal effect

**Files:**
- Create: `src/effects/scale-reveal.js`

- [ ] **Step 1: Create scale-reveal.js**

```javascript
/**
 * Scale Reveal — Section scales from reduced size to full viewport.
 * Apple-style reveal with border-radius transition.
 */
WF.registerEffect("scale-reveal", function (elements) {
  var tweens = [];
  var mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 768px)",
    isMobile: "(max-width: 767px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  }, function (context) {
    var c = context.conditions;

    if (c.reduceMotion || c.isMobile) {
      elements.forEach(function (el) {
        gsap.set(el, { scale: 1, borderRadius: "0px" });
      });
      return;
    }

    elements.forEach(function (el) {
      var scale = parseFloat(el.dataset.animateScale) || 0.85;
      var radius = parseFloat(el.dataset.animateRadius) || 24;
      var distance = parseFloat(el.dataset.animateDistance) || 400;

      tweens.push(gsap.fromTo(el,
        { scale: scale, borderRadius: radius + "px" },
        {
          scale: 1,
          borderRadius: "0px",
          ease: "none",
          transformOrigin: "center center",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=" + distance,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      ));
    });
  });

  WF.onCleanup(function () {
    tweens.forEach(function (t) { t.kill(); });
  });
});
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: `JS: dist/effects/scale-reveal.min.js` appears in output, no errors

- [ ] **Step 3: Commit**

```bash
git add src/effects/scale-reveal.js
git commit -m "feat: add scale-reveal scroll effect"
```

---

### Task 3: Implement cards-stack effect

**Files:**
- Create: `src/effects/cards-stack.js`

- [ ] **Step 1: Create cards-stack.js**

```javascript
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
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: `JS: dist/effects/cards-stack.min.js` appears in output, no errors

- [ ] **Step 3: Commit**

```bash
git add src/effects/cards-stack.js
git commit -m "feat: add cards-stack scroll effect"
```

---

### Task 4: Register new effects in init.js

**Files:**
- Modify: `src/core/init.js` — add 3 require() calls after the existing effects

- [ ] **Step 1: Add require() lines after `require("../effects/flip-layout.js");` and BEFORE `require("../utils/smooth-scroll.js");`**

Add these three lines between flip-layout and smooth-scroll (keeping effects grouped, utils at the end):

```javascript
  require("../effects/zoom-pin.js");
  require("../effects/scale-reveal.js");
  require("../effects/cards-stack.js");
```

- [ ] **Step 2: Verify build produces updated bundle**

Run: `npm run build`
Expected: `JS: dist/wf-library.min.js (bundle)` with no errors. Bundle size should increase.

- [ ] **Step 3: Commit**

```bash
git add src/core/init.js
git commit -m "feat: register zoom-pin, scale-reveal, cards-stack in init"
```

---

### Task 5: Add zoom-pin demo to preview.html

**Files:**
- Modify: `preview.html` — add demo section after the pin-section instructions (after the closing `</section>` of pin instructions, before the marquee section comment)

- [ ] **Step 1: Add CSS for zoom-pin demo**

Add inside the existing `<style>` block (before the closing `</style>` tag):

```css
    /* ── Zoom Pin ──────────────────────────────────── */
    .zoom-pin-section {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .zoom-pin-section img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
```

- [ ] **Step 2: Add HTML section**

Insert after the pin-section instructions `</section>` and before the `<!-- 10. MARQUEE -->` comment:

```html
  <!-- ═══════════════════════════════════════════════════
       ZOOM PIN
       ═══════════════════════════════════════════════════ -->
  <section class="section" id="zoom-pin">
    <div class="container">
      <div class="section-label">GSAP Effect</div>
      <h2 class="section-title">Zoom Pin</h2>
      <p class="section-subtitle">Image starts at reduced scale and zooms to fill the viewport while the section is pinned. Scroll-driven with smooth scrub.</p>
      <code>data-animate="zoom-pin"</code>
    </div>
  </section>

  <section class="zoom-pin-section" data-animate="zoom-pin" data-animate-distance="600">
    <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%); display: flex; align-items: center; justify-content: center; border-radius: 24px;">
      <div style="text-align: center; color: white;">
        <h2 style="font-family: var(--font-display); font-size: clamp(36px, 6vw, 72px); margin-bottom: 16px;">Zoom Pin</h2>
        <p style="font-size: 18px; color: rgba(255,255,255,0.6);">This content scales from 60% to fullscreen as you scroll</p>
      </div>
    </div>
  </section>

  <section class="section" style="padding: 80px 0;">
    <div class="container">
      <div class="wf-instructions">
        <div class="wf-instructions-header">
          <span class="wf-instructions-badge">Webflow</span>
          <span class="wf-instructions-title">How to use Zoom Pin</span>
        </div>
        <div class="wf-instructions-grid">
          <div class="wf-instructions-steps">
            <div class="wf-step"><span class="wf-step-num">1</span><span class="wf-step-text">Create a <strong>Section</strong> with <code>data-animate="zoom-pin"</code></span></div>
            <div class="wf-step"><span class="wf-step-num">2</span><span class="wf-step-text">Inside: one child element (image, div, or video) that will zoom</span></div>
            <div class="wf-step"><span class="wf-step-num">3</span><span class="wf-step-text">Set scroll distance with <code>data-animate-distance</code></span></div>
          </div>
          <div class="wf-dom-tree">
            <span class="tag">&lt;section</span> <span class="attr">data-animate</span>=<span class="val">"zoom-pin"</span>
            <span class="indent"><span class="attr">data-animate-distance</span>=<span class="val">"600"</span><span class="tag">&gt;</span></span>
            <span class="indent"><span class="tag">&lt;img</span> <span class="attr">src</span>=<span class="val">"hero.jpg"</span> <span class="tag">/&gt;</span></span>
            <span class="tag">&lt;/section&gt;</span>
          </div>
        </div>
        <div class="wf-tip"><strong>Tip:</strong> Use <code>data-animate-scale="0.4"</code> for a more dramatic zoom or <code>data-animate-radius="40"</code> for rounder corners at start.</div>
      </div>
    </div>
  </section>
```

- [ ] **Step 3: Build and verify in browser**

Run: `npm run build`
Open preview.html in browser, scroll to zoom-pin section, verify the pinned zoom works.

- [ ] **Step 4: Commit**

```bash
git add preview.html
git commit -m "feat: add zoom-pin demo section to preview"
```

---

### Task 6: Add scale-reveal demo to preview.html

**Files:**
- Modify: `preview.html` — add demo section after zoom-pin instructions

- [ ] **Step 1: Add CSS for scale-reveal demo**

Add inside the `<style>` block:

```css
    /* ── Scale Reveal ─────────────────────────────── */
    .scale-reveal-section {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0c4a6e 0%, #164e63 30%, #134e4a 60%, #14532d 100%);
    }
```

- [ ] **Step 2: Add HTML section after zoom-pin instructions**

```html
  <!-- ═══════════════════════════════════════════════════
       SCALE REVEAL
       ═══════════════════════════════════════════════════ -->
  <section class="section" id="scale-reveal">
    <div class="container">
      <div class="section-label">GSAP Effect</div>
      <h2 class="section-title">Scale Reveal</h2>
      <p class="section-subtitle">The entire section scales from reduced size with rounded corners to fill the viewport. Apple-style reveal driven by scroll.</p>
      <code>data-animate="scale-reveal"</code>
    </div>
  </section>

  <section class="scale-reveal-section" data-animate="scale-reveal" data-animate-distance="500">
    <div style="text-align: center; color: white;">
      <h2 style="font-family: var(--font-display); font-size: clamp(36px, 6vw, 72px); margin-bottom: 16px;">Scale Reveal</h2>
      <p style="font-size: 18px; color: rgba(255,255,255,0.6); max-width: 500px; margin: 0 auto;">This section starts at 85% scale with rounded corners and expands to full viewport</p>
    </div>
  </section>

  <section class="section" style="padding: 80px 0;">
    <div class="container">
      <div class="wf-instructions">
        <div class="wf-instructions-header">
          <span class="wf-instructions-badge">Webflow</span>
          <span class="wf-instructions-title">How to use Scale Reveal</span>
        </div>
        <div class="wf-instructions-grid">
          <div class="wf-instructions-steps">
            <div class="wf-step"><span class="wf-step-num">1</span><span class="wf-step-text">Create a <strong>Section</strong> with <code>data-animate="scale-reveal"</code></span></div>
            <div class="wf-step"><span class="wf-step-num">2</span><span class="wf-step-text">Add any content inside — the entire section scales</span></div>
            <div class="wf-step"><span class="wf-step-num">3</span><span class="wf-step-text">Optional: adjust <code>data-animate-scale</code> and <code>data-animate-radius</code></span></div>
          </div>
          <div class="wf-dom-tree">
            <span class="tag">&lt;section</span> <span class="attr">data-animate</span>=<span class="val">"scale-reveal"</span>
            <span class="indent"><span class="attr">data-animate-distance</span>=<span class="val">"400"</span><span class="tag">&gt;</span></span>
            <span class="indent"><span class="comment">&lt;!-- Any content: text, image, video --&gt;</span></span>
            <span class="tag">&lt;/section&gt;</span>
          </div>
        </div>
        <div class="wf-tip"><strong>Tip:</strong> Works great for hero sections and immersive full-screen content reveals.</div>
      </div>
    </div>
  </section>
```

- [ ] **Step 3: Build and verify in browser**

Run: `npm run build`
Open preview.html, scroll to scale-reveal section, verify the pinned scale works.

- [ ] **Step 4: Commit**

```bash
git add preview.html
git commit -m "feat: add scale-reveal demo section to preview"
```

---

### Task 7: Add cards-stack demo to preview.html

**Files:**
- Modify: `preview.html` — add demo section after scale-reveal instructions

- [ ] **Step 1: Add CSS for cards-stack demo**

Add inside the `<style>` block:

```css
    /* ── Cards Stack ──────────────────────────────── */
    .stack-card {
      height: 400px;
      border-radius: 16px;
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      color: white;
      max-width: 900px;
      margin: 0 auto;
    }
    .stack-card h3 {
      font-family: var(--font-display);
      font-size: 32px;
      margin-bottom: 8px;
    }
    .stack-card p {
      font-size: 16px;
      opacity: 0.8;
      max-width: 400px;
    }
    .stack-card-1 { background: linear-gradient(135deg, #1e1b4b, #312e81); }
    .stack-card-2 { background: linear-gradient(135deg, #312e81, #4c1d95); }
    .stack-card-3 { background: linear-gradient(135deg, #4c1d95, #6d28d9); }
    .stack-card-4 { background: linear-gradient(135deg, #6d28d9, #7c3aed); }
```

- [ ] **Step 2: Add HTML section after scale-reveal instructions**

```html
  <!-- ═══════════════════════════════════════════════════
       CARDS STACK
       ═══════════════════════════════════════════════════ -->
  <section class="section" id="cards-stack">
    <div class="container">
      <div class="section-label">GSAP Effect</div>
      <h2 class="section-title">Cards Stack</h2>
      <p class="section-subtitle">Cards stack on top of each other as you scroll. Previous cards scale down and darken, creating depth.</p>
      <code>data-animate="cards-stack"</code>
    </div>
  </section>

  <section class="section" style="padding: 0;">
    <div class="container">
      <div data-animate="cards-stack" data-animate-offset="40">
        <div class="stack-card stack-card-1">
          <h3>Design Systems</h3>
          <p>Build consistent, scalable interfaces with reusable components and tokens.</p>
        </div>
        <div class="stack-card stack-card-2">
          <h3>Motion Design</h3>
          <p>Bring interfaces to life with purposeful animation and micro-interactions.</p>
        </div>
        <div class="stack-card stack-card-3">
          <h3>Scroll Storytelling</h3>
          <p>Guide users through narrative experiences driven by scroll position.</p>
        </div>
        <div class="stack-card stack-card-4">
          <h3>Webflow Development</h3>
          <p>Turn designs into production-ready Webflow sites with custom code.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="padding: 80px 0;">
    <div class="container">
      <div class="wf-instructions">
        <div class="wf-instructions-header">
          <span class="wf-instructions-badge">Webflow</span>
          <span class="wf-instructions-title">How to use Cards Stack</span>
        </div>
        <div class="wf-instructions-grid">
          <div class="wf-instructions-steps">
            <div class="wf-step"><span class="wf-step-num">1</span><span class="wf-step-text">Create a <strong>parent container</strong> with <code>data-animate="cards-stack"</code></span></div>
            <div class="wf-step"><span class="wf-step-num">2</span><span class="wf-step-text">Add child cards with <strong>explicit height</strong> set via class</span></div>
            <div class="wf-step"><span class="wf-step-num">3</span><span class="wf-step-text">Optional: adjust <code>data-animate-offset</code> for spacing between stacked cards</span></div>
          </div>
          <div class="wf-dom-tree">
            <span class="tag">&lt;div</span> <span class="attr">data-animate</span>=<span class="val">"cards-stack"</span>
            <span class="indent"><span class="attr">data-animate-offset</span>=<span class="val">"40"</span><span class="tag">&gt;</span></span>
            <span class="indent"><span class="tag">&lt;div</span> <span class="comment">class="card"</span><span class="tag">&gt;</span> Card 1 <span class="tag">&lt;/div&gt;</span></span>
            <span class="indent"><span class="tag">&lt;div</span> <span class="comment">class="card"</span><span class="tag">&gt;</span> Card 2 <span class="tag">&lt;/div&gt;</span></span>
            <span class="indent"><span class="tag">&lt;div</span> <span class="comment">class="card"</span><span class="tag">&gt;</span> Card 3 <span class="tag">&lt;/div&gt;</span></span>
            <span class="tag">&lt;/div&gt;</span>
          </div>
        </div>
        <div class="wf-tip"><strong>Tip:</strong> Cards need explicit height (not auto) for sticky positioning to work. Use <code>data-animate-scale="0.08"</code> for more dramatic depth.</div>
      </div>
    </div>
  </section>
```

- [ ] **Step 3: Build and verify in browser**

Run: `npm run build`
Open preview.html, scroll to cards-stack section, verify cards stack with scale-down.

- [ ] **Step 4: Commit**

```bash
git add preview.html
git commit -m "feat: add cards-stack demo section to preview"
```

---

### Task 8: Add navbar links for new sections

**Files:**
- Modify: `preview.html` — add navigation links to the navbar for the 3 new sections

- [ ] **Step 1: Add links to navbar**

In the `.navbar-links` `<ul>`, add before the closing `</ul>`:

```html
<li><a href="#zoom-pin">Zoom Pin</a></li>
<li><a href="#scale-reveal">Scale Reveal</a></li>
<li><a href="#cards-stack">Cards Stack</a></li>
```

- [ ] **Step 2: Build and verify navigation works**

Run: `npm run build`
Open preview.html, click new navbar links, verify they scroll to correct sections.

- [ ] **Step 3: Commit**

```bash
git add preview.html
git commit -m "feat: add navbar links for new animation sections"
```

---

### Task 9: Final integration test

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: All files build with no errors.

- [ ] **Step 2: Browser test**

Open `preview.html` in browser and verify:
- zoom-pin: section pins, content zooms from 0.6 to 1.0, border-radius transitions, releases
- scale-reveal: section pins, scales from 0.85 to 1.0, border-radius transitions, releases
- cards-stack: cards stack with sticky, previous cards scale down and darken, last card stays full
- All existing effects still work (fade, reveal, stagger, parallax, etc.)
- Navbar links scroll to correct sections

- [ ] **Step 3: Commit any fixes if needed**
