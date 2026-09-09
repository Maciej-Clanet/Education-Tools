export const collegeImpacts = [
  {
    statement: 'Teachers can see current attendance immediately, without waiting for the office.',
    acceptedPairs: [['access', 'benefit'], ['productivity', 'benefit']],
    explanation: 'Access improves because teachers can reach current records. Productivity can improve because they spend less time waiting and can follow up absences sooner.',
  },
  {
    statement: 'Staff need paid training sessions before the new system launches.',
    acceptedPairs: [['implementation', 'concern'], ['cost', 'concern']],
    explanation: 'Implementation includes preparing users. Paid training also uses money and staff time. Here the concern is the resource needed before launch; training can produce later benefits.',
  },
  {
    statement: 'More devices can reach sensitive student records, so more possible routes for unauthorised access need protection.',
    acceptedPairs: [['security', 'concern']],
    explanation: 'The stated concern is security: more routes need protection. Wider access can be useful, but this consequence specifically describes exposure of sensitive records.',
  },
  {
    statement: 'Staff no longer enter the same contact details into several systems, saving time on each update.',
    acceptedPairs: [['productivity', 'benefit'], ['cost', 'benefit']],
    explanation: 'Productivity improves through less duplicate entry. This can also reduce the staff-time cost of each update, although it does not guarantee a smaller wage bill.',
  },
  {
    statement: 'The college must budget for data migration, continuing support and cloud hosting.',
    acceptedPairs: [['cost', 'concern'], ['implementation', 'concern']],
    explanation: 'Cost includes introducing and operating the system. Migration also links to implementation: records must move correctly. Support and hosting continue after launch.',
  },
  {
    statement: 'Shared permissions make access easier to control, but a compromised account with broad permissions could expose records used by many departments.',
    acceptedPairs: [['security', 'both'], ['access', 'both']],
    explanation: 'There is a security benefit from consistent control and a concern about the reach of a compromised account. Access is also relevant: the scope of permissions determines which records can be reached. The balance depends on how permissions are designed.',
  },
]
