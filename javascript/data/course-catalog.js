export const courseCatalog = [
  {
    id: "btec-first-ict",
    shortLabel: "BTEC First ICT",
    title: "Pearson BTEC First Information and Creative Technology",
    level: "Level 1 / Level 2",
    summary:
      "A practical starting point for digital skills, systems understanding, and creating simple media products.",
    storageMode: "Local quiz saves",
    specUrl:
      "https://qualifications.pearson.com/content/dam/pdf/BTEC-Firsts/Information-and-Creative-Technology/2012/Specification-and-sample-assessments/9781446936573_BTECFIRST_L12_CEC_ICT_Iss3.pdf",
    tags: ["networks", "systems", "graphics", "online safety", "hardware"],
    units: [
      {
        title: "Technology Systems Basics",
        topics: ["hardware", "software", "performance", "peripherals"],
      },
      {
        title: "The Online World",
        topics: ["networks", "protocols", "cloud", "security"],
      },
      {
        title: "Creating Digital Products",
        topics: ["graphics", "planning", "audience", "evaluation"],
      },
    ],
  },
  {
    id: "btec-level-3-computing",
    shortLabel: "BTEC Level 3 Computing",
    title: "Pearson BTEC Level 3 National Extended Diploma in Computing",
    level: "Level 3",
    summary:
      "A broader computing route with room for theory, projects, development practice, and more advanced digital systems work.",
    storageMode: "Local progress saves",
    specUrl:
      "https://qualifications.pearson.com/content/dam/pdf/BTEC-Nationals/computing/2016/specification-and-sample-assessments/btec-nat-l3-ext-dip-in-computing-spec.pdf",
    tags: [
      "programming",
      "cyber security",
      "projects",
      "data",
      "systems",
    ],
    units: [
      {
        title: "Computer Systems and Architecture",
        topics: ["cpu", "memory", "storage", "performance"],
      },
      {
        title: "Programming and Solution Design",
        topics: ["algorithms", "logic", "testing", "development"],
      },
      {
        title: "Data, Security, and Project Work",
        topics: ["databases", "cyber security", "documentation", "planning"],
      },
    ],
  },
];
