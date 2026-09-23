# Fonts

aqua.css bundles Lucida Grande in this folder (about 2.4 MB in total):

| File | Weight |
|------|--------|
| `LucidaGrande.woff` | 400 (regular) |
| `Lucida Grande-Medium.ttf` | 500 |
| `Lucida Grande-Deml Bold.ttf` | 600 |
| `LucidaGrandeBold.woff` | 700 (bold) |

`src/_fonts.scss` declares them with `@font-face` (family `"Lucida Grande"`), and every
build includes those rules. Each rule tries a locally installed Lucida Grande first
(`local(...)`) and only downloads the bundled file when it is missing. The build copies
this folder to `dist/fonts/`; `dist/*.css` load fonts from `fonts/...` and
`dist/components/*.css` from `../fonts/...`.

`src/_fonts.scss` also defines font presets (Chicago, Charcoal, Helvetica Neue,
San Francisco) selected with `data-aqua-theme`. Those presets are not bundled; they
use fonts installed on the viewer's system.

To bundle another font, add the file here and reference it from `src/_fonts.scss`
with a `../fonts/` URL.

## Licensing

Lucida Grande is an Apple font. Confirm that you have the rights to redistribute these
files before publishing the package to npm or otherwise distributing them. Only add
font files you are licensed to redistribute.
