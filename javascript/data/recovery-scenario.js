export const collegeRecovery = {
  copies: [
    { id: 'thursday', label: 'Thursday · 23:00', description: 'Checked copy from before the corruption.', usable: true },
    { id: 'friday', label: 'Friday · 15:30', description: 'Newer copy, but already includes the corrupted records.', usable: false },
  ],
  steps: [
    { title: 'Identify and contain', heading: 'Stop the damage before restoring', text: 'Friday, 15:40: staff report unreadable records. Checks show corruption started at 15:20. Take the affected service out of use and prepare a clean recovery environment.', action: 'Contain the problem', source: 'Copies available', recovery: 'Not yet prepared', service: 'Unavailable' },
    { title: 'Select a usable copy', heading: 'Newest does not always mean usable', text: 'Choose a copy from before the damage. In this example, Thursday’s required backup sets are complete and have passed checks.', action: 'Restore selected copy', source: 'Choose a recovery point', recovery: 'Clean environment ready', service: 'Kept out of use' },
    { title: 'Restore', heading: 'The data has been copied back', text: 'Thursday’s records are now in the recovery environment. The student service remains closed until the data and access controls have been checked.', action: 'Check the restored system', source: 'Thursday · 23:00', recovery: 'Restored · not yet verified', service: 'Awaiting checks' },
    { title: 'Verify', heading: 'Checks show the service is usable', text: 'The expected student records are present, sample class lists open correctly and staff permissions work. Friday’s later attendance changes are missing, as expected from this recovery point.', action: 'Return service to staff', source: 'Source retained', recovery: 'Data and access checks passed', service: 'Ready to reopen' },
    { title: 'Return service', heading: 'Staff can work again', text: 'Reopen the service, monitor it and record the missing Friday work. Re-enter missing attendance only from a reliable source, such as an authorised temporary register.', source: 'Backup retained', recovery: 'Recovery documented', service: 'Available · monitor use' },
  ],
}
