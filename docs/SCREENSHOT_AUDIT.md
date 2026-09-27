# Screenshot audit: aqua.css vs. real Mac OS X (10.0 – 10.4)

Source material: the [512 Pixels Aqua Screenshot Library](https://512pixels.net/projects/aqua-screenshot-library/)
(Public Beta, 10.0 Cheetah, 10.1 Puma, 10.2 Jaguar, 10.3 Panther, 10.4 Tiger; ~460 screenshots).
Each era's screenshots were compared against the docs demos rendered with the matching
`data-aqua-era` (`10-0`, `10-2`, `10-3`, `10-4`). Hex values were pixel-sampled from the
screenshots (Jaguar/Panther captures were scaled back to 1x before measuring).

File references are to `src/` as of commit `08d58fa`.

---

## 1. Problems shared by every era (fix these first)

### 1.1 Aqua blue gel is too dark, too dull, and ends in teal
Applies to default buttons, popup arrow caps, checked checkbox/radio, selected tab,
slider thumb, progress fill, scroller thumb, sorted table column, segmented control.

The real gel is opaque and **brightens** to a near-cyan glow at the bottom. The library's
stops are ~62–70% alpha (`--g1/--g2/--g3`, `_variables.scss:23-25`) feeding
`--aqua-blue-gradient` (`_backgrounds.scss:94`), so the bottom lands on a muted teal.

| Era | Real default button (top → dip → bottom), rim | Render |
|---|---|---|
| 10.0/10.1 | `#93ADCF`→`#B2CAE4` · `#7FABD8`/`#5A91CB` · `#C2EEFF`/`#97CFFF`, rim `#163075`/`#242C68` | mid `#4C7DC4`, bottom `#7AB3D6` |
| 10.2 | `#C6D0E6`→`#85B2DD` · `#4592D5` · `#75B4EE`→`#99D6F7`, rim `#100F62` | `#688EC7`→`#5282C5`→`#93C3E1` |
| 10.3 | `#CEDBEF`→`#A5CBF1` · `#80BBF1` · `#BBF7FF` | `#AFBDD3`→`#5280C3`→`#8BBBDC` |
| 10.4 | `#C7D4EC`→`#A5C6E7` · `#6CABED` · `#ADF8FF`, rim `#28289A` | mid `#5381C3`, bottom `#86BAD7` |

Other measured bottoms: checkbox `#B4FFFF` (10.4), slider thumb `#D8FFFF`–`#DFFFFF`, scroller `#A3E7FF`–`#B3ECFF`,
progress `#6DC0FF`–`#94D5FF`, segmented `#BAF1FF`.

**Fix:** per-era *opaque* `--aqua-blue-gradient` (+ `--checkbox-selected-gradient`
`_variables.scss:354`, progress gloss, scroller thumb `_scrollbar.scss:163,240`) using the values
above, with a dark navy 1px rim. The era blocks live at `_themes.scss:556` (10-0), `:731` (10-2),
`:929` (10-3).

### 1.2 Push buttons / popups: too big, bold, letter-spaced and shadowed
Every era: real buttons are **13px regular Lucida Grande, black, no text-shadow, ~20px tall**
(plus a soft 3–5px drop shadow). Render: 16px, `font-weight:700`, letter-spacing, blurred text
shadow, 26–29px tall.

- `_buttons.scss:11` (weight), `:12` (`height:1.75em`), `:22`/`:34` (size, letter-spacing)
- `_variables.scss:80` (`--font-size-button-base: 1rem`), `:430,445` (text shadows)
- Popup: `_forms.scss:160,166` (28px tall / 16px text → should be 20–21px / 13px)

Secondary (white) glass is also too grey everywhere. Real Cancel/unselected tab/unchecked radio
ends at **white** at the bottom (e.g. 10.4 `#F9F9F9`→`#EEEEEE` | `#DADADA`→`#FFFFFF`;
10.3 radio `#FFFFFF`→`#EDEDED`→`#FFFFFF`). Render sits at `#C7`–`#CB` mid-grey
(`--aqua-gray-gradient`, `_backgrounds.scss:108`).

### 1.3 Traffic lights: no dark rim, glow is missing/inverted
Real lights have a near-black 1px ring and a bright bottom glow; the library's bottoms get
darker and the yellow reads orange.

| | Red bottom | Yellow bottom | Green bottom | Rim |
|---|---|---|---|---|
| 10.0/10.1 | `#FDBCAF` / `#FFB8AB` | `#FFFF92` | `#D8FF9B` | `#090909`–`#7A1717` |
| 10.2 | `#FFC5B9` | `#FFFFA2` | `#DDFFA7` | `#6B4646`, highlight `#EBCDCC` near top |
| 10.3 | `#FBB8B0` | `#FFFC98` | `#DBFF9E` | `#5C5858` |
| 10.4 | `#F9B6AC` | `#FFFD85` | `#DBFD96` | `#131313` |
| Render (all) | `#C0`–`#D4` red | `#E0B235`–`#EFC65F` (orange) | `#6DAD36`–`#93C763` | none |

Fix: `_themes.scss:587-632` (10-0), `:762-799` (10-2), `:949+` (10-3), `:997-1045` (10-4);
add `0 0 0 1px rgba(0,0,0,.75)` to the shadow. 10.0 lights are 13px; 10.4 uses a 7px gap
(`_window.scss:208`, currently 8px).

### 1.4 Menu bar
Real menu bar is **22px** in every era (render: 28px, `_menu.scss:9-11`), with a thin bottom
border and no blue tint.

- 10.0/10.1: flat neutral pinstripe `#FFF/#FAFAFA/#E9E9E9/#FAFAFA` (4px), then `#D4D4D4` + `#757575` lines. Render grades to blue `#D3DEEA` (`_themes.scss:538-550`).
- 10.2: flat pinstripe `#FFF`/`#EDEEED`, 14px menu font (`_themes.scss:713`).
- 10.3: nearly flat `#FBFBFB`→`#EAEAEA`, stripes ~2 levels, `#BCBCBC` border (`_themes.scss:911-922`).
- 10.4: no stripes; white→`#F3F3F3`→`#E8E8E8` (mid)→white, border `#BDBDBD` (`_variables.scss:1108-1121`).
- Menu bar demo shows a Spotlight glyph in every era; Spotlight is 10.4-only. 10.0/10.1 clock is `Tue 4:10 PM`.

### 1.5 Menus / context menus
- **Square corners** in every era. Only 10-0/10-2 set radius 0 (`_menu.scss:308-310`); add 10-3 and 10-4.
- 10.0–10.2 highlight keeps the pinstripe: `#2C61B9/#346CBE/#3973C1/#346CBE` (10.0), `#3372C4`/`#4888CD` (10.2). Render is flat.
- 10.0: no border, ~90% white translucent body, 19px items, text indent ~22px, **black** shortcuts (render: grey border, 4px indent, grey shortcuts; `_menu.scss:309,341`, `_variables.scss:1176`).
- 10.4: faint bluish stripe `#EAECEE`/`#E6E8EA`, separator `#CDCFD1` (render: harsh `#FDFDFD`/`#E8E8E8`).

### 1.6 Toolbar is the wrong style in every era
Render (`--toolbar-bg-gradient`, `_variables.scss:1183`; `_toolbar.scss:7,23`) is a dark
`#DCDCDC`→`#AFAFAF` gradient with a `#676767` border and bezelled rect buttons.

- 10.0–10.2: continues the window pinstripe; icon + label items with **no bezel**; bottom border `#A3A3A3` (10.0) / `#B2B2B2` (10.2).
- 10.3: light stripe `#F9F9F9`/`#F6F6F6`, border `#AFAFAF`.
- 10.4 (unified): continues the title bar, `#EBEBEB`→`#D7D7D7`, single `#8B8B8B` bottom line.

### 1.7 Dock is too opaque
`--dock-bg: rgba(248,248,248,.75)` (`_variables.scss:1490`) reads as near-opaque `#FBFBFB`.
Real: ~40–50% white, square corners, light 1px border, **light** separator, no shadow.
10.0/10.1 keep the pinstripe (`rgba(255,255,255,.5)`); 10.2 `.45`; 10.3 `.44` flat; 10.4 `.4` flat.

### 1.8 Tables / lists
- Header too tall and too dark: real 15–17px, 11px text, no text shadow, glossy white
  (`#FFF`→`#F4F4F4` | `#EEE`→`#FFF`; 10.0 starts `#BEBEBE`), bottom line `#888`–`#B2B2B2`.
  Render 22px (`_variables.scss:835`, `.unified-header` uses button gradient at `_mixins.scss:483`).
- Rows: real 17–18px, zebra `#EDF3FE` (10.4) / `#F1F6FE` (10.2–10.3), no horizontal grid lines.
  Render 22px, `#F3F6FA`, `#F0F0F0` lines (`_variables.scss:854`, `_mixins.scss:437,451-452`).
  10.0 screenshots show no zebra striping at all.
- Sorted column is the blue gel (see 1.1), render is muted `#C7D3E6`→`#85ABD6`.

### 1.9 Scroller
Real is 15px wide with a near-white track, darker on one side (`#C5C5C5`/`#CACACA`→`#FDFDFD`).
Render is 18px, symmetric, grey `#A5A5A5`→`#E8E8E8` (`_scrollbar.scss:330-336`, `_variables.scss:1336`).

### 1.10 Brushed metal is wrong in every era
Real metal is **neutral grey (R=G=B)** and lighter than the render:
10.0 QuickTime `#BB`–`#D8`; 10.1 iTunes `#A2`–`#D9`; 10.2 iTunes `#B4`–`#D7`; 10.3 Finder
`#B3`–`#DA` (bottom bar `#CACACA`); 10.4 iTunes `#9A`–`#D1`.
- 10-0 and 10-2 metal variables are **blue-tinted** (`#C8D4E4…`, `_themes.scss:470-535`; `#C4D0DE`→`#8CA0B4`, `_themes.scss:681`). Make them neutral.
- 10-3 base gradient `#BEBEBE`→`#909090` is ~25 levels too dark (`_themes.scss:856-869, 883`). Use roughly `#D0D0D0`→`#C4C4C4`→`#BCBCBC`.

### 1.11 Smaller shared items
- **Group box legend** is bold (`_fieldset.scss:19`); real is regular 13px in all eras.
- **Disclosure triangle**: real is a borderless filled grey triangle (`#636363`–`#7D7D7D`), ~9px wide, regular label. Library draws a tiny `#333` triangle in a bordered box (`_disclosure.scss:6-26`, `icon/disclosure-open.svg`), and tree-view triangles are 5–6px (`_treeview.scss:83`).
- **Alert text**: title should be 13px bold with 16px line pitch; informative text 11px (`_alert.scss:123,129`).
- **Text field** edge: crisp 1px top (`#7C7C7C` 10.0 / `#9D9D9D` 10.2 / `#BEBEBE` 10.4) with lighter sides and a visible light bottom edge; the render uses only a blurred inset (`_forms.scss:24-25`, `_variables.scss:286`).
- **Progress bar** is 13–15px tall; real fill is 10–11px (`_progress.scss:15`), track brightens toward the bottom.

---

## 2. Era-specific findings

### 10-0 (Cheetah / Puma)
- **Selections are grey, not blue.** A scan of all 10.0 shots found no blue list selections. Focused `#C2C2C2`, unfocused `#DDDDDD`, black text (Force Quit, Open panel). Set `--listbox-option-selected-bg` (`_variables.scss:969`) and `--list-item-selected-focused-*` (`_themes.scss:566-570`); change the table override (`_table.scss:144-184`, `_tree-table.scss:144+`) from a gradient to flat.
- **Focus ring is grey:** solid 3px `#7C7C7C`, no glow (`_variables.scss:291`, `_backgrounds.scss:125`).
- **Inactive window:** only the title bar goes translucent (desktop tints it blue); body stays opaque and the title text stays dark (~`#404349`). The library applies `opacity:.85` to the whole window (`_window.scss:392-409`).
- **Pinstripe shape:** title bar is a soft 4px wave `#FFF/#F1F1F1/#EAEAEA/#F1F1F1`; body `#FFF/#EEE/#E6E6E6/#EEE`. Library uses one hard dark line per period (`_window.scss:375-386`, `_variables.scss:271`). Title bar bottom line `#7F7F7F` (render `#ABABAB`).
- **Windows/sheets:** no outline border (shadow only; `_window.scss:11` adds `1px rgba(0,0,0,.4)`), top radius ~6px (not 8px), sheets have square bottom corners (`_window.scss:335`). Alerts carry an empty 22px pinstriped title strip.
- **Horizontal scroll arrows** default to split (◀ left, ▶ right).
- **Search field** did not exist in 10.0; hide it or flag it as anachronistic in this era.
- **10.1 needs no separate era.** Pixel diffs show identical chrome. Only differences: menu extras (solid black Displays/Volume glyphs) and the `Day h:mm AM` clock. `data-aqua-era="10-1"` currently only affects alerts (`_alert.scss:29,106`); either alias it to `10-0` everywhere or drop the stray `'10-1'` loops.

### 10-2 (Jaguar)
- **Pinstripes too heavy:** real is 2px `#FFFFFF` / 2px `#ECECEC` (avg `#F3F3F3`); render 3×`#E9E9E9` + 1 white. Add a 10-2 `--pinstripe` override and drop the `filter: blur(.5px)` at `_mixins.scss:59`.
- Unchecked radio/checkbox body should be near-white (`#FFF`→`#ECECEC`→`#FFF`); borders radio `#5D5D5D`, checkbox `#858585`/`#404040` (`_variables.scss:339,369-370`).
- Tabs: inactive `#F4F4F4`→`#E8E8E8`|`#DFDFDF`→`#FFF`, border `#939393`; selected rim `#1435C2` (`_variables.scss:709,720`; inactive currently starts at `#AEAEAE`).
- Table header glossy white; sorted column `#D5E6F7`→`#9FC7ED`|`#7BB7EE`→`#C5FBFF`.

### 10-3 (Panther)
- **Window body needs pinstripes:** faint 2px `#F3F3F3` / 2px `#F0F0F0`, neutral. Render is flat bluish `#E7E9EC` because 10-3 only sets `--window-bg` (`_themes.scss:816`) and the pinstriped body loop at `_window.scss:373` covers only 10-0/10-2.
- **Selections:** focused table selection is flat `#3875D7` (not a darkening gradient, `_themes.scss:942+`); unfocused is flat `#DCDCDC` (render blue-grey, `_variables.scss:907`). Only source lists use a gradient (`#6CA9EA`→`#2B6FD8` iTunes, `#4CA8E8`→`#0476D7` Finder).
- **Tab/group-box pane:** striped `#E9E9E9`/`#EDEDED`, `#D2D2D2` border, no drop shadow under the tab pill.
- **Focus ring:** soft ~4px glow `#D9E4ED`→`#97BCDD`, e.g. `0 0 0 1px #97BCDD, 0 0 3px 2px rgba(120,160,215,.6)`. The current ring is a hard 3px.

### 10-4 (Tiger, default era)
- **Window body needs pinstripes:** 2px `#F0F0F0` / 2px `#ECECEC` (render flat `#ECECEC`, `_window.scss:168`).
- **Title bar:** `#E8E8E8`→`#CACACA`, top highlight `#F9F9F9`, bottom `#8C8C8C` (render `#EFEFEF`→`#D1D1D1`, `#A7A7A7`; `_backgrounds.scss:115,119`).
- **Focused selection** too pale: Finder sidebar `#409AE3`→`#005FCD` (top line `#0B7DD8`), iTunes `#5999E5`→`#1F5CCF`; render `#6CB1E3`→`#3F8CD2` (`_variables.scss:920-929`).
- Unchecked checkbox needs a dark bottom rim (`#242424`) and a fill ending at `#FFFFFF`.

---

## 3. What already matches well
- Slider track and pointed/round thumb shape and size (all eras).
- Checkbox (14px) and radio sizes; checkmark overhang.
- Title-bar height (22px) and 10.3 title-bar gradient.
- Menu item highlight colour in 10.3/10.4 (`rgba(39,101,202,.88)` ≈ real `#336FCC`).
- Square group boxes in 10-0/10-2; tab-strip structure and blue tab bar colours.
- Scroll arrows together/split modes; Help "?" button; alert layout with 64px icon.
- Lucida Grande font stack.

---

## 4. Components seen in screenshots that aqua.css doesn't have
Roughly in order of how often they appear:

1. **Drawers** (Mail in every era).
2. **Column browser** (Open panels and Finder column view), with grey unfocused selection `#DCDCDC`.
3. **Toolbar-toggle pill** in the title bar, and a **window resize grip**.
4. **Icon + label toolbar items**, plus the textured/metal capsule segmented buttons (Finder back/forward, view switcher).
5. **Action (gear) pop-down** and bottom-bar `+`/gear bevel buttons.
6. **iTunes LCD** status display and round metal transport buttons.
7. **Utility/panel window** with a 15px title bar (Force Quit).
8. **Source-list section header** ("Source" in iTunes); Finder status bar strip; metal status bar.
9. Menu-bar extras (10.1+), document proxy icon, Command-Tab switcher, colour well, text ruler, Finder label pills.
10. Optional: **Public Beta menu bar** variant with the centred Apple logo (`.menu-bar--kodiak`).

---

## 5. Docs site issues found during the audit
- The canvas brushed-metal demo (`#brushed-metal`, first example) rendered as flat `#E8E8E8` in headless Chromium (file://). Check that the canvas draws on load.
- The modern overlay scrollbar demo is not gated by era.
- There's no docs demo for Puma's tab pane; tabs, disclosure, progress, slider and search demos inside `<details>` blocks weren't captured by the first render pass, and reviewers re-rendered them separately.

## Status after the first fidelity pass

Fixed on this branch, era by era (values live in the era presets in `src/_themes.scss`, with
per-component era rules in each component file):

- **Root cause found:** `:root` composes tokens such as `--aqua-button-primary-gradient` once, so
  the per-era `--aqua-blue-gradient` never reached buttons, checkboxes or sliders. The classic
  eras now re-declare those composed tokens.
- 1.1 blue gel (opaque, per era, navy rim); 1.2 13px regular buttons and popups, white secondary glass;
  1.3 traffic lights; 1.4 menu bar; 1.5 menus; 1.6 toolbar; 1.7 Dock; 1.8 tables; 1.9 scroller;
  1.10 brushed metal; 1.11 legend, disclosure triangle, alert text, text field edges, progress track.
- Era specifics: 10.0 gray selections and focus ring, translucent inactive title bar, window outline;
  10.2/10.3/10.4 pinstripes; 10.3 flat selections, soft focus ring, tab pane; 10.4 title bar and
  sidebar selection; Spotlight hidden before 10.4; `10-1` is now an alias of `10-0`.
- Correction: the real 10.4 text field has the same `#7C7C7C` / `#C3C3C3` edges as 10.0 (the
  `#BEBEBE` value above was a mis-sample).

Not changed: the unscoped default (no `data-aqua-era`) and the `10-6` era keep their previous look.
The new components in section 4 are still to do.

## Suggested order of work
1. Opaque, era-specific blue gel (1.1), which fixes about ten components at once.
2. Button/popup typography and sizing (1.2), plus the white secondary glass.
3. Pinstripes: 10-2 lighter, 10-3/10-4 body stripes; 10-0 stripe shape (§2).
4. Traffic lights (1.3).
5. Menu bar and menus (1.4, 1.5), toolbar (1.6), Dock (1.7).
6. Tables/lists and selection colours per era (1.8, §2).
7. Brushed metal neutral and lighter (1.10).
8. Remaining small items, then new components (§4).
