# Aqua Glass Effect System

## Overview

The Aqua glass effect is the signature glossy appearance from Mac OS X that gives UI elements a 3D, reflective quality. It consists of two layers:

1. **Top Shine** (`::before`) — a white gradient that fades from top to bottom, simulating light reflecting off a curved surface
2. **Bottom Glow** (`::after`) — a white gradient that fades from bottom to top, simulating ambient light reflection

```
┌─────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← Top shine (bright)
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   (fades down)
│                                 │
│         Component Body          │
│                                 │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ ← Bottom glow (subtle)
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   (fades up)
└─────────────────────────────────┘
```

---

## Consolidation (Implemented)

### What changed

- **3 base presets**: `round`, `box`, `bar`
- **1 mixin**: `@include aqua-glass(...)` (with optional modifiers + overrides)
- **Legacy compatibility**: `aqua-glass-effect`, `aqua-glass-shine`, `aqua-glass-glow` still work and accept old preset names via aliases
- **Single source of truth**: presets + aliases live in `src/_mixins.scss`

### Core presets

These are the default values used by `@include aqua-glass(...)`:

#### 1) `round`

- Shine: `40%` height, `75%` width, `8%` top, `0.5px` blur, `0.8 → 0.15` alpha, radius `50% 50% 30% 30%`, z-index `2`
- Glow: `35%` height, `70%` width, `10%` bottom, `1px` blur, `0.1 → 0.35` alpha, radius `30% 30% 50% 50%`, no z-index

#### 2) `box`

- Shine: `33%` height, `90%` width, `5%` top, `1px` blur, `0.9 → 0.3` alpha, radius `inherit`, z-index `1`
- Glow: `33%` height, `90%` width, `10%` bottom, `3px` blur, `0.2 → 0.5` alpha, radius `inherit`, z-index `1`

#### 3) `bar`

- Shine: `50%` height, `100%` width, `0` top, no blur, `0.4 → 0.05` alpha, radius `0`, z-index `1`
- Glow: `30%` height, `100%` width, `0` bottom, no blur, `0 → 0.2` alpha, radius `0`, z-index `1`

### Modifier aliases

`subtle` is an alias to a lighter, shine-only look:

- `subtle` → `box` + `parts: shine`, `glow: false`, `intensity: 0.85`

`pill` is `box` with overrides for capsule-shaped controls (used by buttons, tabs,
segmented controls and the select wrapper):

- Shine: width `calc(100% - 0.875em)`, radius `2em 2em 0.5em 0.5em`, z-index `2`
- Glow: width `calc(100% - 1.25em)`, radius `0.75em`, no z-index

---

## API

### Primary mixin

```scss
@include aqua-glass(
  $preset,      // 'round' | 'box' | 'bar' (plus legacy aliases)
  $parts: null, // 'both' | 'shine' | 'glow' (null = use alias/default)
  $intensity: null, // number multiplier for alpha (null = use alias/default)
  $glow: null,  // true/false (null = use alias/default)
  $overrides: () // nested map merged into preset config
);
```

### Examples

```scss
.radio .circle { @include aqua-glass('round'); }
.toast-action { @include aqua-glass('subtle', $intensity: 1.25); }
.header { @include aqua-glass('bar'); }
```

### Overrides (when a component needs a tweak)

Overrides are nested maps under `shine:` and/or `glow:`. Common overrides:

- `height`, `width`, `top`, `bottom`
- `blur`
- `opacity-start`, `opacity-end`
- `radius`
- `z-index`

Example (segmented control: one wide gloss drawn above the buttons it contains):

```scss
.segmented-control {
  @include aqua-glass('pill', $overrides: (
    shine: (width: calc(100% - 0.25em), height: 45%, radius: 4px 4px 2px 2px, z-index: 10),
    glow: (width: calc(100% - 0.5em), radius: 3px, z-index: 10)
  ));
}
```

---

## Legacy compatibility

The following wrappers remain available:

- `@include aqua-glass-effect(...)` → `aqua-glass(...)`
- `@include aqua-glass-shine(...)` → `aqua-glass(..., $parts: 'shine')`
- `@include aqua-glass-glow(...)` → `aqua-glass(..., $parts: 'glow')`

Legacy preset names are supported via aliases (see `src/_mixins.scss`):

