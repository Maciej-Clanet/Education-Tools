# Reusable exam technique: explained, balanced judgements

The first example is near the end of
`pages/topics/data-across-multiple-systems.html`, in `#balanced-judgement` and
`#weighing-judgement`. It uses `css/exam-technique.css` and ordinary static HTML;
there is no runtime or duplicate presentation deck. Use one or two normal lesson
sections before exam practice, depending on the amount of worked reasoning.

## What to teach

Build a relevant point into an explained effect on this organisation or person.
Develop a competing concern with the same care. For evaluation, weigh which
effects matter most and justify a decision, including conditions where relevant.
Application belongs throughout the answer, rather than only in its conclusion.
The labels benefit, impact, application, trade-off and judgement are prompts for
reasoning, not five sentences that constitute a complete extended answer.

Change the example for each lesson. Use enough developed points to answer the
specific task. Short explain questions need the requested point and development;
do not automatically add a recommendation to every analysis/discussion or every
high-mark response. Follow the command word and the particular mark scheme.

## Pearson check

Verified on 26 September 2026 against the official
[Computing Unit 2 sample assessment materials](https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/Sample-assessment-material-Unit-2-Fundamentals-Of-Computer-Systems.pdf),
for the 2016 BTEC Level 3 Nationals qualification:

- Q3(d), printed pp. 30–31 (PDF pp. 31–32): 12-mark evaluation. Its upper band
  values relevant technical reasoning, weighing competing considerations in the
  given scenario and a supported conclusion.
- Q3(c), printed p. 29 (PDF p. 30): 8-mark explanation. Its descriptors emphasise
  developed, contextual reasoning without requiring a final decision.

Our interpretation is that the pattern supports evaluation well, provided it
includes weighing and enough developed reasoning. Pearson does not prescribe
this named sequence or guarantee marks for following it. All examples on the
lesson are original, not copied exam answers. This is Computing Unit 2:
Fundamentals of Computer Systems, not the separate BTEC IT Unit 2 assessment.

## Static markup contract

Include the shared stylesheet and use the existing lesson section shell:

```html
<div class="exam-technique">
  <ol class="exam-technique__chain">
    <li><strong>1 · Benefit</strong><p>A relevant change…</p></li>
    <li><strong>2 · Impact</strong><p>…its explained consequence…</p></li>
    <li><strong>3 · Application</strong><p>…why it matters here.</p></li>
  </ol>
  <div class="exam-technique__counter">
    <strong>4 · Trade-off, with its own explained impact</strong>
    <p>A developed competing concern in the same scenario.</p>
  </div>
</div>
```

Use `.exam-technique__weigh` for two labelled considerations,
`.exam-technique__judgement` on a blockquote containing a reasoned decision, and
`.exam-technique__check` for a brief final self-check. Those pieces can be in the
next teaching section. Keep labels visible: colour alone must not convey meaning.
The layout stacks below 680px and inherits site typography/palette preferences.
Put fuller source notes in student revision details, outside the first-teaching
slide. Do not automatically insert this into unrelated lessons.
