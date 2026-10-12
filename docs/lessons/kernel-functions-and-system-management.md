# Kernel functions and system management

Lesson: [student page](../../pages/topics/kernel-functions-and-system-management.html). Unit 2 A2: kernel and wider OS responsibilities.
Authoring: the linked HTML and its page script.
Depth: [definitions](../lesson_authoring.md#coverage-outline-format). Section IDs below refer to the lesson page.

## Coverage in order

1. **Introduced** — Kernel purpose and application/kernel/hardware relationships. (`overview`)
2. **Covered** — Program versus process; starting, running and ending a process. (`program-execution`)
3. **Covered** — Processor privilege, user/kernel modes and system calls. (`restrictions`)
4. **Developed** — Interrupt purpose and handling sequence; named registers and interrupt priorities are deferred to B3. (`interrupts-modes`)
5. **Covered** — RAM allocation, protection and reclamation. (`memory-multitasking`)
6. **Covered** — Multitasking and CPU time slicing. (`multitasking`)
7. **Introduced** — Multiple cores; detailed multiprocessing/threading belongs in B2. (`multicore`)
8. **Practice** — Combine multitasking and memory management. (`resources-together`)
9. **Covered** — Storage requests, disk-access coordination, file-system records and opening/saving files. (`storage-drivers`)
10. **Developed** — FAT32/NTFS as contrasting examples, without filesystem engineering. (`fat32-ntfs`)
11. **Covered** — Device drivers and request translation. (`why-drivers`)
12. **Practice** — Kernel-function recap. (`kernel-map`)
13. **Covered** — Wider OS networking and security responsibilities, supported by kernel mechanisms. (`system-management`)
14. **Practice** — Integrated saving sequence, mechanism-selection control room, misconceptions, quiz and written tasks. (`save-image`)

## Boundaries

RAM blocks/time slices are illustrative. User/kernel mode is not an application permission setting; drivers need not all run in the kernel. Scheduling algorithms, paging internals, protocol configuration and security administration are outside this lesson.

## References

- [Microsoft: user and kernel modes](https://learn.microsoft.com/en-us/windows-hardware/drivers/gettingstarted/user-mode-and-kernel-mode)
- [Microsoft: processes and threads](https://learn.microsoft.com/en-us/windows/win32/procthread/about-processes-and-threads)
- [Microsoft: interrupt service routines](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/introduction-to-interrupt-service-routines)
- [Microsoft: file-system comparison](https://learn.microsoft.com/en-us/windows/win32/fileio/filesystem-functionality-comparison)
