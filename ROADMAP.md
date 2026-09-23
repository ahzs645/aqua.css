# aqua.css Roadmap

A comprehensive plan for building a CSS library that recreates Apple's Aqua interface (Mac OS X 10.0-10.4).

---

## Project Overview

**Goal:** Create a faithful CSS recreation of Apple's Aqua UI, following the patterns established by:
- [98.css](https://github.com/jdan/98.css) - Windows 98
- [XP.css](https://github.com/botoxparty/XP.css) - Windows XP
- [system.css](https://github.com/sakofchit/system.css) - Mac OS 9

**Target Era:** Mac OS X 10.0 Cheetah (2001) through 10.4 Tiger (2005)

---

## Current Status: Phases 1-4 Mostly Complete ✅

See `TODO.md` for the item-by-item checklist.

### What's Been Built

```
aqua.css/
├── .github/workflows/
│   └── deploy.yml         ✅ Builds dist/ and deploys it to GitHub Pages
├── docs/
│   ├── index.html.ejs     ✅ Documentation page template
│   └── partials/          ✅ One _*.ejs partial per section (examples live here)
├── fonts/                 ✅ Bundled Lucida Grande (~2.4 MB woff/ttf)
├── icon/                  ✅ SVG/PNG icons (alerts, checkbox, radio, scrollbar, disclosure, ...)
├── dist/
│   ├── aqua.css           ✅ ~390 KB minified (~48 KB gzipped)
│   ├── aqua.legacy.css    ✅ Custom properties resolved
│   ├── aqua.scoped.css    ✅ Selectors prefixed with `.aqua `
│   ├── aqua.inline.css    ✅ Images inlined as data URIs (fonts are not)
│   ├── *.map              ✅ Source maps
│   ├── components/        ✅ Per-component bundles
│   ├── fonts/, icon/      ✅ Assets referenced by the CSS
│   └── index.html         ✅ Generated docs
├── src/                   ✅ SCSS source (index.scss + partials)
├── .gitignore             ✅
├── build.js               ✅ PostCSS build pipeline
├── LICENSE                ✅ MIT
├── package.json           ✅
├── README.md              ✅
├── server.js              ✅ Dev server with hot reload
├── TODO.md                ✅ Detailed task list
└── ROADMAP.md             ✅ This file
```

### Components Implemented

| Component | Status | Notes |
|-----------|--------|-------|
| CSS Variables | ✅ Done | Colors, gradients, spacing, typography |
| Window | ✅ Done | Brushed metal, rounded corners, shadow |
| Title Bar | ✅ Done | Traffic lights (red/yellow/green) |
| Buttons | ✅ Done | Standard, blue default, pulsing animation |
| Text Inputs | ✅ Done | Focus glow, disabled state |
| Textarea | ✅ Done | Resizable |
| Select | ✅ Done | Custom arrow |
| Checkbox | ✅ Done | Blue gradient when checked |
| Radio | ✅ Done | Blue gradient when selected |
| Progress Bar | ✅ Done | Static, animated stripe, indeterminate |
| Tabs | ✅ Done | Active/inactive states |
| Fieldset | ✅ Done | Group box with legend |
| Scrollbars | ✅ Done | WebKit custom scrollbars + Firefox `scrollbar-color` fallback |
| Labels | ✅ Done | With disabled state |
| Menus | ✅ Done | Menu bar, dropdowns, context menus, submenus |
| Toolbar | ✅ Done | Buttons, separators, search |
| Alerts / dialogs | ✅ Done | Alert icons, modal overlay, `.aqua-dialog` |
| Slider, stepper, search field, segmented control | ✅ Done | |
| List / tree / table views | ✅ Done | Striped lists, tree view, tree table, sortable headers |
| Split view, disclosure, titled pane | ✅ Done | Split-pane dragging needs page JS |
| Tooltip, balloon, toast, chat bubble, badge, pagination, dock | ✅ Done | |
| Themes and era presets | ✅ Done | Graphite/air/earth/fire/purple; eras 10.0-10.6; font presets |

### Recent build fixes

- [x] Legacy build (`aqua.legacy.css`) no longer emits `undefined` values
- [x] Fonts are copied to `dist/fonts/`; every `dist/*.css` build loads `fonts/...` relative to itself and `dist/components/*.css` load `../fonts/...`
- [x] Dev server keeps running when a rebuild fails (e.g. a Sass error), builds in a child process and swaps the result into `dist/`, so pages never 404 mid-rebuild
- [x] Dev dependencies: `npm audit` clean (dropped `live-server`, `postcss-copy`, `postcss-base64`, `postcss-calc`)

---

## Phase 2: SVG Icons & Visual Polish

### Priority: HIGH

Status: the core icons now exist in `icon/`: `alert-error/info/question/warning.svg`,
`checkbox-check.svg`, `radio-dot.svg`, `scrollbar-up/down/left/right.svg`,
`disclosure-open/closed.svg`, `close/minimize/maximize.svg`, `search.svg`,
`select-arrow.svg`, `finder.svg`, `finder-jaguar.png/.ico` and `apple.png`. The
`close`/`minimize`/`maximize`, `search` and `select-arrow` SVGs are not referenced by the
CSS (traffic lights use text glyphs, the search icon is an inline data URI, and selects use
`.select-arrows` markup). The `-active`/`-disabled` variants, `scrollbar-track.svg` and
`sort-arrow.svg` below were never created.

The original plan:

### Icons to Create (`icon/` folder)

#### Window Controls
```
icon/
├── close.svg              # × symbol for close button hover
├── close-active.svg       # Pressed state
├── minimize.svg           # − symbol for minimize hover
├── minimize-active.svg
├── maximize.svg           # + symbol for maximize hover
├── maximize-active.svg
```

#### Form Controls
```
├── checkbox-check.svg     # Checkmark for checked state
├── checkbox-check-disabled.svg
├── radio-dot.svg          # Center dot for selected radio
├── radio-dot-disabled.svg
```

#### Scrollbar
```
├── scrollbar-up.svg       # Arrow up
├── scrollbar-down.svg     # Arrow down
├── scrollbar-left.svg     # Arrow left
├── scrollbar-right.svg    # Arrow right
├── scrollbar-track.svg    # Track pattern (optional)
```

#### Misc
```
├── disclosure-closed.svg  # ▶ Triangle for tree view
├── disclosure-open.svg    # ▼ Triangle expanded
├── select-arrow.svg       # Dropdown arrow
├── search-icon.svg        # Magnifying glass
└── sort-arrow.svg         # Table sort indicator
```

### Tasks

1. [x] Create close/minimize/maximize symbols (show on hover) - shipped as text glyphs
2. [x] Create checkmark SVG for checkboxes
3. [x] Create disclosure triangles for tree view
4. [x] Update src/ SCSS to use `svg-load()` for icons
5. [ ] Test icon rendering at different sizes

---

## Phase 3: Additional Components

### Priority: MEDIUM-HIGH

### 3.1 Menu Bar & Menus

Classic Mac menu bar with dropdowns.

```html
<nav class="menu-bar">
  <ul>
    <li class="menu-item">
      <span class="menu-title">File</span>
      <ul class="menu-dropdown">
        <li>New</li>
        <li>Open...</li>
        <li class="separator"></li>
        <li>Save</li>
        <li class="disabled">Save As...</li>
      </ul>
    </li>
  </ul>
</nav>
```

**Features:**
- [x] Horizontal menu bar (`.menu-bar`)
- [x] Dropdown menus on hover/focus (`:hover` / `:focus-within`)
- [x] Menu item hover state (blue highlight)
- [x] Keyboard shortcuts display (right-aligned, `.shortcut`)
- [x] Separators
- [x] Disabled items
- [x] Submenus (nested `.aqua-menu` / `.context-menu`)
- [x] Checkmark for selected items (`.aqua-menu-item.checked`)

### 3.2 Toolbar

Icon toolbar like classic Mac apps.

```html
<div class="toolbar">
  <button class="toolbar-button">
    <img src="icon.png" alt="">
    <span>Back</span>
  </button>
  <div class="toolbar-separator"></div>
  <button class="toolbar-button">
    <img src="icon.png" alt="">
    <span>Forward</span>
  </button>
</div>
```

**Features:**
- [x] Icon + text buttons (`.toolbar-button.with-icon`)
- [ ] Icon-only mode
- [x] Vertical separators
- [x] Disabled state
- [ ] Toggle buttons (pressed state) - only a transient `:active` state

### 3.3 Alert / Dialog Boxes

Modal dialogs with icon.

```html
<div class="alert-dialog">
  <div class="alert-icon alert-icon-warning"></div>
  <div class="alert-content">
    <h3>Are you sure?</h3>
    <p>This action cannot be undone.</p>
  </div>
  <div class="alert-buttons">
    <button>Cancel</button>
    <button class="default">OK</button>
  </div>
</div>
```

**Features:**
- [x] Warning, error, info, question icons
- [x] Title and message
- [x] Button row (right-aligned)
- [x] Modal overlay (`.modal-overlay`)
- [ ] Sheet variant (slides from title bar) - static `.window.sheet` exists, no slide animation

### 3.4 Slider / Range Input

Aqua-style slider control.

```html
<input type="range" min="0" max="100" value="50">
```

**Features:**
- [x] Custom thumb (blue pill or circular)
- [x] Track styling
- [x] Tick marks (optional, `.aqua-slider-custom .ticks`)
- [x] Vertical orientation

### 3.5 Search Field

Rounded search input with icon.

```html
<input type="search" class="search-field" placeholder="Search...">
```

**Features:**
- [x] Rounded pill shape
- [x] Magnifying glass icon
- [x] Clear button (×) (WebKit `::-webkit-search-cancel-button` only)
- [x] Focus state

### 3.6 Segmented Control

Button group for switching views.

```html
<div class="segmented-control">
  <button class="active">Icons</button>
  <button>List</button>
  <button>Columns</button>
</div>
```

**Features:**
- [x] Connected button group
- [x] Active/selected state (`.active` / `aria-pressed="true"`)
- [ ] Icon-only variant
- [x] Keyboard focus ring (drawn on the control with `:has(:focus-visible)`)

### 3.7 List View / Table

Striped table rows like Finder.

```html
<table class="list-view">
  <thead>
    <tr>
      <th>Name</th>
      <th>Date Modified</th>
      <th>Size</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Document.txt</td><td>Today</td><td>4 KB</td></tr>
    <tr class="selected"><td>Photo.jpg</td><td>Yesterday</td><td>2.4 MB</td></tr>
  </tbody>
</table>
```

**Features:**
- [x] Alternating row colors (zebra striping)
- [x] Sortable column headers (`.sort-arrow`; sorting itself needs JS)
- [x] Selected row highlight (blue)
- [ ] Column resizing (visual only)

### 3.8 Tree View

Expandable file/folder hierarchy.

```html
<ul class="tree-view">
  <li>
    <details open>
      <summary>Folder</summary>
      <ul>
        <li>File 1</li>
        <li>File 2</li>
      </ul>
    </details>
  </li>
</ul>
```

**Features:**
- [x] Disclosure triangles
- [x] Indentation
- [x] Selected item highlight
- [ ] Dotted connection lines (optional)

### 3.9 Tooltip

Hover tooltips.

```html
<button data-tooltip="Click to save">Save</button>
```

**Features:**
- [x] Yellow/cream background
- [x] Black text
- [x] Subtle shadow
- [ ] Arrow pointer
- [ ] Delay before showing

---

## Phase 4: Themes & Variants

### Priority: MEDIUM

### 4.1 Graphite Theme

Gray alternative to Aqua blue (was a real Mac OS X option).

```html
<body class="theme-graphite">
```

**Changes:**
- [x] Replace blue with gray in buttons, checkboxes, radios
- [x] Gray traffic light buttons when inactive (default inactive state)
- [x] Gray progress bars
- [x] Gray selection highlight

Implemented as `.theme-graphite` / `data-aqua-theme="graphite"`, alongside `air`, `earth`,
`fire` and `purple`.

### 4.2 Pinstripe Background

Classic pinstripe pattern for window backgrounds.

```css
.window.pinstripe {
  background: var(--pinstripe);
}
```

Done differently: there is no `.window.pinstripe` class. The pinstripe comes from the
`--pinstripe` token (page `body`, title bars), the `.aqua-bg-pinstripe*` utilities and the
`pinstripe-window` / `pinstripe-menu` mixins.

### 4.3 Brushed Metal

Full brushed metal window (like iTunes, QuickTime).

```html
<div class="window brushed-metal">
```

**Features:**
- [x] Metallic texture gradient (`.window.brushed-metal`, `-light`, `-dark`, `-authentic`)
- [ ] Slightly different button styling
- [x] Darker window body

---

## Phase 5: Animations & Polish

### Priority: MEDIUM-LOW

### 5.1 Animations

- [ ] Button press animation (subtle scale)
- [x] Checkbox/radio transition
- [x] Progress bar smooth fill (width transition)
- [ ] Menu dropdown slide
- [ ] Window appear animation (scale + fade)
- [ ] Genie effect (advanced, CSS only approximation)

### 5.2 Accessibility

- [x] Focus visible outlines (keyboard navigation)
- [x] `prefers-reduced-motion` support (`src/_motion.scss`)
- [ ] `prefers-contrast` support
- [ ] ARIA attributes in documentation examples
- [ ] Screen reader testing

### 5.3 Browser Compatibility

- [x] Firefox scrollbar fallback (`scrollbar-color`, `scrollbar-width`, inside `@supports not selector(::-webkit-scrollbar)`)
- [ ] Test in Safari, Chrome, Firefox, Edge
- [ ] Document browser support

---

## Phase 6: Build & Distribution

### Priority: LOW (do when ready to publish)

### 6.1 GitHub Actions

```yaml
# .github/workflows/publish.yml
- Lint CSS
- Build dist/
- Run tests (if any)
- Publish to npm on release
- Deploy docs to GitHub Pages
```

- [x] Deploy docs to GitHub Pages (`.github/workflows/deploy.yml`, on push to `main`)
- [ ] Lint, test and npm publish workflow

### 6.2 npm Publishing

- [ ] Update package.json with final details
- [x] Add `files` field to limit package contents (includes `dist/fonts/`)
- [ ] Confirm redistribution rights for the bundled Lucida Grande fonts
- [ ] Test `npm pack` locally
- [ ] Publish v0.1.0 (not on npm yet; README marks npm/CDN install as "once published")

### 6.3 Documentation Site

- [ ] Add screenshot to README
- [ ] Interactive playground (optional)
- [ ] Component API reference
- [ ] Browser support table
- [ ] Changelog

---

## Design Reference

### Aqua Characteristics Checklist

| Feature | Implemented |
|---------|-------------|
| Glossy/gel buttons with highlight | ✅ |
| Traffic light window controls | ✅ |
| Brushed metal texture | ✅ |
| Pinstripe background | ✅ |
| Drop shadows on windows | ✅ |
| Pulsing default button | ✅ |
| Rounded corners everywhere | ✅ |
| Blue selection/focus color | ✅ |
| Candy-stripe progress bars | ✅ |
| Custom scrollbars | ✅ |
| Menus with blue highlight | ✅ |
| Translucent menus | ⬜ (CSS limitation) |
| Sheet dialogs | ⬜ (static `.window.sheet` only) |
| Genie minimize effect | ⬜ (CSS limitation) |

### Color Reference

Default (10.4) values from `src/_variables.scss`; eras and themes override them.

| Color | Value | Token / usage |
|-------|-------|---------------|
| Aqua Blue | `#2B99FF` | `--aqua-blue` - buttons, checkboxes, selection |
| Aqua Blue Dark | `#0066CC` | `--aqua-blue-dark` - borders, darker areas |
| Close Red | `rgb(193, 58, 45)` → `rgb(205, 73, 52)` | `--traffic-light-red-gradient` |
| Minimize Yellow | `rgb(202, 130, 13)` → `rgb(253, 253, 149)` | `--traffic-light-yellow-gradient` |
| Maximize Green | `rgb(111, 174, 58)` → `rgb(138, 192, 50)` | `--traffic-light-green-gradient` |
| Surface Gray | `#E8E8E8` | `--surface` |
| Window Gray | `#ECECEC` | `--window-bg` - window body |
| Graphite | `#8C8C8C` | `--aqua-blue` in the graphite theme |

### Typography

- **System Font:** Lucida Grande (bundled), falling back to Lucida Sans Unicode, sans-serif; other era fonts via `data-aqua-theme` presets
- **Base Size:** 13px
- **Small Size:** 11px (labels, status bar)

---

## Quick Start for Contributors

```bash
# Clone and install
git clone <repo>
cd aqua.css
npm install

# Development
npm start          # Dev server at localhost:3000 (keeps running if a rebuild fails)

# Build
npm run build      # Creates dist/aqua.css

# File structure
src/               # Edit this - SCSS source (index.scss + partials)
docs/partials/     # Edit this - documentation sections (_*.ejs)
icon/              # Add SVGs here
```

### Adding a New Component

1. Add a partial in `src/` and `@use` it from `src/index.scss` (follow existing patterns)
2. Add examples in a `docs/partials/_*.ejs` partial and include it from `docs/index.html.ejs`
3. Run `npm run build` to test
4. Update TODO.md and ROADMAP.md

---

## Questions to Decide

1. ~~**Should scrollbars be blue?**~~ Resolved: scrollbar thumbs now use the blue Aqua gradient (`--scrollbar-thumb-gradient`).

2. **How authentic vs. usable?** Some Aqua elements (like heavy textures) may not suit modern web apps. Balance authenticity with practicality.

3. **JavaScript?** The library is still pure CSS; the docs site uses small page scripts for tabs, split panes, custom sliders/scrollbars and similar demos. Should we ship optional JS for:
   - Menu dropdowns
   - Tab switching
   - Tooltip positioning
   - Window dragging

4. **Dark mode?** Mac OS X didn't have dark mode, but should we add one for modern use?

---

## Resources

### Design References
- [GUIdebook: Mac OS X](https://guidebookgallery.org/screenshots/macosx100)
- [Apple Human Interface Guidelines (archived)](https://web.archive.org/web/2005/developer.apple.com/documentation/UserExperience/)
- [Aqua (user interface) - Wikipedia](https://en.wikipedia.org/wiki/Aqua_(user_interface))

### Similar Projects
- [98.css](https://github.com/jdan/98.css)
- [XP.css](https://github.com/botoxparty/XP.css)
- [system.css](https://github.com/sakofchit/system.css)
- [7.css](https://github.com/khang-nd/7.css)

---

*Last updated: September 2026*
