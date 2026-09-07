# Hardware performance and component choice

One lesson page, 53 teacher slides. Part 1 starts with the numbered open-PC
map on slide 3; Part 2 has a separate divider on slide 28. Demonstration
prompts use native details elements displayed only in teacher mode.

## Slide order

1. What makes hardware “good”?
2. From requirement to hardware choice
3. Part 1 — Inside the computer
4. Motherboard: the system’s connection point
5. Motherboard specifications and compatibility
6. CPU: what it actually does
7. CPU clock speed
8. CPU cores
9. CPU threads
10. Why CPU cache exists
11. CPU heat and sustained performance
12. How CPU cooling works
13. Case airflow and system cooling
14. RAM: the active working area
15. RAM capacity
16. RAM speed and bandwidth
17. Memory channels
18. RAM compatibility
19. CPU versus GPU
20. Integrated versus dedicated graphics
21. GPU specifications and VRAM
22. PSU: supplying the system
23. PSU wattage
24. PSU efficiency and connectors
25. Case size, airflow and physical fit
26. A computer is a system
27. Storage performance recap
28. Part 2 — Beyond the PC
29. What makes a display suitable?
30. Display resolution
31. Refresh rate
32. Response time
33. Brightness, contrast and colour
34. Choosing a display
35. What makes a printer suitable?
36. Inkjet versus laser
37. Print quality: DPI
38. Printer speed and first-page-out time
39. Duty cycle: workload, not speed
40. Printer running cost
41. Choosing a printer
42. Ports and connectivity
43. User needs and user experience
44. Powerful but incompatible?
45. Cost and efficiency
46. Implementation and productivity
47. Security and accessibility
48. How to justify a hardware recommendation
49. Worked example: college media workstation
50. Build the right system
51. Common exam mistakes
52. Check your understanding
53. Exam-style practice

## System builder

`javascript/pages/hardware-system-builder.js` keeps fictional product options,
scenario requirements, pure budget/compatibility evaluation and native form
rendering together. Office (£600) and design (£1,200) drafts persist separately
through the shared storage helper. No shared lesson-shell changes were needed.
Run `node --test tests/hardware-system-builder.test.mjs` for the budget and
compatibility regression checks.

## Accuracy references

- [Intel: CPU clock speed](https://www.intel.com/content/www/us/en/gaming/resources/cpu-clock-speed.html)
- [HP: maximum duty cycle and recommended monthly volume](https://support.hp.com/us-en/product/product-specs/model/4346179)
- [USB-IF: cable and connector capabilities](https://www.usb.org/cable_connector)
