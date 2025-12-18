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

- Shine: `40%` height, `75%` width, `8%` top, `0.5px` blur, `0.8 → 0.15` alpha, radius `50% 50% 30% 30%`
- Glow: `35%` height, `70%` width, `10%` bottom, `1px` blur, `0.1 → 0.35` alpha, radius `30% 30% 50% 50%`

#### 2) `box`

- Shine: `45%` height, `90%` width, `1px` top, no blur, `0.6 → 0.1` alpha, radius `2px 2px 1px 1px`
- Glow: `40%` height, `90%` width, `1px` bottom, no blur, `0.05 → 0.25` alpha, radius `1px 1px 2px 2px`

#### 3) `bar`

- Shine: `50%` height, `100%` width, `0` top, no blur, `0.4 → 0.05` alpha, radius `0`
- Glow: `30%` height, `100%` width, `0` bottom, no blur, `0 → 0.2` alpha, radius `0`

### Modifier aliases

`subtle` is an alias to a lighter, shine-only look:

- `subtle` → `box` + `parts: shine`, `glow: false`, `intensity: 0.85`

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

Example (spinner needs shine/glow above blades):

```scss
.spinner-container {
  @include aqua-glass('round', $overrides: (shine: (z-index: 20), glow: (z-index: 20)));
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
| `circle`, `control-round`, `slider-thumb` | `round` |
| `pill`, `control`, `bubble`, `select` | `box` |
| `header`, `progress` | `bar` |
| `toast` | `subtle`-like (shine-only) |

---

## Current usage in the codebase

| Component | File | Usage |
|-----------|------|-------|
| Traffic lights | `src/_traffic-lights.scss` | `round` |
| Window controls | `src/_window.scss` | `round` |
| Buttons | `src/_buttons.scss` | `box` + overrides (pill-like) |
| Tabs | `src/_tabs.scss` | `box` + overrides (tab profile) |
| Spinner | `src/_spinner.scss` | `round` + z-index overrides |
| Switch thumb | `src/_switch.scss` | `round` + sizing overrides |
| Toast action | `src/_toast.scss` | `subtle` + intensity |
| Progress (indeterminate) | `src/_progress.scss` | `bar` + stronger glow overrides |
| Checkbox (class) | `src/_checkbox.scss` | `box` |
| Checkbox (native) | `src/_checkbox.scss` | `box` (shine-only) |
| Radio (class) | `src/_radio.scss` | `round` |
| Radio (native) | `src/_radio.scss` | `round` (shine-only) |
| Table header | `src/_table.scss` | `bar` |
| Pagination | `src/_pagination.scss` | `round` |
| Stepper buttons | `src/_stepper.scss` | `box` + full-width overrides |
| Titled pane header | `src/_titled-pane.scss` | `bar` |
| Select dropdown | `src/_forms.scss` | `box` + width/radius overrides |
| Custom slider thumb | `src/_forms.scss` | `round` (lower intensity) |

### Known limitations

- Scrollbar thumbs and native slider thumbs use vendor pseudo-elements (e.g. `::-webkit-scrollbar-thumb`, `::-webkit-slider-thumb`) which **cannot** reliably host `::before/::after`. Those elements keep custom styling outside of this system.
