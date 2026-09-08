# Utility, application, and open source software

## Teaching order

1. What kind of software are we talking about?
2. Purpose vs licence model
3. What is utility software?
4. Anti-malware
5. Backup utilities
6. Disk cleanup and storage utilities
7. Defragmentation utility
8. Compression utilities
9. Encryption utilities
10. Utility software recap
11. What is application software?
12. Productivity applications
13. Creative and media applications
14. Communication and collaboration
15. Specialist application software
16. Utility or application?
17. What is source code?
18. What does open source mean?
19. Purpose vs licence model revisited
20. Open-source strengths
21. Open-source considerations and risks
22. Proprietary software comparison
23. Open source does not mean free
24. Is the most powerful software always best?
25. User and task factors
26. Technical factors
27. Organisational factors
28. Choosing anti-malware
29. Choosing video-editing software
30. Choosing an open-source office suite
31. Choose the software
32. Common exam mistakes
33. Check your understanding
34. Exam-style practice

34 student sections; five teacher-only dividers before utility, application,
source code/open source, choosing software and practice: 39 teacher slides.

Quiz version 2: 14 questions, pass score 10. Fresh quiz storage and exam response
IDs avoid restoring old answers against changed questions. The studio justification
uses the same local draft store as exam responses.

## Teaching and implementation

Utility/application classification is based on main purpose, with individual
utility explanations before recap and application categories before practice.
The matrix separates that purpose from source-code/licence rights and is revisited
after source code and open source are taught. Licence conditions, price and total
cost are distinct; support, compatibility and maintenance are product-specific.

The software-choice material moved from User interfaces is developed through
user/task, technical and organisational factors rather than duplicated. Worked
anti-malware, video and office examples lead into a fictional indie-studio choice.
Accounting selection remains as applied exam practice. OS choice itself remains
outside this lesson.

Six local SVGs in `assets/images/software/` show backup/restore, HDD fragments,
archives, encryption/decryption, productivity tasks and creative tasks. Responsive
HTML provides the matrix, process flows and option cards. Existing shared lesson
navigation, accessibility, teacher slides and quiz/draft storage are reused.

`paired-scenarios.js` now accepts optional `incompleteMessage`, `successMessage`,
`retryMessage` and `explanationsByChoice`; existing interface defaults are unchanged.
Lesson data lives in `javascript/data/software-scenarios.js`. Six classification
pairs test main purpose; the studio activity checks whether a stated priority
matches an option, then gives conditional trade-off feedback. There is no overall
score or universal winner. The written justification is saved locally and is not
automatically marked. Reset choices affects the selects, not the separate draft.

## Checks and limits

- Eight relevant tests pass, including two new regressions for configurable
  feedback/reset and unchanged interface defaults; existing divider tests pass.
- Changed JavaScript syntax, HTML IDs/labels/local links, SVG XML parsing and
  `git diff --check` pass.
- No package manifest or configured lint/build pipeline exists for the static site.
- Browser connection reported no available browser. Live clicks, keyboard
  navigation, quiz/draft persistence, responsive appearance, teacher navigation
  and console output remain manually unverified in this session.
- Deferred: malware analysis, backup strategies, compression/encryption algorithms,
  licence-law detail, package management and procurement policy.

References checked:
- [Open Source Initiative: Open Source Definition](https://opensource.org/osd)
- [LibreOffice: licences](https://www.libreoffice.org/licenses/)
