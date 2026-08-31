# Four-value shorthand visualiser

`javascript/core/shorthand-visualizer.js` renders a keyboard- and touch-friendly
mapping between four CSS shorthand values and four labelled positions. Shared
styles live in `css/shorthand-visualizer.css`.

The component is intentionally property-neutral. Border radius can use corner
positions now; later margin and padding lessons can provide side positions
without creating another interaction pattern.

## Mount and configuration

```html
<div data-shorthand-visualizer-id="corner-radius"></div>
```

```js
import { initShorthandVisualizers } from "../core/shorthand-visualizer.js"

initShorthandVisualizers([
  {
    id: "corner-radius",
    property: "border-radius",
    values: ["10px", "20px", "30px", "40px"],
    previewKind: "border-radius",
    previewLabel: "Card",
  },
])
```

Optional `positions` entries can replace the default clockwise corners. Each
entry needs an `id`, student-facing `label`, and ordinal `order`.

The values are buttons, so click, touch, and focus all reveal a mapping. Arrow,
Home, and End keys move between values. Selected states use text and borders as
well as colour, and a text list repeats the complete mapping.
