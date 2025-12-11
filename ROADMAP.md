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

## Current Status: Phase 1 Complete ✅

### What's Been Built

```
aqua.css/
├── .github/workflows/     # Ready for CI/CD
├── docs/
│   └── index.html.ejs     ✅ Documentation with examples
├── fonts/                 # Empty - ready for fonts
├── icon/                  # Empty - ready for SVGs
├── dist/
│   ├── aqua.css           ✅ 12KB minified
│   ├── aqua.css.map       ✅ Source map
│   └── index.html         ✅ Generated docs
├── .editorconfig          ✅
├── .gitignore             ✅
├── .npmignore             ✅
├── build.js               ✅ PostCSS build pipeline
├── LICENSE                ✅ MIT
├── package.json           ✅
├── README.md              ✅
├── server.js              ✅ Dev server with hot reload
├── style.css              ✅ Main CSS source (~19KB)
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
| Scrollbars | ✅ Done | WebKit custom scrollbars |
| Labels | ✅ Done | With disabled state |

---

## Phase 2: SVG Icons & Visual Polish

### Priority: HIGH

The current implementation uses CSS-only solutions. Adding proper SVG icons will improve authenticity.

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

1. [ ] Create close/minimize/maximize symbols (show on hover)
2. [ ] Create checkmark SVG for checkboxes
3. [ ] Create disclosure triangles for tree view
4. [ ] Update style.css to use `svg-load()` for icons
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
- [ ] Horizontal menu bar
- [ ] Dropdown menus on hover/click
- [ ] Menu item hover state (blue highlight)
- [ ] Keyboard shortcuts display (right-aligned)
- [ ] Separators
- [ ] Disabled items
- [ ] Submenus (nested)
- [ ] Checkmark for selected items

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
- [ ] Icon + text buttons
- [ ] Icon-only mode
- [ ] Vertical separators
- [ ] Disabled state
- [ ] Toggle buttons (pressed state)

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
- [ ] Warning, error, info, question icons
- [ ] Title and message
- [ ] Button row (right-aligned)
- [ ] Modal overlay
- [ ] Sheet variant (slides from title bar)

### 3.4 Slider / Range Input

Aqua-style slider control.

```html
<input type="range" min="0" max="100" value="50">
```

**Features:**
- [ ] Custom thumb (blue pill or circular)
- [ ] Track styling
- [ ] Tick marks (optional)
- [ ] Vertical orientation

### 3.5 Search Field

Rounded search input with icon.

```html
<input type="search" class="search-field" placeholder="Search...">
```

**Features:**
- [ ] Rounded pill shape
- [ ] Magnifying glass icon
- [ ] Clear button (×)
- [ ] Focus state

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
- [ ] Connected button group
- [ ] Active/selected state
- [ ] Icon-only variant

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
- [ ] Alternating row colors (zebra striping)
- [ ] Sortable column headers
- [ ] Selected row highlight (blue)
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
- [ ] Disclosure triangles
- [ ] Indentation
- [ ] Selected item highlight
- [ ] Dotted connection lines (optional)

### 3.9 Tooltip

Hover tooltips.

```html
<button data-tooltip="Click to save">Save</button>
```

**Features:**
- [ ] Yellow/cream background
- [ ] Black text
- [ ] Subtle shadow
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
- [ ] Replace blue with gray in buttons, checkboxes, radios
- [ ] Gray traffic light buttons when inactive
- [ ] Gray progress bars
- [ ] Gray selection highlight

### 4.2 Pinstripe Background

Classic pinstripe pattern for window backgrounds.

```css
.window.pinstripe {
  background: var(--pinstripe);
}
```

### 4.3 Brushed Metal

Full brushed metal window (like iTunes, QuickTime).

```html
<div class="window brushed-metal">
```

**Features:**
- [ ] Metallic texture gradient
- [ ] Slightly different button styling
- [ ] Darker window body

---

## Phase 5: Animations & Polish

### Priority: MEDIUM-LOW

### 5.1 Animations

- [ ] Button press animation (subtle scale)
- [ ] Checkbox/radio transition
- [ ] Progress bar smooth fill
- [ ] Menu dropdown slide
- [ ] Window appear animation (scale + fade)
- [ ] Genie effect (advanced, CSS only approximation)

### 5.2 Accessibility

- [ ] Focus visible outlines (keyboard navigation)
- [ ] `prefers-reduced-motion` support
- [ ] `prefers-contrast` support
- [ ] ARIA attributes in documentation examples
- [ ] Screen reader testing

### 5.3 Browser Compatibility

- [ ] Firefox scrollbar fallback (`scrollbar-color`, `scrollbar-width`)
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

### 6.2 npm Publishing

- [ ] Update package.json with final details
- [ ] Add `files` field to limit package contents
- [ ] Test `npm pack` locally
- [ ] Publish v0.1.0

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
| Menus with blue highlight | ⬜ |
| Translucent menus | ⬜ (CSS limitation) |
| Sheet dialogs | ⬜ |
| Genie minimize effect | ⬜ (CSS limitation) |

### Color Reference

| Color | Hex | Usage |
|-------|-----|-------|
| Aqua Blue | `#2B99FF` | Buttons, checkboxes, selection |
| Aqua Blue Dark | `#0066CC` | Borders, darker areas |
| Aqua Blue Light | `#66CCFF` | Highlights |
| Close Red | `#FF5F57` | Close button |
| Minimize Yellow | `#FFBD2E` | Minimize button |
| Maximize Green | `#28CA41` | Maximize button |
| Window Gray | `#E8E8E8` | Window background |
| Graphite | `#8C8C8C` | Graphite theme |

### Typography

- **System Font:** -apple-system, Lucida Grande, Helvetica Neue
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
npm start          # Dev server at localhost:3000

# Build
npm run build      # Creates dist/aqua.css

# File structure
style.css          # Edit this - main source
docs/index.html.ejs # Edit this - documentation
icon/              # Add SVGs here
```

### Adding a New Component

1. Add CSS to `style.css` (follow existing patterns)
2. Add example to `docs/index.html.ejs`
3. Run `npm run build` to test
4. Update TODO.md and ROADMAP.md

---

## Questions to Decide

1. **Should scrollbars be blue?** Classic Aqua had blue scrollbar thumbs, but the current implementation uses gray (more neutral). Consider adding a `.scrollbar-blue` variant.

2. **How authentic vs. usable?** Some Aqua elements (like heavy textures) may not suit modern web apps. Balance authenticity with practicality.

3. **JavaScript?** Currently pure CSS. Should we add optional JS for:
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

*Last updated: December 2024*
