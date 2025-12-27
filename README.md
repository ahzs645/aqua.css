# aqua.css

A CSS library for building interfaces that look like Apple's Aqua UI (Mac OS X 10.0 - 10.4 era).
Docs and demo: http://projects.ahmadjalil.com/aqua.css

## Features

- Authentic Aqua button styles with glossy gradients
- Window components with "traffic light" buttons
- Form controls: inputs, checkboxes, radio buttons, selects
- Progress bars with candy-stripe animation
- Scrollbar styling
- Tabs and panels
- No JavaScript required - pure CSS

## Installation

### npm

```bash
npm install aqua.css
```

```html
<link rel="stylesheet" href="node_modules/aqua.css/dist/aqua.css">
```

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/aqua.css">
```

### Legacy browsers

If you need a build with CSS custom properties resolved, use `dist/aqua.legacy.css`
after running `npm run build`.

### Scoped build

Use `dist/aqua.scoped.css` to scope styles to a container:

```html
<div class="aqua">
  <!-- Aqua UI -->
</div>
```

### Inline assets

For a single-file drop-in (icons inlined), use `dist/aqua.inline.css`.

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

## Optional Fonts

To prefer local Aqua-era fonts, add `class="aqua-fonts"` (or `data-aqua-fonts`) on
`<body>`. For bundling custom font files, see `fonts/README.md`.

## Component Builds

Component-only builds are emitted to `dist/components/*.css` for cherry-picking.

## Components

- **Windows** - Classic Aqua window frames with brushed metal or pinstripe
- **Buttons** - Glossy blue buttons with pulsing default state
- **Forms** - Text inputs, textareas, selects with Aqua styling
- **Checkboxes & Radios** - Authentic blue Aqua controls
- **Progress Bars** - Animated candy-stripe progress indicators
- **Tabs** - Rounded Aqua-style tab panels
- **Scrollbars** - Blue pill-shaped scrollbars

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
