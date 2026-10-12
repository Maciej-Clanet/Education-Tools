# Flexbox: wrapping and children

Lesson: [student page](../../pages/topics/flexbox-wrapping-and-children.html). Web Development CSS Basics: wrapping and child properties.
Prerequisites: Flexbox Basics parent layout and axis vocabulary.
Authoring: the linked HTML and its page script.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Covered** — nowrap/wrap and reflow as parent width changes. (`wrap`)
2. **Covered** — Flex item versus flex parent; nested elements can have both roles. (`child-roles`)
3. **Covered** — flex-grow and sharing extra room; factor is not final-width ratio. (`grow`)
4. **Covered** — Default shrinking, protecting one child and refusing shrink; local overflow and minimum-size limits. (`shrink`)
5. **Covered** — flex:auto and flex:none after grow/shrink; flex:1 as a qualified sharing shortcut. (`flex-presets`)
6. **Covered** — Override one child's cross-axis alignment, auto inheritance and axis changes. (`align-self`)
7. **Covered** — Distribute extra room separately on each wrapped line. (`wrap-grow`)
8. **Practice** — Build flexible nested cards; misconceptions, reference, quiz and written/code tasks. (`live-code`)

## Boundaries

No flex-basis or three-value flex syntax yet. Shrinking depends on starting size as well as factor; arbitrary shrink-ratio calculations are not required. flex:1 does not guarantee equal visible widths with all content/minimum constraints; wrapping plus growth is not a rigid grid.

## References

- [W3C Flexbox](https://www.w3.org/TR/css-flexbox-1/)
