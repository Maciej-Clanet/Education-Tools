# Flexbox basics

Live lesson: `pages/topics/flexbox-basics.html`, after CSS Display in the Web
Development hub. Prerequisites: parent/child relationships, selectors, display,
width and height. Quiz: 10 questions, pass 8, version 1.
Next lesson: `pages/topics/flexbox-wrapping-and-children.html`; see
`docs/flexbox_wrapping_and_children.md` for its teaching plan.

## Teaching plan

Use the same numbered children throughout. Ask learners to predict, change one
setting, then describe what moved. All layout declarations belong to the parent.
Use parent/child language first; introduce “flex container” and “flex item” only
as glossary equivalents. Examples use normal horizontal, left-to-right writing.

1. **Identify the parent.** Match indented HTML to a nested box diagram. A nested
   span belongs to its immediate parent; it is not another child of the outer box.
2. **Switch on Flexbox.** Change only the parent's `display`, keeping the same
   three children and HTML. Establish the default row.
3. **Choose a direction.** Toggle `row` / `column`; follow the numbered children.
4. **Name the axes.** Main follows the direction; cross goes across it. Rotate
   labelled arrows without introducing alignment controls yet.
5. **Move along the main axis.** In a row, change only `justify-content` between
   `flex-start`, `center`, `flex-end`. Keep room around fixed-size children.
6. **Distribute spare space.** Introduce `space-between` separately. Compare it
   with `flex-start`; first/last children reach the parent's inner edges.
7. **Move across the main axis.** In the same row, change only `align-items`.
   The main-axis positions stay put. Make the parent's extra height visible.
8. **Turn the axes.** Hold `justify-content: center; align-items: flex-start`
   steady and change direction only. Show why justify is not always horizontal
   and align is not always vertical. Include a predict/reveal checkpoint.
9. **Explain stretching.** Use children with automatic width/height. Compare the
   default `stretch` with `center`; distinguish it from earlier fixed-size boxes.
10. **Find room to move.** Hold row / align center steady; change parent height
    only. A parent just tall enough for its children has no spare vertical room.
11. **Add a gap.** Change only `gap`, starting at zero. It separates children;
    it does not add padding around the parent.
12. **Gap versus distributed space.** Keep gap at 16px, compare start and
    space-between, then resize the parent. Measure actual separation so learners
    can see that space-between may make it larger than the specified gap.
13. **Combine known ideas.** A full explorer is introduced only now. Follow three
    small recipes and explain the chosen axes.
14. **Write CSS.** Reuse Live Code Example for a small toolbar, editing one
    declaration per step. HTML and CSS stay available; reset/playground work as
    usual. Include answer guidance.
15. **Review and apply.** Common mistakes, a compact axis/property reference,
    ten-question saved quiz, then four written/code tasks with saved drafts and
    answer guides. Split tasks into individual teacher slides.

Scope: display prerequisite, row/column, justify start/center/end/space-between,
align start/center/end/stretch, one-value gap. Defer reverse directions,
wrapping, grow/shrink/basis, order, align-self, align-content and baselines.

## Implementation

- Static teaching content and initial diagrams remain readable without JS.
- `javascript/core/flex-explorer.js` progressively enhances authored
  `[data-flex-explorer]` markup. Native labelled controls, polite text feedback,
  text-labelled solid/dashed axis arrows, reset per example, no drag dependency.
- `javascript/data/flexbox-examples.js` supplies each stage's defaults, visible
  code declarations and explanation. Early stages expose just one control.
- `css/flex-explorer.css` styles real browser Flexbox layout, not a simulated
  coordinate model. Diagram boxes keep their DOM identity as controls change.
- Axis labels and explanations assume horizontal LTR writing, explicitly stated
  in the lesson; the component enforces that scope for its previews.
- Fixed-size examples use 48px children. The stretch example deliberately uses
  automatic cross sizes. Decorative styles are distinguished from parent layout
  code; previews do not introduce hidden gap/padding/alignment changes.
- Teacher opener/dividers reuse the shared shell. No separate slide deck.
- Quiz and practice drafts use the existing localStorage helpers; explorer
  experiments reset on reload.

Reference: [W3C Flexbox specification](https://www.w3.org/TR/css-flexbox-1/),
especially direction, main/cross terminology and alignment. Gap reference:
[CSS Box Alignment gutters](https://www.w3.org/TR/css-align-3/#gaps).

## Verification

Run the existing suite with `node --test tests/*.test.mjs`. The opt-in browser
check in `tests/flexbox-browser.mjs` uses an isolated Chrome debugging target and
a local static server; see its header for commands. It checks actual child
coordinates, axis swaps, auto-size stretching, free space, gap/distribution,
keyboard controls, Live Code, saved quiz/practice, hub discovery, mobile width,
teacher navigation, and readable content with JavaScript disabled.
