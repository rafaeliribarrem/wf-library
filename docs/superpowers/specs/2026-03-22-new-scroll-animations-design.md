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
- ScrollTrigger config: `pin: true`, `scrub: true`, `start: "top top"`, `end: "+={distance}"`
- Section needs `overflow: hidden` applied by JS on init

### HTML structure

```html
<section data-animate="zoom-pin">
  <img src="hero.jpg" style="width:100%; height:100%; object-fit:cover" />
</section>
```

### Mobile (<768px)

Disable pin. Show content at scale 1 with a simple fade-in entrance.

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
- ScrollTrigger config: `pin: true`, `scrub: true`, `start: "top top"`, `end: "+={distance}"`
- `transformOrigin: "center center"`

### Difference from zoom-pin

- `zoom-pin`: inner content grows inside a fixed container (hero images with center focus)
- `scale-reveal`: the container itself grows (full sections with mixed content)

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
- Top value formula: `baseTop + (index * offset)` where baseTop is derived from navbar height or a sensible default (80px)
- Container height is set to allow all cards to scroll through: total height accommodates all cards stacking
- Per-card ScrollTrigger with `scrub: true`: when the next card approaches, the current card animates `scale: 1 → (1 - scaleStep)` and `filter: brightness(0.7)`
- Last card does not scale down — stays at scale 1
- Cards need explicit height (not auto) for sticky to work reliably

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
- Wrapped in `gsap.matchMedia()` for reduced-motion support
- `WF.onCleanup()` to kill tweens/ScrollTriggers
- CSS in `animations.css`: add `visibility: hidden` selectors for entrance-type fallbacks if needed
- New JS files in `src/effects/`: `zoom-pin.js`, `scale-reveal.js`, `cards-stack.js`
- Imported in `src/core/init.js`

## Preview demos

Each effect gets a section in `preview.html` with:
- Live demo with real visual content (Unsplash images or gradient backgrounds)
- Code snippet showing the attributes
- Webflow "How to use" instructions block
- Replay button (for entrance-based mobile fallbacks)

## File changes

### New files
- `src/effects/zoom-pin.js`
- `src/effects/scale-reveal.js`
- `src/effects/cards-stack.js`

### Modified files
- `src/core/init.js` — add require() for the 3 new effects
- `src/css/animations.css` — add visibility:hidden selectors if needed
- `preview.html` — add demo sections with replay support
