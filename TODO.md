# aqua.css - Project Status

## Completed

### Project Structure
- [x] Package.json with dependencies (PostCSS, cssnano, EJS, etc.)
- [x] Build script (build.js) - compiles CSS, inlines SVGs, generates docs
- [x] Dev server (server.js) - hot reload on file changes
- [x] Dev server keeps running when a rebuild fails (e.g. a Sass error)
- [x] Fonts copied to `dist/fonts/`; every `dist/*.css` build loads `fonts/...` relative to itself, `dist/components/*.css` load `../fonts/...`
- [x] Legacy build (`aqua.legacy.css`) no longer emits `undefined` values
- [x] Git repository initialized
- [x] MIT License
- [x] README.md with installation and usage instructions
- [x] .gitignore

### CSS Variables (`:root`)
- [x] Aqua blue color palette (light, medium, dark variants)
- [x] Graphite alternative colors
- [x] Surface/background colors
- [x] Traffic light button colors (red, yellow, green)
- [x] Shadow definitions (window, button, inset)
- [x] Border radius variables
- [x] Spacing variables
- [x] Typography (system font stack)
- [x] Gradient definitions (brushed metal, button, blue button)

### Components

#### Window
- [x] Window container with rounded corners and shadow
- [x] Title bar with brushed metal gradient
- [x] Traffic light buttons (close, minimize, maximize)
- [x] Traffic light hover states
- [x] Inactive window state (grayed buttons)
- [x] Window body
- [x] Status bar

#### Buttons
- [x] Standard button with gradient
- [x] Hover and active states
- [x] Default button (blue Aqua style)
- [x] Pulsing animation for default button
- [x] Disabled state

#### Form Controls
- [x] Text input styling
- [x] Password, email, URL, tel, number, search inputs
- [x] Textarea
- [x] Focus states with blue glow
- [x] Disabled states
- [x] Select dropdown with custom arrow

#### Checkboxes
- [x] Custom checkbox appearance
- [x] Checked state (blue gradient with checkmark)
- [x] Focus state
- [x] Disabled state

#### Radio Buttons
- [x] Custom radio appearance
- [x] Checked state (blue gradient with dot)
- [x] Focus state
- [x] Disabled state

#### Progress Bar
- [x] Basic progress bar
- [x] Animated candy-stripe variant
- [x] Indeterminate (barber pole) variant

#### Tabs
- [x] Tab list container
- [x] Tab items with active state
- [x] Tab panel

#### Other
- [x] Fieldset/legend (group box)
- [x] Custom scrollbars (WebKit `::-webkit-scrollbar`)
- [x] Firefox scrollbar fallback (`scrollbar-color`, wrapped in `@supports not selector(::-webkit-scrollbar)`)
- [x] Utility classes (field-row, field-row-stacked)
- [x] Labels

### Documentation
- [x] EJS template with all component examples
- [x] Code snippets with syntax highlighting


---

## TODO - Not Yet Implemented

### High Priority

#### SVG Icons (icon/ folder)
- [x] Traffic light button symbols (×, −, +) for hover state - rendered as text glyphs in `.icon` spans (`close.svg`, `minimize.svg`, `maximize.svg` exist in `icon/` but are not referenced)
- [x] Checkbox checkmark as SVG (`icon/checkbox-check.svg`)
- [x] Radio dot as SVG (`icon/radio-dot.svg`)
- [x] Scrollbar arrows (up, down, left, right) (`icon/scrollbar-*.svg`)
- [x] Select dropdown arrow - `.select-wrapper` uses `.select-arrows` markup (`icon/select-arrow.svg` exists but is not referenced)
- [x] Disclosure triangles (`icon/disclosure-open.svg`, `icon/disclosure-closed.svg`)
- [x] Alert icons (`icon/alert-*.svg`, `icon/finder.svg`, `icon/finder-jaguar.png`)

#### Fonts (fonts/ folder)
- [x] Lucida Grande bundled (`fonts/`, loaded via `@font-face` in `src/_fonts.scss`, ~2.4 MB)
- [x] Era font presets via `data-aqua-theme` (Chicago, Charcoal, Lucida Grande, Helvetica Neue, San Francisco) - only Lucida Grande is bundled; the rest use system-installed fonts
- [ ] Confirm redistribution rights for the bundled Lucida Grande files before publishing to npm
- [x] Font presets apply on any element (each preset recomputes `--font-ui`); not available in the legacy build

#### Additional Components
- [x] **Menu bar** - Horizontal menu with dropdowns (`.menu-bar`, `.menu-dropdown`)
- [x] **Dropdown menus** - With hover states and separators (`.aqua-menu`, `.aqua-menu-item`, `.aqua-menu-separator`)
- [x] **Context menus** - Right-click style menus (`.context-menu`, nested submenus)
- [x] **Toolbar** - Icon toolbar like classic Mac apps (`.toolbar`, `.toolbar-button`, `.toolbar-separator`)
- [x] **Alert/Dialog boxes** - Modal alerts with icon (`.alert-dialog`, `.modal-overlay`, `.aqua-dialog`)
- [x] **Tooltips** - Hover tooltips (`[data-tooltip]`, `.aqua-tooltip`)
- [x] **Slider/Range input** - Aqua-style slider (`input[type="range"]`, `.aqua-slider-custom`)
- [x] **Stepper** - Number input with +/- buttons (`.aqua-stepper`, `.aqua-spinner`)
- [x] **Search field** - Rounded search input with icon (`input[type="search"]`, `.aqua-search-field`)
- [x] **Segmented control** - Button group (like view switcher) (`.segmented-control`)
- [x] **List view** - Striped rows (`.aqua-list.striped`, `.table-view`)
- [x] **Tree view** - Expandable/collapsible list (`.aqua-tree`, `.tree-view`, `.tree-table`)
- [x] **Split view** - Resizable panes (`.aqua-split-pane`, `.split-view`; dragging needs page JS)
- [x] **Disclosure triangle** - Expandable sections (`details.disclosure`)

