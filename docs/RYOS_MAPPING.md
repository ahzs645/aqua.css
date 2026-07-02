# ryOS ⇄ aqua.css Component Mapping

This document maps every interface part of [ryOS](https://github.com/ryokun6/ryos) (the
`macosx` / Aqua theme) to the aqua.css component that should style it. The goal is to use
ryOS as a **live accuracy testbed** for aqua.css: ryOS provides a full working OS interface
(windows, menu bar, dock, apps, dialogs), and aqua.css is layered on top so the two
renderings can be compared side by side against real Mac OS X 10.0–10.4.

The integration itself lives in the [ryos-cus](https://github.com/ahzs645/ryos-cus)
overlay repo (see `templates/aqua-css/` there). This document is the shared reference for
*what maps to what* and *how each part is reached*.

---

## 1. How ryOS theming works (the seams we hook into)

ryOS applies themes via data-attributes on `<html>` set by `useThemeStore.ts`:

| Attribute | Values | Purpose |
|---|---|---|
| `data-os-theme` | `system7` \| `macosx` \| `xp` \| `win98` | Primary theme selector; drives `--os-*` tokens in `src/styles/themes/tokens.css` |
| `data-os-platform` | `mac` \| `windows` | Platform-level layout rules |
| `data-os-mac-chrome` | `aqua` \| `system7` | Mac chrome flavor |
| `data-os-aqua-material` | `glass` (or absent = classic) | Activates `aqua-glass.css` overrides |
| `data-os-color-scheme` | `dark` (or absent = light) | Activates `dark-aqua.css` overrides |
| `data-os-accent` | accent id | Accent color; inline `--os-accent-*` vars on `<html>` |

Styling is delivered through three layers, each requiring a different override strategy:

1. **`--os-*` CSS custom properties** (`tokens.css`) — colors, gradients, pinstripes,
   fonts, metrics. **Strategy: token bridge** — redefine these tokens with aqua.css
   values under `:root[data-os-theme="macosx"]`. Highest-leverage: everything
   token-driven (Tailwind `bg-os-*` utilities, `var()` in inline styles) follows
   automatically.
2. **Structural CSS classes** in ryOS's own `src/styles/themes/aqua.css` (105 KB) —
   `.window`, `.menubar`, `.aqua-button`, `.aqua-tab*`, `.os-themed-input`,
   `.os-select-trigger-macos`, `.os-drawer-metal`, etc. **Strategy: scoped stylesheet**
   — load `dist/aqua.scoped.css` (everything prefixed under `.aqua`) and put
   `class="aqua"` on `<html>`. Because `.aqua .window` (specificity 0,2,0) beats
   ryOS's bare `.window` / single-class rules, aqua.css wins where selectors collide —
   and several class names collide *by design* (see table).
3. **Inline styles / JS-conditional rendering** (`useThemeFlags()` branches,
   `TrafficLightButton.tsx`, `MacTopMenuBar.tsx` surface, `MacDock.tsx` surface,
   `dropdown-menu.tsx`, `select.tsx`, `switch.tsx`). Inline styles beat any stylesheet.
   **Strategy: targeted `!important` bridge rules** where the inline style reads a
   literal value, or **component template replacement** (the ryos-cus pattern already
   used for traffic lights) where markup must change.

> **Material/scheme caveat:** aqua.css recreates *classic* Aqua (10.0–10.4, light).
> ryOS defaults to the `glass` material and supports dark mode — both load extra
> override sheets that fight the skin. For accuracy testing, switch ryOS to
> **Classic material + light mode**. The bridge only targets
> `[data-os-theme="macosx"]` and does not attempt glass/dark parity.

---

## 2. Component map

Legend for the **Mechanism** column:
- **TOKEN** — covered by the `--os-*` token bridge (`aqua-bridge.css`).
- **CLASS** — covered by `aqua.scoped.css` via colliding/added class names.
- **FORCE** — needs a targeted `!important` rule in the bridge (inline style upstream).
- **TEMPLATE** — needs a replaced component in ryos-cus (markup difference).
- **GAP** — no aqua.css counterpart yet (candidate for a new aqua.css component).

### 2.1 OS chrome

| ryOS part | ryOS source | aqua.css component | aqua.css selectors | Mechanism | Notes |
|---|---|---|---|---|---|
| Window frame | `layout/window-frame/WindowFrame.tsx` (`.window`) | Window | `.window`, `.window.inactive` | CLASS + TOKEN | Class name collides by design. Bridge must neutralize aqua.css `border-radius: 8px 8px 0 0` / `overflow: hidden` if it fights ryOS resize handles; window bg + shadow also via `--os-color-window-bg`, `--os-window-shadow`. ryOS uses `.is-foreground` instead of `.inactive` — bridge maps `.window:not(.is-foreground)` → inactive styles. |
| Title bar | `WindowFrameTitleBar.tsx` (inline pinstripe + gradient) | Title bar | `.title-bar`, `.title-bar-text` | TOKEN | ryOS titlebar background is `var(--os-pinstripe-titlebar)` + tokens — remap `--os-color-titlebar-active-bg` → `--aqua-titlebar-bg`, `--os-pinstripe-titlebar` → `--aqua-pinstripe-titlebar`, inactive variants likewise. Height via `--os-metrics-titlebar-height` (aqua.css uses 22px; ryOS token is 1.375rem = 22px ✓). |
| Traffic lights | `shared/TrafficLightButton.tsx` (inline TS gradients) | Traffic lights | `.traffic-lights`, `.aqua-light`, `.aqua-red/-yellow/-green`, `.aqua-inactive`, `.icon` | TEMPLATE | Unreachable via CSS (inline styles built in TS). ryos-cus already replaces it with a `TrafficLights` template using these exact aqua.css class names. Variants available: `--large/--small`, `--panther`, `--ryos`, `.unsaved`. |
| Window pinstripe body | `WindowFrame.tsx` content surface | Pinstripe background | `--pinstripe`, `.aqua-bg-pinstripe`, `.window-body` | TOKEN | Remap `--os-pinstripe-window` → `--pinstripe` (layered with `--window-bg`). |
| Brushed metal windows | `.window-material-brushedmetal`, `--os-texture-toolbar-image` (jpg) | Brushed metal | `.window.brushed-metal[-authentic/-light/-dark/-warm]`, `--brushed-metal*` | TOKEN + CLASS | ryOS uses a photo (`/assets/brushed-metal.jpg`); aqua.css uses procedural CSS gradients. Bridge remaps `--os-texture-toolbar-image` → `--brushed-metal` gradient stack for an apples-to-apples comparison. |
| Menu bar (top) | `layout/menu-bar/MacTopMenuBar.tsx` (`.mac-top-menubar`, inline surface) | Menu bar | `.menu-bar`, `.menu-title`, `.menu-apple`, `.menu-dropdown`, `.menu-bar-clock` | CLASS + FORCE | The apply script adds `.menu-bar` to the bar (gloss `::before`, metrics, font come from the component) and `.menu-title` to every `MenubarTrigger` (macosx variant — app menubars hardcode class strings, so the shared trigger component is the one covering hook). Bridge: sets `--os-metrics-menubar-height: 28px` to match the component's fixed height, forces the inline-styled surface layers (`--menu-bar-gradient` + `--menu-bar-pinstripe` + `--menu-bar-shadow`), lifts bar content above the gloss layer, and aliases Radix `[data-state="open"]` to the `.menu-title` hover/active look. |
| Menu dropdowns / menus | Radix via `ui/menubar.tsx` `MenubarContent`, `ui/dropdown-menu.tsx` | Menu dropdown / Context menu | `.aqua-menu`, `.menu-dropdown`, `.context-menu`, `.context-menu-item` | CLASS + FORCE | The apply script adds `.aqua-menu` to `MenubarContent`; bridge forces the panel paint (`--menu-dropdown-gradient/-border/-shadow`, 5px radius) over ryOS's inline pinstripe+opacity styling. Radix portals render outside any container wrapper — that's why the `aqua` class goes on `<html>`. Item hover/selection via bridged `--os-color-selection-*`. |
| Context menu | `ui/right-click-menu.tsx` | Context menu | `.context-menu`, `.aqua-menu` | TOKEN | Selection + panel tokens. |
| Dock | `layout/dock/MacDock.tsx` (`.mac-dock-surface`, inline surface) | Dock | `.dock`, `.dock-icon`, `.dock-separator`, `.dock-label` | CLASS + FORCE | The apply script adds `.dock` to the shelf (reflection `::after` + backdrop blur come from the component); bridge forces the inline-styled surface paint from `--dock-bg/-pinstripe/-border/-border-radius/-shadow`. Height/padding/magnification stay ryOS-managed (inline motion values win, intentionally). ryOS's classic running indicator is already a black triangle; its hover labels remain ryOS's own — adopt `.dock-icon`/`.dock-label` markup later if per-icon fidelity is wanted. |
| Desktop wallpaper | `layout/desktop/Desktop.tsx` | (n/a — aqua.css `body` pinstripe) | `--pinstripe` | — | Keep ryOS wallpapers; aqua.css body background intentionally not applied (scoped build maps `body` → `body.aqua`, class not added to body). |
| Dialogs / sheets | `components/dialogs/*` over `ui/dialog.tsx` | Dialog / Alert | `.aqua-dialog*`, `.aqua-alert-dialog*`, `.aqua-modal-overlay`, `.window.sheet` | TOKEN | ryOS dialogs are WindowFrame-based → inherit window mapping; alert internals via tokens. Full markup adoption would be TEMPLATE work per dialog. |
| Spotlight search | `layout/spotlight-search/` | Search field | `.aqua-search-field`, `input[type=search]` | TOKEN | Input tokens (`--os-color-input-*` → `--input-*`, `--search-field-*`). |
| Boot screen | `dialogs/BootScreen.tsx` | Spinner | `.spinning-pinwheel`, `.spinner-aqua` | GAP/manual | Cosmetic; optional. |

### 2.2 Controls (shadcn `src/components/ui/*`)

| ryOS part | ryOS source | aqua.css component | aqua.css selectors | Mechanism | Notes |
|---|---|---|---|---|---|
| Push buttons | `ui/button.tsx` → classes `aqua-button primary/secondary` | Buttons | `.aqua-button`, `--primary/--secondary/--small/--large`, `.round-rect` | CLASS | Direct class-name collision — `aqua.scoped.css`'s `.aqua .aqua-button` beats ryOS's `.aqua-button`. Gloss tokens: `--aqua-button-*`. ryOS accent-driven gloss (`--os-accent-button-*`) will be overridden — expected for accuracy testing. |
| Select (popup button) | `ui/select.tsx` → `os-select-trigger-macos` + inline | Select | `.select-wrapper`, `.select-button`, `.select-arrows`, `--select-*` | TOKEN + FORCE | Trigger chrome forced via bridge (`--select-gradient`, `--select-border`); popup panel via menu tokens. Full fidelity (double-arrow cap) needs TEMPLATE markup. |
| Text inputs | `ui/input.tsx` → `os-themed-input` | Text fields | `.aqua-textfield`, `--input-*` | TOKEN | `--os-color-input-*` → `--input-bg/-shadow/-focus-*`. Focus ring: `--os-color-input-focus-ring` → `--input-focus-shadow`. |
| Textarea | `ui/textarea.tsx` | Text fields | `textarea`, `.aqua-textfield` | TOKEN | Same tokens. |
| Checkbox | `ui/aqua-checkbox.tsx` (inline TS gradients) + `ui/checkbox.tsx` | Checkbox | `.aqua-checkbox`, `--checkbox-*` | TEMPLATE | Like traffic lights: glossy layers are inline TS. Template swap of `aqua-checkbox.tsx` to aqua.css markup is the accurate path; token bridge gets colors close in the meantime. |
| Radio | (within forms) | Radio | `.aqua-radio`, `--radio-*` | TOKEN/CLASS | |
| Switch | `ui/switch.tsx` (inline, `--os-color-switch-*`) | Switch | `.aqua-switch`, `.aqua-switch-thumb`, `--switch-*` | TOKEN + FORCE | Bridge remaps `--os-color-switch-track/-checked` from `--switch-track-gradient` / `--switch-thumb-on-gradient` (flattened). Real Aqua had no switches — aqua.css's is an extrapolation; good comparison case. |
| Slider | `ui/slider.tsx` → `.os-slider*` (pure CSS) | Slider | `input[type=range]`, `.aqua-slider-custom` (`.track/.thumb/.ticks`) | CLASS (bridge maps) | Bridge maps `.os-slider-track/-range/-thumb` to aqua.css track/thumb gradients. |
| Tabs | `shared/ThemedTabs.tsx` → `aqua-tab-bar/aqua-tab/aqua-tab-content` | Tabs | `.aqua-folder-tabs > .aqua-tab-bar > .aqua-tab`, `.aqua-tab-content`, `--tab-*` | CLASS | Class names collide by design; aqua.css expects `.aqua-tab--active` while ryOS uses `data-state="active"` — bridge adds a `data-state` alias rule. |
| Scrollbars | `ui/scroll-area.tsx` + native | Scrollbar | `.scrollbar`, `.scrollbar-thumb-v/-h`, `.aqua-glass-v/-h` | GAP/partial | aqua.css scrollbars are bespoke markup; ryOS uses Radix/native. Bridge styles `::-webkit-scrollbar` from aqua.css thumb gradients as approximation; full fidelity = TEMPLATE. |
| Progress | (app-level) | Progress | `.progress-bar`, `.aqua-progress`, `.progress-wave`, `--progress-*` | CLASS | Use directly in apps; candy-stripe `.animated` variant available. |
| Segmented control | (toolbars) | Segmented control | `.aqua-segmented-control > button`, `button.active` | CLASS | |
| Stepper | (forms) | Stepper | `.aqua-stepper`, `.aqua-spinner` | CLASS | |
| Tooltip | `ui/tooltip.tsx` | Tooltip | `.aqua-tooltip`, `--tooltip-bg/-border` | TOKEN | |
| Toasts | `ui/sonner.tsx` (`.toaster`) | Toast | `.aqua-toast*` | TOKEN/partial | Sonner structure ≠ aqua.css toast markup; token-level colors only. |
| Badges | `ui/badge.tsx` | Badge | `.aqua-badge`, `.badge-dot` | CLASS | |
| Tables | `ui/table.tsx` | Table view | `.table-view`, `--table-*` | CLASS | Add `table-view` class via bridge alias or app markup. |
| Lists / sidebars | `ui/selectable-list-item.tsx`, `osAppSidebarSurfaceClassName` (`.os-app-sidebar`) | List view | `.aqua-list`, `.aqua-list-item.selected`, `--list-*` | TOKEN | Selection gradients: `--os-color-selection-bg` → `--selection-focused-*`. |
| Toolbars | `osToolbarSurfaceClassName`, `.os-toolbar-texture`, `metal-inset-btn` | Toolbar | `.toolbar`, `.toolbar-button`, `.toolbar-separator`, `--window-toolbar-*` | TOKEN + CLASS | |
| Split panes / drawers | `osDrawerSurfaceClassName` (`.os-drawer-metal`) | Split view | `.split-pane`, `.split-divider`, `.split-grabber` | TOKEN | Drawer metal → `--brushed-metal-toolbar`. |
| Disclosure / accordions | (apps) | Titled pane / Disclosure | `.aqua-titled-pane`, `.titled-pane-arrow`, disclosure icons | CLASS | |
| Combobox | `ui/combobox.tsx` | Combobox | `.aqua-combobox > input` | TOKEN | |
| Focus rings | global (`--os-color-selection-glow`) | Focus ring | `.aqua-focus-ring`, `--ring`, `--input-focus-shadow` | TOKEN | Single remap covers app-wide focus glow. |
| Selection highlight | `--os-color-selection-bg/-text` (+ accents) | Selection | `--selection-focused-solid`, `--selection-*` | TOKEN | Note: ryOS accents inject inline `--os-color-selection-*` on `<html>` which beat the bridge — set accent to **System** when accuracy-testing. |
| Hyperlinks | `--os-color-link` | Hyperlink | `.hyperlink`, `a` | TOKEN | → `--aqua-blue-dark` family. |
| Fonts | `--os-font-ui` (Lucida Grande stack) | Fonts | `--font-ui`, `@font-face` LucidaGrande woffs | TOKEN | aqua.css ships actual LucidaGrande webfonts — the bridge points `--os-font-ui` at `--font-ui` so ryOS renders with the real font, a major accuracy win. |

### 2.3 aqua.css components with no ryOS consumer yet

Available for app-level adoption inside ryOS (all CLASS-ready once the skin is on):
`.aqua-balloon`, `.aqua-chat-bubble` (ryOS Chats app is a natural fit), `.aqua-quote`
variants, `.pagination`, `.tree-view` / `.tree-table` (Finder list view fit),
`.aqua-toast` markup, `.spinning-pinwheel`, era presets (`[data-aqua-era="10-0"…"10-6"]`),
color themes (`[data-aqua-theme="graphite"|"air"|"earth"|"fire"|"purple"]`).

### 2.4 Known gaps in aqua.css surfaced by this mapping (roadmap candidates)

- **Dark mode** — ryOS has full dark Aqua (`dark-aqua.css`, 87 KB); aqua.css has none.
- **Glass material** — ryOS's modern “liquid glass” Aqua variant; out of scope for 10.0–10.4 but worth a comparison note.
- **Radix-friendly state selectors** — supporting `[data-state="active"|"checked"|"open"]` alongside `.active`/`.selected`/`--checked` modifiers would make aqua.css drop-in for Radix/shadcn apps (small SCSS addition, big integration win).
- **Native scrollbar skin** — a `::-webkit-scrollbar` fallback so hosts without bespoke markup still get Aqua scrollbars.
- **Menu bar height token** — expose `--menu-bar-height` instead of hardcoded 28px.

---

## 3. Token bridge reference (ryOS token → aqua.css token)

The authoritative bridge lives in ryos-cus `templates/aqua-css/aqua-bridge.css`. Summary:

| ryOS `--os-*` token | aqua.css source token |
|---|---|
| `--os-font-ui` | `--font-ui` (LucidaGrande @font-face stack) |
| `--os-color-window-bg` | `--window-bg` |
| `--os-color-menubar-bg` | `--menu-bar-gradient` |
| `--os-color-menubar-border` | `--menu-bar-border` |
| `--os-color-window-border` | `--window-border` |
| `--os-color-window-border-inactive` | `--window-border-inactive` |
| `--os-color-titlebar-active-bg` | `--aqua-titlebar-bg` |
| `--os-color-titlebar-inactive-bg` | `--aqua-titlebar-inactive-bg` |
| `--os-color-titlebar-border` | `--window-titlebar-border` |
| `--os-color-titlebar-text` / `-inactive` | `--window-titlebar-text` / `-inactive` |
| `--os-pinstripe-titlebar` | `--aqua-pinstripe-titlebar` |
| `--os-pinstripe-window` | `--pinstripe` |
| `--os-pinstripe-menubar` | `--menu-bar-pinstripe` |
| `--os-color-selection-bg` | `--selection-focused-solid` |
| `--os-color-selection-text` | `--selection-focused-text` |
| `--os-color-selection-glow` | (derived from) `--selection-focus-ring` |
| `--os-color-link` | `--aqua-blue-dark` |
| `--os-color-text-primary/-secondary/-disabled` | `--text-color` / `--text-disabled` |
| `--os-color-panel-bg` | `--surface` |
| `--os-color-input-bg/-border/-focus-*` | `--input-bg`, `--select-border`, `--input-focus-*` |
| `--os-color-separator` | `--table-border` |
| `--os-window-shadow` | `--aqua-window-shadow` (via `--shadow-drop-*`) |
| `--os-texture-toolbar-image` | `--brushed-metal` (procedural, replaces jpg) |
| `--os-color-dock-surface/-shadow` | `--dock-bg` / `--dock-shadow` |
| `--os-color-menubar-surface` | `--menu-bar-gradient` |
| `--os-color-switch-track/-checked` | `--switch-track-*` / `--switch-thumb-on-*` (flattened) |

## 4. Testing workflow

1. Build aqua.css (`npm run build`) → `dist/aqua.scoped.css` (everything under `.aqua`).
2. In ryos-cus, the apply script copies the skin module + bridge into a fresh ryOS clone;
   CI builds aqua.css from this repo's `main` and ships `public/aqua-css/`.
3. Run ryOS, pick the **Mac OS X** theme, set material **Classic**, appearance **Light**,
   accent **System**.
4. Compare each component above against the aqua.css docs page and real 10.0–10.4
   screenshots; fix inaccuracies **in aqua.css source**, rebuild, re-apply.
5. Toggle the skin off (`VITE_AQUA_CSS_SKIN=false` or switch themes) to diff against
   ryOS's native Aqua rendering.
