# wf-library

Shared animation library for Webflow projects. CSS-first entrance animations + GSAP-powered effects, driven entirely by `data-attributes`.

**One script. Zero boilerplate. Just add attributes in Webflow.**

## Quick Start

### 1. Add to Webflow Site Settings

**Head:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR_USER/wf-library@1.0.0/dist/wf-library.min.css">
<script src="https://unpkg.com/lenis@1/dist/lenis.min.js"></script>
```

**Footer:**
```html
<script src="https://cdn.jsdelivr.net/gh/YOUR_USER/wf-library@1.0.0/dist/wf-library.min.js"></script>
```

### 2. Add attributes in Webflow Designer

```html
<div data-animate="fade-in">I fade in on scroll</div>
<div data-animate="fade-in" data-animate-blur="8px">I fade in with blur</div>
<div data-animate-stagger="0.1">
  <div>Child 1</div>
  <div>Child 2</div>
</div>
```

That's it. No JavaScript to write.

---

## CSS-First Animations

These use CSS transitions — JS only toggles a class on scroll enter. Lightweight and performant.

### Fade In

| Attribute | Effect |
|-----------|--------|
| `data-animate="fade-in"` | Fade up (default: 16px) |
| `data-animate="fade-in-left"` | Fade from left (20px) |
| `data-animate="fade-in-right"` | Fade from right (20px) |
| `data-animate="fade-in-down"` | Fade down (16px) |
| `data-animate="fade-in-scale"` | Fade + scale from 0.95 |

**Options (all optional):**

| Attribute | Default | Example |
|-----------|---------|---------|
| `data-animate-duration` | `0.6s` | `data-animate-duration="1s"` |
| `data-animate-delay` | `0s` | `data-animate-delay="0.2s"` |
| `data-animate-y` | `16px` | `data-animate-y="60px"` |
| `data-animate-x` | `20px` | `data-animate-x="40px"` |
| `data-animate-blur` | `0px` | `data-animate-blur="8px"` |
| `data-animate-scale` | `0.95` | `data-animate-scale="0.8"` |

### Reveal (clip-path)

| Attribute | Effect |
|-----------|--------|
| `data-animate="reveal-up"` | Reveal from bottom |
| `data-animate="reveal-down"` | Reveal from top |
| `data-animate="reveal-left"` | Reveal from right |
| `data-animate="reveal-right"` | Reveal from left |

### Stagger Children

```html
<div data-animate-stagger="0.1">
  <div>Animates first</div>
  <div>Then this</div>
  <div>Then this</div>
</div>
```

Options: `data-animate-duration`, `data-animate-y`, `data-animate-blur`

---

## GSAP Effects

These require GSAP (loaded natively by Webflow).

### Parallax

```html
<img data-animate="parallax" data-parallax-speed="0.3" src="image.jpg">
```

| Option | Default | Values |
|--------|---------|--------|
| `data-parallax-speed` | `0.2` | 0.1 (subtle) → 1 (strong) |
| `data-parallax-direction` | `up` | up, down, left, right |

### Text Split (requires SplitText)

```html
<h1 data-animate="text-split" data-text-type="words">Headline</h1>
```

| Option | Default | Values |
|--------|---------|--------|
| `data-text-type` | `words` | chars, words, lines |
| `data-text-stagger` | `0.04` | seconds |
| `data-text-y` | `16` | pixels |
| `data-text-blur` | `0` | pixels |
| `data-text-mask` | `false` | true/false |

### Count Up

```html
<span data-animate="count-up" data-count-suffix="+">500</span>
```

| Option | Default |
|--------|---------|
| `data-count-from` | `0` |
| `data-count-duration` | `2` |
| `data-count-prefix` | `""` |
| `data-count-suffix` | `""` |
| `data-count-decimals` | `0` |
| `data-count-separator` | `,` |

### Marquee

```html
<div data-animate="marquee" data-marquee-speed="50">
  <div class="track">
    <span>Item 1</span>
    <span>Item 2</span>
  </div>
</div>
```

| Option | Default |
|--------|---------|
| `data-marquee-speed` | `40` (px/s) |
| `data-marquee-direction` | `left` |
| `data-marquee-pause-hover` | `true` |

### Magnetic Hover

```html
<a data-animate="magnetic" data-magnetic-strength="0.3">Button</a>
```

Desktop only. Disabled on touch devices.

### Custom Cursor

```html
<div data-animate="cursor" data-cursor-size="20"></div>
```

Add `data-cursor="hover"` to elements that should expand the cursor.
Add `data-cursor="hide"` to hide cursor over inputs/iframes.

### Navbar (hide/show)

```html
<nav data-animate="navbar-scroll">...</nav>
```

| Option | Default |
|--------|---------|
| `data-navbar-threshold` | `50` (px) |
| `data-navbar-duration` | `0.3` (s) |

### Horizontal Scroll

```html
<section data-animate="horizontal-scroll">
  <div class="wrapper" style="display:flex; width:fit-content;">
    <div class="panel" style="width:100vw;">Panel 1</div>
    <div class="panel" style="width:100vw;">Panel 2</div>
  </div>
</section>
```

Degrades to native horizontal scroll on mobile.

### Pin Section

```html
<section data-animate="pin" data-pin-duration="500">
  Pinned for 500px of scroll
</section>
```

### Flip Layout (requires Flip)

```html
<button data-filter="all">All</button>
<button data-filter="web">Web</button>
<div data-animate="flip-container">
  <div data-flip-id="p1" data-category="web">...</div>
</div>
```

---

## Accessibility

- **prefers-reduced-motion**: CSS animations show content instantly. GSAP effects are skipped entirely.
- **autoAlpha**: GSAP effects use `autoAlpha` (sets `visibility: hidden` at 0) to prevent invisible elements from blocking clicks.
- **Screen readers**: Text split uses SplitText's `aria: "auto"` mode.

## Global API

```js
WF.cleanup()   // Kill all animations + Lenis (for page transitions)
WF.refresh()   // Recalculate ScrollTrigger positions
WF.lenis       // Lenis instance
WF.eases       // Named eases: smooth, snappy, bounce, elastic, expo
```

## Development

```bash
npm install
npm run dev        # Watch mode
npm run build      # Production build
npm run preview    # Serve locally at :3000
```

## Versioning

```bash
npm run version:patch   # Bug fix: 1.0.0 → 1.0.1
npm run version:minor   # New feature: 1.0.0 → 1.1.0
npm run version:major   # Breaking change: 1.0.0 → 2.0.0
```

Tagged versions are permanently cached on jsDelivr.

### Development URLs

```
# Latest (may take up to 24h to update)
https://cdn.jsdelivr.net/gh/USER/wf-library@main/dist/wf-library.min.js

# Purge cache (instant update)
https://purge.jsdelivr.net/gh/USER/wf-library@main/dist/wf-library.min.js
```

## Architecture

```
src/
├── core/           # Boot sequence + effect registry
├── animations/     # CSS-first (JS toggles .is-active class)
├── effects/        # GSAP-driven (scrub, interpolation, physics)
├── utils/          # Lenis setup, GSAP defaults, smooth scroll
└── css/            # CSS transition engine + utility classes
```

**CSS-first** (`animations/`): CSS handles the visual transition. JS only adds `.is-active` via ScrollTrigger.batch().

**GSAP-driven** (`effects/`): GSAP handles the animation per-frame (scrub, number interpolation, quickTo).

## New Project

Use the scaffold script to create a new project repo:

```bash
./new-wf-project.sh lyvecom "Lyvecom"
```

This creates `wf-lyvecom/` with the template, installs deps, inits git, and prints the Webflow snippets to paste.