### Medium Priority

#### Variants/Themes
- [x] **Graphite theme** - Gray instead of blue (`.theme-graphite` / `data-aqua-theme="graphite"`; also `air`, `earth`, `fire`, `purple`)
- [x] **Pinstripe variant** - Classic pinstripe background (`--pinstripe`, `.aqua-bg-pinstripe`)
- [x] **Brushed metal variant** - Full brushed metal window (`.window.brushed-metal`, `-light`, `-dark`, `-authentic`)
- [x] **Era presets** - `.aqua-era-*` / `data-aqua-era` (10.0, 10.2, 10.3, 10.4 default, 10.6)

#### Animations
- [ ] Window open/close animation
- [ ] Button press animation refinement
- [ ] Menu slide-down animation
- [x] Checkbox/radio transition animation (0.15s transitions on native inputs)

#### Accessibility
- [x] Focus visible outlines (`:focus-visible` rings on buttons, checkboxes, radios, fields, sliders, tabs, menus, steppers)
- [x] Focus ring for segmented controls (drawn on the control with `:has(:focus-visible)`)
- [ ] High contrast mode support
- [x] Reduced motion support (`src/_motion.scss`: pulses and progress stripes hold still, slides/rotations are instant, spinners keep turning)
- [ ] Screen reader improvements

### Low Priority

#### Advanced Features
- [x] **Dock** - Mac dock recreation (`.dock`, `.dock-icon`; magnification demo uses page JS)
- [ ] **Desktop icons** - Grid of icons
- [ ] **Finder window** - Sidebar + file list
- [ ] **Sheet dialogs** - Slide-down from title bar (static `.window.sheet` exists; no slide animation)
- [ ] **Drawer** - Slide-out side panel

#### Build/Tooling
- [ ] GitHub Actions workflow for npm publish
- [ ] Publish to npm (package not published yet; README marks npm/CDN install as "once published")
- [x] GitHub Actions for GitHub Pages deployment (`.github/workflows/deploy.yml`, on push to `main`)
- [ ] Minified + non-minified dist files (all builds are currently minified by cssnano)
- [x] CSS custom properties preserved option (`aqua.css` keeps them; `aqua.legacy.css` resolves them)
- [x] SCSS source files (like XP.css) (`src/`)

#### Documentation
- [ ] Screenshot for README
- [ ] Interactive component playground
- [ ] Accessibility guidelines
- [ ] Browser support table
- [ ] Changelog


---

## File Structure Reference

```
aqua.css/
├── .github/
│   └── workflows/
│       └── deploy.yml    # ✅ Builds and deploys dist/ to GitHub Pages
├── docs/
│   ├── index.html.ejs    # ✅ Documentation template
│   ├── partials/         # ✅ One _*.ejs partial per docs section
│   ├── docs.css          # ✅ Docs site styles
│   └── (screenshot.png)  # TODO
├── fonts/                # ✅ Bundled Lucida Grande (woff/ttf)
├── icon/                 # ✅ Icons
│   ├── alert-error.svg, alert-info.svg, alert-question.svg, alert-warning.svg
│   ├── checkbox-check.svg, radio-dot.svg
│   ├── close.svg, minimize.svg, maximize.svg   # present, not referenced by the CSS
│   ├── disclosure-closed.svg, disclosure-open.svg
│   ├── scrollbar-up.svg, scrollbar-down.svg, scrollbar-left.svg, scrollbar-right.svg
│   ├── search.svg, select-arrow.svg            # present, not referenced by the CSS
│   ├── finder.svg, finder-jaguar.png, finder-jaguar.ico, apple.png
├── dist/                 # Generated by build
│   ├── aqua.css, aqua.legacy.css, aqua.scoped.css, aqua.inline.css (+ .map)
│   ├── components/       # Per-component bundles
│   ├── fonts/, icon/, progress.png
│   └── index.html, docs.css, favicon.ico
├── src/                  # ✅ SCSS source (index.scss + partials)
├── .gitignore            # ✅
├── build.js              # ✅ Build script
├── LICENSE               # ✅ MIT
├── package.json          # ✅
├── README.md             # ✅
├── server.js             # ✅ Dev server
└── TODO.md               # ✅ This file
```


---

## Notes

### Design References
- Mac OS X 10.0 Cheetah (2001) - Original Aqua
- Mac OS X 10.1 Puma (2001)
- Mac OS X 10.2 Jaguar (2002)
- Mac OS X 10.3 Panther (2003)
- Mac OS X 10.4 Tiger (2005)

### Key Aqua Characteristics
1. **Glossy/gel buttons** - Highlight at top, shadow at bottom
2. **Traffic light buttons** - Red close, yellow minimize, green zoom
3. **Brushed metal** - Textured gray gradient (iTunes, Finder)
4. **Pinstripes** - Subtle vertical stripes on window backgrounds
5. **Drop shadows** - Soft shadows on windows
6. **Pulsing default button** - Blue button gently pulses
7. **Rounded corners** - Everywhere
8. **Transparency** - Menus, sheets (hard to do in CSS)

### Browser Support Target
- Modern browsers (Chrome, Firefox, Safari, Edge)
- WebKit scrollbar styling (Chrome, Safari, Edge)
- Firefox scrollbar fallback via `scrollbar-color` (done)
