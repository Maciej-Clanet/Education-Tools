# Flexbox: wrapping and children

Lesson: `pages/topics/flexbox-wrapping-and-children.html`, directly after Flexbox
Basics. Keep its parent/child vocabulary and predict → change → explain routine.
Quiz: 12 questions, pass 10, version 1. Experiments reset; quiz and written drafts
save through the shared lesson shell.

## Sequence and teaching choices

1. **Allow another line.** Show four cards in a narrow parent. Their familiar
   minimum widths stop them squeezing smaller. Toggle only nowrap/wrap on the
   parent. No new child properties yet.
2. **Resize the parent.** Keep wrap enabled; change available width. The same
   children reflow, with gap between neighbours and lines. Wrap keeps a row
   direction; it does not switch the parent to column.
3. **Separate two roles.** A nested HTML/box example shows the middle child as
   a flex item of the outer parent. Its own two children remain normal blocks.
   Toggle display on that middle child only: now it can also be a flex parent.
   Being a flex item does not inherit display:flex.
4. **Grow one child.** Keep the parent wide. Change child 2's flex-grow 0 → 1;
   siblings retain their starting widths. The child remains display:block.
5. **Share the extra room.** Start all children at the same width, all grow 1;
   change only the middle grow factor to 2. Show measured additions. A factor
   of 2 means twice the extra space, not twice the final width.
6. **Shrink when space runs out.** Children request 120px each; their default
   shrink factor is 1. Narrow only the parent. Show requested and actual widths.
7. **Protect one child.** Change only child 2's shrink 1 → 0; others absorb the
   shortage. Explain that shrink depends on starting size as well as factor;
   the equal-size example keeps the first explanation simple. Do not teach
   arbitrary shrink-ratio calculations.
8. **Refuse to shrink.** Change all shrink factors to zero. Keep nowrap and show
   honest overflow in a keyboard-scrollable diagram, not clipped content or a
   page-wide scrollbar. Minimum sizes/long content can also limit shrinking.
9. **Use a combined setting.** Teach flex:auto (grow and shrink using width or
   content as the starting point) and flex:none (neither). Compare wide/narrow
   parents only after both behaviours have been learned separately.
10. **A sharing shortcut.** Compare flex:auto and flex:1 on three children with
    unequal width declarations. flex:1 shares from an equal starting point in
    this simple row; it does more than turn on grow. Short content and matching
    minimum sizes avoid suggesting that all real-world content must become
    equally wide. No three-value syntax or flex-basis teaching in this lesson.
11. **Align one child.** Parent align-items sets the group default; child 2's
    align-self selects auto/start/centre/end/stretch. Auto follows the parent;
    stretch uses an automatic cross size. Only the selected child moves.
12. **Turn the cross axis.** Keep child 2's align-self:center; toggle direction.
    In a column this moves it horizontally, with siblings at cross-start.
13. **Combine wrapping and growth.** A wrap row shares spare room independently
    on each line. A lone last child can grow across its own line; this is not a
    rigid grid. Change only grow now that the parts are familiar.
14. **Write real CSS.** A Live Code card example combines wrap, flex:auto and an
    inner flex parent in separate numbered edits. Follow with misconceptions,
    a parent/child reference, quick quiz and four written/code tasks.

## Implementation contract

Reuse `initFlexExplorers` and `css/flex-explorer.css`. Configs in
`javascript/data/flexbox-child-examples.js` add optional `parentStyles(state)`,
`children(state)` (one style object per direct child), `code(state)` and
`measure(state, geometry)` functions. Geometry is measured from real browser
layout, never a second simulation. `height: 'auto'` supports wrapping parents.
Authored initial child styles are restored before each render, preventing a
shorthand from leaving stale longhands. ResizeObserver refreshes measurements
after viewport changes and entering Teacher Slides. Labels and controls are
static HTML; scripts enable them. Parent/child declarations are visible together.

`css/flexbox-lesson.css` holds the two lessons' shared teaching cards and code
styles. New diagram children use normal block display, not flex/grid centring.
Numeric examples use short labels and explicitly visible min-width:0 where
needed; outlines do not alter the measured width arithmetic. Overflow is local
to a named, focusable diagram region. Parent widths are capped by available
screen space, which measurements and captions make clear.

Reference: [W3C Flexbox](https://www.w3.org/TR/css-flexbox-1/), especially sections
4 (items), 5.2 (wrap), 7.1.1 (flex presets), 7.2 (grow/shrink), and 8.3 (self
alignment). Authoring note only: flex-basis is intentionally deferred. Neither
student explanations nor assessments require its name or syntax.

## Verification

- Existing suite: `node --test tests/*.test.mjs`.
- Browser regression: `node tests/flexbox-browser.mjs`.
- Follow-on lesson: `node tests/flexbox-children-browser.mjs`, using the same
  isolated browser and local server setup documented in the first check.
- Check real wrapping, child display roles, growth additions, default/protected
  shrinking, overflow, shorthand switches/resets, self-alignment in both axes,
  line-by-line growth, keyboard input, mobile containment, code editing, quiz
  persistence, navigation, Teacher Slides and static fallback.
