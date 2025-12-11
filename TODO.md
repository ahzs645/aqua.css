# aqua.css - Project Status

## Completed

### Project Structure
- [x] Package.json with dependencies (PostCSS, cssnano, EJS, etc.)
- [x] Build script (build.js) - compiles CSS, inlines SVGs, generates docs
- [x] Dev server (server.js) - hot reload on file changes
- [x] Git repository initialized
- [x] MIT License
- [x] README.md with installation and usage instructions
- [x] .gitignore, .npmignore, .editorconfig

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
- [x] Custom scrollbars (WebKit)
- [x] Utility classes (field-row, field-row-stacked)
- [x] Labels

### Documentation
- [x] EJS template with all component examples
- [x] Code snippets with syntax highlighting


---

## TODO - Not Yet Implemented

### High Priority

#### SVG Icons (icon/ folder)
- [ ] Traffic light button symbols (×, −, +) for hover state
- [ ] Checkbox checkmark as SVG
- [ ] Radio dot as SVG
- [ ] Scrollbar arrows (up, down, left, right)
- [ ] Select dropdown arrow
- [ ] Disclosure triangles (for tree view)

#### Fonts (fonts/ folder)
- [ ] Consider adding Lucida Grande alternative (or document system font usage)
- [ ] Charcoal font for classic Mac feel (optional)

#### Additional Components
- [ ] **Menu bar** - Horizontal menu with dropdowns
- [ ] **Dropdown menus** - With hover states and separators
- [ ] **Context menus** - Right-click style menus
- [ ] **Toolbar** - Icon toolbar like classic Mac apps
- [ ] **Alert/Dialog boxes** - Modal alerts with icon
- [ ] **Tooltips** - Hover tooltips
- [ ] **Slider/Range input** - Aqua-style slider
- [ ] **Stepper** - Number input with +/- buttons
- [ ] **Search field** - Rounded search input with icon
- [ ] **Segmented control** - Button group (like view switcher)
- [ ] **List view** - Striped table rows
- [ ] **Tree view** - Expandable/collapsible list
- [ ] **Split view** - Resizable panes
- [ ] **Disclosure triangle** - Expandable sections

### Medium Priority

#### Variants/Themes
- [ ] **Graphite theme** - Gray instead of blue
- [ ] **Pinstripe variant** - Classic pinstripe background
- [ ] **Brushed metal variant** - Full brushed metal window

#### Animations
- [ ] Window open/close animation
- [ ] Button press animation refinement
- [ ] Menu slide-down animation
- [ ] Checkbox/radio transition animation

#### Accessibility
- [ ] Focus visible outlines
- [ ] High contrast mode support
- [ ] Reduced motion support
- [ ] Screen reader improvements

### Low Priority

#### Advanced Features
- [ ] **Dock** - Mac dock recreation
- [ ] **Desktop icons** - Grid of icons
- [ ] **Finder window** - Sidebar + file list
- [ ] **Sheet dialogs** - Slide-down from title bar
- [ ] **Drawer** - Slide-out side panel

#### Build/Tooling
- [ ] GitHub Actions workflow for npm publish
- [ ] GitHub Actions for gh-pages deployment
- [ ] Minified + non-minified dist files
- [ ] CSS custom properties preserved option
- [ ] SCSS source files (like XP.css)

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
│   └── workflows/        # CI/CD (TODO)
├── docs/
│   ├── index.html.ejs    # ✅ Documentation template
│   └── (screenshot.png)  # TODO
├── fonts/                # TODO - add web fonts
├── icon/                 # TODO - add SVG icons
│   ├── close.svg
│   ├── minimize.svg
│   ├── maximize.svg
│   ├── checkbox.svg
│   ├── radio.svg
│   ├── arrow-up.svg
│   ├── arrow-down.svg
│   └── ...
├── dist/                 # Generated by build
│   ├── aqua.css
│   ├── aqua.css.map
│   └── index.html
├── .editorconfig         # ✅
├── .gitignore            # ✅
├── .npmignore            # ✅
├── build.js              # ✅ Build script
├── LICENSE               # ✅ MIT
├── now.json              # ✅ Vercel config
├── package.json          # ✅
├── README.md             # ✅
├── server.js             # ✅ Dev server
├── style.css             # ✅ Main source CSS
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
- Firefox scrollbar fallback needed
