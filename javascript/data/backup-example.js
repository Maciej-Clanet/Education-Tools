export const backupExample = {
  files: ['students.csv', 'attendance.csv', 'courses.csv', 'contacts.csv'],
  days: [
    { label: 'Monday', changed: [] },
    { label: 'Tuesday', changed: ['attendance.csv'] },
    { label: 'Wednesday', changed: ['contacts.csv'] },
    { label: 'Thursday', changed: ['courses.csv'] },
  ],
}
