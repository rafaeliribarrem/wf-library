# New Scroll Animations Design

Three new scroll-driven animation effects for wf-library: zoom-pin, scale-reveal, and cards-stack.

## Context

wf-library is a data-attribute-driven animation library for Webflow. It provides entrance animations (fade, reveal, stagger, text-split, count-up) and scroll effects (parallax, horizontal-scroll, pin-section). These three new effects fill gaps in scroll-driven visual storytelling.

All effects follow the existing pattern: `WF.registerEffect(name, initFn)`, GSAP + ScrollTrigger, `data-animate` attributes, mobile fallback, reduced-motion support.

## Effect 1: zoom-pin

Image/content starts at reduced scale inside a pinned section. As the user scrolls, content scales up to fill the viewport.

### Attributes

| Attribute | Default | Description |
|---|---|---|
| `data-animate="zoom-pin"` | — | Activates the effect |
| `data-animate-scale` | `0.6` | Initial scale of inner content |
| `data-animate-radius` | `24` | Initial border-radius (px) |
| `data-animate-distance` | `600` | Scroll distance while pinned (px) |

### Behavior

- The section element is pinned via ScrollTrigger
- The first child element (image/div) is the zoom target
- `gsap.fromTo()` animates the child: `scale: 0.6 → 1`, `borderRadius: 24px → 0`
- `transformOrigin: "center center"` on the child
- ScrollTrigger config: `pin: true`, `scrub: 1` (smooth), `start: "top top"`, `end: "+={distance}"`, `invalidateOnRefresh: true`
- Section needs `overflow: hidden` applied by JS on init

### Reduced motion

Under `prefers-reduced-motion: reduce`: no pin, no animation. Content shown at scale 1 immediately via `gsap.set(child, { scale: 1, borderRadius: 0 })`.

### HTML structure

```html
<section data-animate="zoom-pin">
  <img src="hero.jpg" style="width:100%; height:100%; object-fit:cover" />
</section>
```

### Mobile (<768px)

Disable pin. Show content at scale 1 with a simple fade-in entrance.

### Why separate from scale-reveal

zoom-pin targets a **child element** inside the section — the section stays full-size and acts as a window. scale-reveal targets the **section itself** — the entire container grows. These are fundamentally different DOM relationships that affect how content inside is laid out, how padding/margins behave, and how designers think about the structure in Webflow. Merging them into one effect with a toggle would make the attribute API more confusing than having two clearly named effects.

## Effect 2: scale-reveal

The entire section scales from reduced size with rounded corners to full viewport. Apple-style reveal.

### Attributes

| Attribute | Default | Description |
|---|---|---|
| `data-animate="scale-reveal"` | — | Activates the effect |
| `data-animate-scale` | `0.85` | Initial scale |
| `data-animate-radius` | `24` | Initial border-radius (px) |
| `data-animate-distance` | `400` | Scroll distance while pinned (px) |

### Behavior

- The section itself is the animation target (unlike zoom-pin which targets a child)
- `gsap.fromTo()` on the section: `scale: 0.85 → 1`, `borderRadius: 24px → 0`
- `transformOrigin: "center center"`
- ScrollTrigger config: `pin: true`, `scrub: 1` (smooth), `start: "top top"`, `end: "+={distance}"`, `invalidateOnRefresh: true`

### Reduced motion

Under `prefers-reduced-motion: reduce`: no pin, no animation. Section shown at scale 1 immediately via `gsap.set(el, { scale: 1, borderRadius: 0 })`.

### HTML structure

```html
<section data-animate="scale-reveal">
  <!-- Any content: image, video, text, etc -->
</section>
```

### Mobile (<768px)

Disable pin. Show section at scale 1 immediately.

## Effect 3: cards-stack

Cards stack on top of each other as user scrolls. Previous cards scale down and darken, creating depth.

### Attributes

| Attribute | Default | Description |
|---|---|---|
| `data-animate="cards-stack"` | — | On the parent container |
| `data-animate-offset` | `40` | Vertical offset between sticky cards (px) |
| `data-animate-scale` | `0.05` | Scale reduction per card (0.05 = -5%) |

### Behavior

- Each child card gets `position: sticky` with incrementing `top` values
- Top value formula: `baseTop + (index * offset)` where baseTop = 80px (accounts for navbar)
- z-index: each card gets `z-index: index + 1` so later cards visually stack on top
- Container height calculation (set via JS): `containerHeight = (numCards × cardHeight) + viewportHeight`. This gives enough scroll distance for all cards to enter and stack. Cards are assumed to have equal height; if heights vary, use the tallest card's height.
- Per-card ScrollTrigger (except last card):
  - `trigger`: the next card (card at index + 1)
  - `start: "top bottom"`
  - `end: "top top+={baseTop + ((index+1) * offset)}"`
  - `scrub: 1`
  - Animates current card: `scale: 1 → (1 - scaleStep)`, `opacity: 1 → 0.7` (opacity instead of filter:brightness for GPU performance)
- Last card does not scale down — stays at scale 1
- Cards need explicit height (not auto) for sticky to work reliably
- `will-change: transform` applied to all cards for GPU compositing

### Reduced motion

Under `prefers-reduced-motion: reduce`: no sticky, no scale animation. Cards stack vertically with full opacity, visible immediately.

### HTML structure

```html
<div data-animate="cards-stack" data-animate-offset="40">
  <div class="card">Card 1 content</div>
  <div class="card">Card 2 content</div>
  <div class="card">Card 3 content</div>
  <div class="card">Card 4 content</div>
</div>
```

### Mobile (<768px)

Disable sticky. Cards stack vertically with fade-in entrance animation.

## Shared patterns

All three effects follow existing wf-library conventions:

- Registered via `WF.registerEffect(name, initFn)`
- Wrapped in `gsap.matchMedia()` with conditions object: `"(prefers-reduced-motion: no-preference)"` for animations, `"(prefers-reduced-motion: reduce)"` for fallbacks
- `WF.onCleanup()` to kill tweens/ScrollTriggers and restore any CSS properties modified by JS (e.g., `overflow: hidden` on zoom-pin)
- New JS files in `src/effects/`: `zoom-pin.js`, `scale-reveal.js`, `cards-stack.js`
- Imported in `src/core/init.js` via `require()`
- Lenis compatibility: ScrollTrigger with `pin: true` and Lenis work together natively since Lenis v1+ integrates with ScrollTrigger. No extra config needed.

## Preview demos

Each effect gets a section in `preview.html` with:
- Live demo (gradient backgrounds for zoom-pin and scale-reveal, styled cards for cards-stack)
- Code snippet showing the attributes
- Webflow "How to use" instructions block
- data-replay-section support for the fade section's replay system

## File changes

### New files
- `src/effects/zoom-pin.js`
- `src/effects/scale-reveal.js`
- `src/effects/cards-stack.js`

### Modified files
- `src/core/init.js` — add require() for the 3 new effects
- `preview.html` — add demo sections