| Old name | Now |
|---------|-----|
| `circle`, `control-round`, `slider-thumb`, `switch`, `spinner` | `round` |
| `bubble`, `tab`, `control`, `stepper`, `select` | `box` |
| `pill` | `box` + capsule overrides (see above; still actively used) |
| `header`, `progress` | `bar` |
| `toast` | `box`, shine-only, intensity `1.25` |
| `menubar` | `bar`, shine-only, intensity `0.85`, shine alpha `0.3 → 0.1` |

---

## Current usage in the codebase

Every `@include aqua-glass(...)` in `src/` (the legacy wrappers are not used):

| Component | File | Selector | Usage |
|-----------|------|----------|-------|
| Traffic lights | `src/_traffic-lights.scss` | `.aqua-light` | `round` |
| Window title-bar controls | `src/_window.scss` | `.title-bar-controls button` | `round` |
| Buttons | `src/_buttons.scss` | `.aqua-button` | `pill` |
| Help button | `src/_buttons.scss` | `.aqua-button.help` | `round` |
| Pill group | `src/_buttons.scss` | `.pill-group` | `pill` + wide-gloss overrides (z-index 10) |
| Segmented control | `src/_segmented.scss` | `.segmented-control` | `pill` + wide-gloss overrides (z-index 10) |
| Tabs | `src/_tabs.scss` | `.tabs-pill`, `.aqua-tabs-container .aqua-tabs`; in 10.3+ eras also `.doc-tabbed-example .aqua-tab-bar` and `.aqua-adaptive-tabs .aqua-tab-bar` | `pill` + wide-gloss overrides (z-index 10) |
| Select wrapper | `src/_forms.scss` | `.select-wrapper` | `pill` + wide-gloss overrides (z-index 20) |
| Select (native) | `src/_forms.scss` | `select` | `box` |
| Checkbox (class) | `src/_checkbox.scss` | `.checkbox .box`, `.aqua-checkbox .box` | `box` |
| Checkbox (native) | `src/_checkbox.scss` | `input[type="checkbox"]` | `box` (shine-only) |
| Radio (class) | `src/_radio.scss` | `.radio .circle`, `.aqua-radio .circle` | `round` |
| Radio (native) | `src/_radio.scss` | `input[type="radio"]` | `round` (shine-only) |
| Switch thumb | `src/_switch.scss` | `.aqua-switch-thumb` | `round` |
| Spinner | `src/_spinner.scss` | `.spinner-container` | `round` |
| Stepper buttons | `src/_stepper.scss` | `.aqua-stepper button`, `.stepper button` | `box` |
| Spinner (stepper) buttons | `src/_stepper.scss` | `.aqua-spinner-buttons` | `box` |
| Pagination | `src/_pagination.scss` | `.aqua-pagination-btn`, `.aqua-pagination-arrow` | `round` |
| Chat bubble | `src/_chat-bubble.scss` | `.aqua-chat-bubble` | `box` |
| Toast action | `src/_toast.scss` | `.aqua-toast-action` | `subtle` + `$intensity: 1.25` |
| Titled pane header | `src/_titled-pane.scss` | `.titled-pane-header`, `.aqua-titled-pane-header` | `bar` |
| Table header | `src/_mixins.scss` (`aqua-table-base`, used by `src/_table.scss`) | `th` in `.table-view`, `table.aqua`, `table.aqua-table` | `bar` (tree tables pass `$header-glass: false`) |

Not using the mixin:

- **Progress bars** (`src/_progress.scss`) draw their own highlights.
- **Custom slider thumb** (`.aqua-slider-custom .thumb .shimmer` in `src/_slider.scss`) is
  hand-written CSS that copies the `round` preset values; native range thumbs use the
  `--slider-thumb-gloss` gradient instead.
- **Custom scrollbar markup** (`.scrollbar` caps and button groups) uses its own
  `.aqua-glass-h` / `.aqua-glass-v` utility classes from `src/_scrollbar.scss`.

### Known limitations

- Scrollbar thumbs and native slider thumbs use vendor pseudo-elements (e.g. `::-webkit-scrollbar-thumb`, `::-webkit-slider-thumb`) which **cannot** reliably host `::before/::after`. Those elements keep custom styling outside of this system.
