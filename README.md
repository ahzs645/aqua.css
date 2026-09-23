# aqua.css

A CSS library for building interfaces that look like Apple's Aqua UI (Mac OS X 10.0 - 10.4 era).
Docs and demo: https://projects.ahmadjalil.com/aqua.css/

## Features

- Authentic Aqua button styles with glossy gradients
- Window components with "traffic light" buttons
- Form controls: inputs, checkboxes, radio buttons, selects
- Progress bars with candy-stripe animation
- Scrollbar styling
- Tabs and panels
- Styles are pure CSS - no JavaScript ships with the library. Some interactive
  demos on the docs site (split-pane dragging, tab switching, custom sliders and
  scrollbars, listbox selection, tree tables, titled panes, dock magnification) use
  small page scripts that are not part of the library; you supply that behavior.

## Installation

### Build from source (works today)

aqua.css is not published to npm yet, so build it locally:

```bash
git clone https://github.com/ahzs645/aqua.css.git
cd aqua.css
npm install
npm run build
```

Then copy `dist/aqua.css` **together with `dist/fonts/`, `dist/icon/` and
`dist/progress.png`** into your project (the CSS references them by relative path)
and link it:

```html
<link rel="stylesheet" href="aqua.css">
```

### npm (once published)

These instructions will work after the package is published to npm:

```bash
npm install aqua.css
```

```html
<link rel="stylesheet" href="node_modules/aqua.css/dist/aqua.css">
```

### CDN (once published)

```html
<link rel="stylesheet" href="https://unpkg.com/aqua.css">
```

### Build outputs

`npm run build` writes these files to `dist/`:

| File | What it is |
|------|------------|
| `aqua.css` | Main build, minified, CSS custom properties preserved |
| `aqua.legacy.css` | Custom properties resolved to static values, for older browsers. Color themes and font presets are not available in this build, and era presets only partly apply |
| `aqua.scoped.css` | Every selector prefixed with `.aqua ` (see below) |
| `aqua.inline.css` | Like `aqua.css`, but images (png/svg/gif/jpg) are inlined as data URIs |
| `components/*.css` | Per-component bundles (see [Component Builds](#component-builds)) |
| `fonts/` | Bundled Lucida Grande files referenced by every build |
| `icon/`, `progress.png` | Images referenced by `aqua.css`, `aqua.legacy.css` and `aqua.scoped.css` |

Each `*.css` file has a matching `.map` source map. The build also writes the docs
site into `dist/` (`index.html`, `docs.css`, `favicon.ico` and copies of the
`docs/*.md` notes); only the files listed in `package.json` `files` are packaged.

All `dist/*.css` builds reference fonts as `fonts/...` relative to themselves, and the
component bundles in `dist/components/` reference `../fonts/...`, so keep the
`fonts/` folder next to whichever file you use.

### Legacy browsers

If you need a build with CSS custom properties resolved, use `dist/aqua.legacy.css`
after running `npm run build`.

### Scoped build

Use `dist/aqua.scoped.css` to scope styles to a container:

```html
<div class="aqua">
  <div data-aqua-era="10-2">
    <!-- Aqua UI -->
  </div>
</div>
```

In the scoped build every selector is prefixed with `.aqua ` (with a space), so era
and theme attributes/classes (`data-aqua-era`, `data-aqua-theme`, `aqua-era-*`,
`theme-*`) only match on an element **inside** the `.aqua` container, never on the
`.aqua` element itself. For example, with `<body class="aqua">` put them on a child
element, not on `<body>`. The same applies to the font presets described under
[Fonts](#fonts).

### Inline assets

For fewer files to copy, use `dist/aqua.inline.css`: icons and images are inlined
as data URIs. Fonts are **not** inlined, so it still needs `dist/fonts/` next to it.

## Usage

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="aqua.css">
</head>
<body>
  <div class="window">
    <div class="title-bar">
      <div class="title-bar-controls">
        <button aria-label="Close"></button>
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
      </div>
      <div class="title-bar-text">My Window</div>
    </div>
    <div class="window-body">
      <p>Hello, Aqua!</p>
      <button>Click Me</button>
    </div>
  </div>
</body>
</html>
```

## Fonts

Lucida Grande is bundled (in `fonts/`, copied to `dist/fonts/`) and loaded via
`@font-face` in every build. A locally installed Lucida Grande is used first when
available. See `fonts/README.md` for details and licensing notes.

To switch the UI font to another Mac-era system font, set `data-aqua-theme` on
`<html>`, `<body>` or any container; it applies to everything inside it. In the
scoped build, put it on an element inside the `.aqua` container. Font presets are
not available in the legacy build.

| Value | Font |
|-------|------|
| `chicago` or `system1` | Chicago (System 1-7.6) |
| `charcoal` or `macos9` | Charcoal (Mac OS 8-9) |
| `lucida-grande` or `aqua` | Lucida Grande (default) |
| `helvetica-neue` or `yosemite` | Helvetica Neue (OS X 10.10) |
| `san-francisco` or `el-capitan` | San Francisco (OS X 10.11+) |

```html
<html data-aqua-theme="charcoal">
```

Only Lucida Grande is bundled; the other presets rely on fonts installed on the
viewer's system and fall back to the next font in the stack.

`data-aqua-theme` is also used by the color themes (`graphite`, `air`, `earth`,
`fire`, `purple`). To combine a color theme with a font preset, use the class form
for the color theme (for example `class="theme-graphite"`).

## Component Builds

Component-only builds are emitted to `dist/components/*.css` for cherry-picking.
Each bundle is self-contained (it includes the shared tokens, era/theme presets and
the `@font-face` rules) and loads fonts from `../fonts/`.

## Components

- **Windows** - Classic Aqua window frames with brushed metal or pinstripe
- **Buttons** - Glossy blue buttons with pulsing default state
- **Forms** - Text inputs, textareas, selects with Aqua styling
- **Checkboxes & Radios** - Authentic blue Aqua controls
- **Progress Bars** - Animated candy-stripe progress indicators
- **Tabs** - Rounded Aqua-style tab panels
- **Scrollbars** - Blue pill-shaped scrollbars

Many more components (menu bar, context menus, dock, toolbar, alerts, sliders,
steppers, segmented controls, list/tree views, split views, tooltips and others)
are demonstrated on the [docs site](https://projects.ahmadjalil.com/aqua.css/).

## Aqua Era Presets

Apply an era class (or `data-aqua-era`) to shift the palette and textures between releases:

- `aqua-era-10-0` (Mac OS X 10.0-10.1)
- `aqua-era-10-2` (Mac OS X 10.2)
- `aqua-era-10-3` (Mac OS X 10.3)
- `aqua-era-10-6` (Mac OS X 10.6, rectangular buttons)

Mac OS X 10.4 is the default look, so no class is required.

```html
<body class="aqua-era-10-2">
  <!-- Your Aqua UI -->
</body>
```

## Development

```bash
# Install dependencies
npm install

# Build CSS and docs
npm run build

# Start dev server with hot reload
npm start
```

## Acknowledgments

Inspired by:
- [98.css](https://github.com/jdan/98.css) by Jordan Scales
- [XP.css](https://github.com/botoxparty/XP.css) by Adam Hammad
- [system.css](https://github.com/sakofchit/system.css) by Sakun Acharige

## License

MIT
