# AquaFX SCSS Showcase

A modular SCSS implementation of the AquaFX Mac OS X Aqua design system.

## Directory Structure

```
scss/
├── base/
│   ├── _variables.scss    # All color, typography, and spacing variables
│   ├── _mixins.scss       # Reusable SCSS mixins
│   ├── _reset.scss        # Base reset and typography
│   └── _index.scss        # Base module index
├── components/
│   ├── _buttons.scss      # Standard, toggle, pill buttons
│   ├── _checkbox.scss     # Checkbox component
│   ├── _radio.scss        # Radio button component
│   ├── _textfield.scss    # Text field (regular, search, round-rect)
│   ├── _textarea.scss     # Text area component
│   ├── _select.scss       # Select / choice box
│   ├── _slider.scss       # Slider component
│   ├── _progress.scss     # Progress bar and spinner
│   ├── _scrollbar.scss    # Custom scrollbar styles
│   ├── _menu.scss         # Context menu and menu bar
│   ├── _toolbar.scss      # Toolbar component
│   ├── _tabs.scss         # Tab pane (pill style)
│   ├── _list.scss         # List view
│   ├── _table.scss        # Table view
│   ├── _tree.scss         # Tree view
│   ├── _titled-pane.scss  # Titled pane / accordion
│   ├── _split-pane.scss   # Split pane
│   ├── _tooltip.scss      # Tooltip
│   ├── _link.scss         # Hyperlink
│   ├── _separator.scss    # Separator
│   ├── _group-box.scss    # Group box
│   ├── _window.scss       # Window chrome, titlebar
│   ├── _alert.scss        # Alert dialog
│   ├── _badge.scss        # Badge component
│   ├── _color-picker.scss # Color picker
│   ├── _pagination.scss   # Pagination
│   ├── _spinner.scss      # Number spinner / stepper
│   └── _index.scss        # Components module index
├── themes/
│   ├── _theme-base.scss   # Base theme mixin
│   ├── _air.scss          # Air (light/white) theme
│   ├── _earth.scss        # Earth (green) theme
│   ├── _fire.scss         # Fire (red) theme
│   └── _index.scss        # Themes module index
├── layout/
│   ├── _demo.scss         # Demo-specific layout styles
│   └── _index.scss        # Layout module index
└── main.scss              # Main entry point
```

## Usage

### Installation

```bash
npm install
```

### Build CSS

```bash
# Build once
npm run sass

# Watch for changes
npm run sass:watch

# Build minified version
npm run sass:compressed

# Build both
npm run build
```

### Using in Your Project

1. **Full library**: Import `main.scss` for all components
   ```scss
   @use 'aquafx/scss/main';
   ```

2. **Individual components**: Import only what you need
   ```scss
   @use 'aquafx/scss/base/variables' as *;
   @use 'aquafx/scss/base/mixins' as *;
   @use 'aquafx/scss/components/buttons';
   ```

3. **Variables only**: Use AquaFX colors in your own styles
   ```scss
   @use 'aquafx/scss/base/variables' as aqua;

   .my-button {
     background: aqua.$button-gradient-white;
     border-color: aqua.$border-dark;
   }
   ```

### Theme Variants

Apply themes by adding a class to a parent element:

```html
<body class="theme-earth">
  <!-- All components inside will use Earth (green) colors -->
</body>
```

Available themes:
- Default (no class) - Aqua Blue
- `theme-air` - Light/White
- `theme-earth` - Green
- `theme-fire` - Red

## Key Variables

### Colors
- `$aqua-bg` - Background color
- `$aqua-text` - Text color
- `$focus-inner` / `$focus-outer` - Focus ring colors
- `$border-dark` / `$border-light` - Border colors

### Typography
- `$aqua-font-family` - Lucida Grande
- `$aqua-font-size` - 13px (regular)
- `$aqua-font-size-small` - 11px
- `$aqua-font-size-mini` - 9px

### Spacing
- `$spacing-xs` to `$spacing-xl` - 2px to 20px

## Key Mixins

- `button-gradient` - Standard button background
- `button-gradient-armed` - Pressed button background
- `checkbox-gradient` - Checkbox/radio background
- `checkbox-gradient-selected` - Selected checkbox/radio
- `focus-ring` - Focus outline effect
- `aqua-font` - Standard font settings
- `disabled-state` - Disabled appearance

## Browser Support

- Chrome/Edge (Chromium)
- Firefox
- Safari

Note: Custom scrollbar styling uses `-webkit-` prefixes and `scrollbar-*` properties for Firefox.

## Credits

Based on the original [AquaFX](https://github.com/AquaFX/AquaFX) JavaFX library by Claudine Zillmann & Hendrik Ebbers.
