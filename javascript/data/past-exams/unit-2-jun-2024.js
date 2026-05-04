export const unit2Jun2024Exam = {
  id: "btec-level-3-unit-2-jun-2024",
  unitId: "btec-level-3-unit-2",
  title: "BTEC Level 3 Computing Unit 2 - June 2024 Practice Paper",
  shortTitle: "June 2024 practice paper",
  qualification: "Pearson BTEC Level 3 National Computing",
  paperReference: "31769H",
  dateLabel: "Monday 10 June 2024",
  durationMinutes: 105,
  totalMarks: 80,
  unlockPassword: "unit2-jun2024",
  version: 1,
  markingModeLabel: "Practice marking preview",
  groups: [
    {
      id: "q1",
      title: "Question 1",
      totalMarks: 20,
      scenarioHtml: `
        <p>Ruben runs a day nursery. The nursery provides childcare for children under the age of six.</p>
        <p>Ruben is upgrading the computer systems used in the nursery.</p>
        <p>The computer systems will be used for:</p>
        <ul>
          <li>communicating with parents and the wider community</li>
          <li>basic computer literacy education for the children</li>
          <li>administrative tasks</li>
        </ul>
      `,
      parts: [
        {
          id: "q1a",
          label: "1(a)",
          marks: 3,
          promptHtml:
            "<p>Ruben has provided desktop PCs for use by the staff and children.</p><p>Give <strong>three</strong> advantages of desktop PCs compared to laptops.</p>",
          response: {
            type: "list",
            count: 3,
            label: "Advantage",
            rows: 2,
          },
          rubric: {
            type: "points",
            maxMarks: 3,
            points: [
              {
                label: "Easier to upgrade or replace individual components",
                terms: [["upgrade"], ["replace", "component"], ["peripheral"]],
              },
              {
                label: "Lower cost for a comparable specification",
                terms: [
                  ["cheaper", "spec"],
                  ["cost", "same spec"],
                  ["less expensive", "performance"],
                ],
              },
              {
                label:
                  "Larger screens or better cooling/performance for fixed use",
                terms: [
                  ["larger", "screen"],
                  ["cooling"],
                  ["better", "performance"],
                ],
              },
              {
                label:
                  "Less likely to be lost or stolen because they are fixed in place",
                terms: [
                  ["less", "stolen"],
                  ["not", "portable"],
                  ["fixed", "place"],
                  ["less", "lost"],
                ],
              },
            ],
            examinerTip:
              "The examiner report warns that vague claims such as simply 'faster' or 'cheaper' need qualification. Tie the advantage to comparable specification, fixed location, upgradeability, or form factor.",
          },
        },
        {
          id: "q1b",
          label: "1(b)",
          marks: 3,
          promptHtml: `
            <p>The staff must keep records of each child's progress. Copies of the records are sent to the children's parents or guardians.</p>
            <p>These records include:</p>
            <ul>
              <li>copies of drawings and writing the child has done</li>
              <li>written reports</li>
              <li>details of the child's progress against specified learning goals</li>
            </ul>
            <p>State <strong>three</strong> features of word processing software that would help the staff when creating the records.</p>
          `,
          response: {
            type: "list",
            count: 3,
            label: "Feature",
            rows: 2,
          },
          rubric: {
            type: "points",
            maxMarks: 3,
            points: [
              {
                label: "Insert images, scans, photos, graphs, or charts",
                terms: [["image"], ["photo"], ["scan"], ["chart"], ["graph"]],
              },
              {
                label:
                  "Use formatting features such as tables, headings, bold text, or templates",
                terms: [
                  ["format"],
                  ["table"],
                  ["bold"],
                  ["template"],
                  ["heading"],
                ],
              },
              {
                label:
                  "Mail merge or personalised fields for parent/child details",
                terms: [
                  ["mail merge"],
                  ["personalise"],
                  ["field"],
                  ["child", "details"],
                ],
              },
              {
                label: "Print, export, share, email, or collaborate on records",
                terms: [
                  ["print"],
                  ["share"],
                  ["email"],
                  ["collaborat"],
                  ["export"],
                  ["save"],
                ],
              },
            ],
            examinerTip:
              "The examiner report says many students named formatting techniques but missed broader word processor features. Name the feature clearly, then connect it to nursery records.",
          },
        },
        {
          id: "q1c",
          label: "1(c)",
          marks: 4,
          promptHtml:
            "<p>Ruben has chosen to use open source word processing software in the nursery.</p><p>Explain <strong>two</strong> possible drawbacks of using open source software to create the records.</p>",
          response: {
            type: "list",
            count: 2,
            label: "Drawback",
            rows: 4,
          },
          rubric: {
            type: "points",
            maxMarks: 4,
            points: [
              {
                label: "Compatibility or file format issues with other systems",
                terms: [
                  ["compatib"],
                  ["file format"],
                  ["open", "proprietary"],
                  ["document", "format"],
                ],
              },
              {
                label: "Missing features or staff training/time needed",
                terms: [
                  ["feature"],
                  ["training"],
                  ["familiar"],
                  ["learn"],
                  ["staff", "unsure"],
                ],
              },
              {
                label: "Less formal support or smaller development community",
                terms: [
                  ["support"],
                  ["community"],
                  ["developer"],
                  ["help"],
                  ["small", "team"],
                ],
              },
              {
                label:
                  "Security risks from public source code or infrequent updates",
                terms: [
                  ["source code", "security"],
                  ["vulnerab"],
                  ["update"],
                  ["exploit"],
                ],
              },
            ],
            examinerTip:
              "For open source security, the issue is not that strangers can edit the nursery's files. The stronger point is that source code visibility can help attackers find weaknesses if updates and support are weak.",
          },
        },
        {
          id: "q1d",
          label: "1(d)",
          marks: 2,
          promptHtml: `
            <p>The nursery is open six days a week, Monday to Saturday.</p>
            <p>Figure 1 shows the number of children who attend the nursery each day for two weeks. The data is represented as matrices.</p>
            <figure class="exam-figure">
              <figcaption>Figure 1</figcaption>
              <div class="matrix-pair" aria-label="Week 1 and Week 2 attendance matrices">
                <div>
                  <strong>Week 1</strong>
                  <table class="matrix-table"><tr><td>26</td><td>34</td></tr><tr><td>42</td><td>27</td></tr><tr><td>21</td><td>26</td></tr></table>
                </div>
                <span class="matrix-plus">+</span>
                <div>
                  <strong>Week 2</strong>
                  <table class="matrix-table"><tr><td>29</td><td>19</td></tr><tr><td>42</td><td>41</td></tr><tr><td>32</td><td>18</td></tr></table>
                </div>
              </div>
            </figure>
            <p>Calculate the total daily attendance using matrices. You must show your working.</p>
          `,
          response: {
            type: "matrix-calculation",
            rows: 3,
            columns: 2,
            workingLabel: "Matrix addition working",
            resultLabel: "Final total attendance matrix",
            note: "Digital scaffold: use these boxes to enter the matrix addition and final matrix. In the real paper these boxes would not be provided; you would set out or draw the matrices yourself.",
            placeholders: [
              ["26 + 29", ""],
              ["", ""],
              ["", ""],
            ],
          },
          rubric: {
            type: "calculation",
            maxMarks: 2,
            requiredNumbers: ["55", "53", "84", "68", "53", "44"],
            workingTerms: [
              ["26", "29"],
              ["34", "19"],
              ["42", "42"],
              ["27", "41"],
            ],
            examinerTip:
              "The mark scheme gives one mark for using matrices in the calculation and one mark for the final daily totals: 55, 53, 84, 68, 53, 44.",
          },
        },
        {
          id: "q1e",
          label: "1(e)",
          marks: 1,
          promptHtml: `
            <p>Figure 2 shows the total daily attendance for April represented as a matrix.</p>
            <figure class="exam-figure">
              <figcaption>Figure 2</figcaption>
              <div class="matrix-pair matrix-pair--single">
                <div>
                  <strong>April</strong>
                  <table class="matrix-table"><tr><td>130</td><td>170</td></tr><tr><td>166</td><td>112</td></tr><tr><td>84</td><td>108</td></tr></table>
                </div>
              </div>
            </figure>
            <p>The matrix in Figure 2 must be stored in memory as an array.</p>
            <p>Write the matrix as an array using row-major order.</p>
          `,
          response: {
            type: "input",
            label: "Row-major array",
            placeholder: "",
          },
          rubric: {
            type: "sequence",
            maxMarks: 1,
            requiredNumbers: ["130", "170", "166", "112", "84", "108"],
            examinerTip:
              "Row-major order reads each row from left to right before moving to the next row.",
          },
        },
        {
          id: "q1f",
          label: "1(f)",
          marks: 4,
          promptHtml: `
            <p>Figure 3 shows the data for three other months represented as a two-dimensional array.</p>
            <figure class="exam-figure">
              <figcaption>Figure 3</figcaption>
              <table class="data-table">
                <thead><tr><th>Month</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead>
                <tbody>
                  <tr><th>January</th><td>135</td><td>161</td><td>158</td><td>102</td><td>96</td><td>103</td></tr>
                  <tr><th>February</th><td>108</td><td>140</td><td>153</td><td>138</td><td>115</td><td>110</td></tr>
                  <tr><th>March</th><td>121</td><td>138</td><td>120</td><td>109</td><td>125</td><td>123</td></tr>
                </tbody>
              </table>
            </figure>
            <p>Explain <strong>two</strong> reasons why a two-dimensional array is a suitable data structure to store this data.</p>
          `,
          response: {
            type: "list",
            count: 2,
            label: "Reason",
            rows: 4,
          },
          rubric: {
            type: "points",
            maxMarks: 4,
            points: [
              {
                label:
                  "The data is one type, such as integer attendance values",
                terms: [
                  ["integer"],
                  ["same", "data type"],
                  ["single", "data type"],
                ],
              },
              {
                label:
                  "The structure is fixed and predictable: three months by six days",
                terms: [
                  ["fixed"],
                  ["six", "days"],
                  ["three", "months"],
                  ["predictable"],
                ],
              },
              {
                label:
                  "Indexes can consistently represent day and month positions",
                terms: [["index"], ["row"], ["column"], ["month", "day"]],
              },
              {
                label:
                  "A two-dimensional structure stores month and day as separate dimensions",
                terms: [
                  ["two-dimensional"],
                  ["2d"],
                  ["dimension"],
                  ["month", "day"],
                ],
              },
            ],
            examinerTip:
              "The answer needs both the feature of the array and why it suits this attendance data.",
          },
        },
        {
          id: "q1g",
          label: "1(g)",
          marks: 3,
          promptHtml:
            "<p>The attendance data goes through data validation functions before it is processed.</p><p>Explain why data should be validated.</p>",
          response: {
            type: "textarea",
            rows: 6,
            label: "Answer",
          },
          rubric: {
            type: "points",
            maxMarks: 3,
            points: [
              {
                label: "Validation checks data is sensible or meets rules",
                terms: [
                  ["sensible"],
                  ["rule"],
                  ["valid"],
                  ["within"],
                  ["format"],
                ],
              },
              {
                label: "Validation reduces input or processing/runtime errors",
                terms: [["error"], ["mistake"], ["incorrect"], ["invalid"]],
              },
              {
                label:
                  "Validation alerts the user or stops unsuitable data being processed",
                terms: [
                  ["alert"],
                  ["warn"],
                  ["reject"],
                  ["before", "processed"],
                  ["stop"],
                ],
              },
            ],
            examinerTip:
              "Push beyond 'checks data'. Explain that validation uses rules and reduces processing errors before data is used.",
          },
        },
      ],
    },
    {
      id: "q2",
      title: "Question 2",
      totalMarks: 20,
      scenarioHtml: `
        <p>A local healthcare charity is upgrading its computer systems.</p>
        <p>The charity provides support and advice to elderly people and people with specific medical needs.</p>
        <p>The charity employs six nurses who share their time working remotely, working in the charity's office, and visiting and supporting people in their own homes.</p>
        <p>The charity intends to use a cloud-based server to support the tasks that staff must carry out.</p>
      `,
      parts: [
        {
          id: "q2a",
          label: "2(a)",
          marks: 2,
          promptHtml:
            "<p>State <strong>two</strong> ways that the nurses could connect their devices to the cloud-based server when they are not in the office.</p>",
          response: {
            type: "list",
            count: 2,
            label: "Connection method",
            rows: 2,
          },
          rubric: {
            type: "points",
            maxMarks: 2,
            points: [
              {
                label: "Mobile broadband such as 4G or 5G",
                terms: [["4g"], ["5g"], ["mobile broadband"], ["cellular"]],
              },
              {
                label: "Wi-Fi such as public, home, or hotspot connection",
                terms: [
                  ["wi-fi"],
                  ["wifi"],
                  ["hotspot"],
                  ["home network"],
                  ["lan"],
                ],
              },
            ],
            examinerTip:
              "The mark scheme accepts specific connection methods, not vague statements such as 'use the internet'.",
          },
        },
        {
          id: "q2b",
          label: "2(b)",
          marks: 4,
          promptHtml:
            "<p>The cloud-based server allows staff to access data held on the server using any device if they have an internet connection.</p><p>Explain <strong>two other</strong> reasons why the charity would choose to use a cloud-based server.</p>",
          response: {
            type: "list",
            count: 2,
            label: "Reason",
            rows: 4,
          },
          rubric: {
            type: "points",
            maxMarks: 4,
            points: [
              {
                label:
                  "The provider handles maintenance, upgrades, backups, or security",
                terms: [
                  ["maintain"],
                  ["upgrade"],
                  ["backup"],
                  ["security"],
                  ["provider"],
                ],
              },
              {
                label:
                  "Resources can scale up or down as the charity's needs change",
                terms: [
                  ["scale"],
                  ["scalable"],
                  ["increase"],
                  ["decrease"],
                  ["need", "change"],
                ],
              },
              {
                label:
                  "Lower initial cost and fewer physical server devices in the office",
                terms: [
                  ["lower", "cost"],
                  ["initial", "cost"],
                  ["less", "hardware"],
                  ["space"],
                  ["physical"],
                ],
              },
              {
                label:
                  "Data is off-site, reducing localised loss from fire, flood, or office damage",
                terms: [
                  ["off-site"],
                  ["off site"],
                  ["fire"],
                  ["flood"],
                  ["data loss"],
                ],
              },
            ],
            examinerTip:
              "The examiner report says many answers repeated remote access. This part asks for other reasons, such as maintenance, scaling, cost, or off-site resilience.",
          },
        },
        {
          id: "q2c",
          label: "2(c)",
          marks: 4,
          promptHtml:
            "<p>In addition to the cloud-based server, the charity requires a number of different physical devices, such as laptops and tablets.</p><p>Explain <strong>two</strong> utility software applications that could be used to protect the devices and data.</p>",
          response: {
            type: "list",
            count: 2,
            label: "Utility software",
            rows: 4,
          },
          rubric: {
            type: "points",
            maxMarks: 4,
            points: [
              {
                label: "Firewall to prevent unauthorised network connections",
                terms: [
                  ["firewall"],
                  ["unauthorised", "connection"],
                  ["unauthorized", "connection"],
                ],
              },
              {
                label: "Anti-malware to detect or block malicious software",
                terms: [
                  ["anti-malware"],
                  ["antivirus"],
                  ["virus"],
                  ["malware"],
                  ["malicious"],
                ],
              },
              {
                label: "Encryption or VPN to secure data and connections",
                terms: [
                  ["encrypt"],
                  ["vpn"],
                  ["secure", "connection"],
                  ["unreadable"],
                ],
              },
              {
                label: "Network monitoring or password manager utility",
                terms: [
                  ["monitor"],
                  ["log"],
                  ["password manager"],
                  ["complex", "password"],
                ],
              },
            ],
            examinerTip:
              "Name the utility and explain how it protects. The mark scheme does not accept backup as a utility for this question.",
          },
        },
        {
          id: "q2d",
          label: "2(d)",
          marks: 3,
          promptHtml:
            "<p>Data compression is used when transferring data between the cloud-based server and connected devices.</p><p>Describe how data compression could improve data transmission speed.</p>",
          response: {
            type: "textarea",
            rows: 5,
            label: "Answer",
          },
          rubric: {
            type: "points",
            maxMarks: 3,
            points: [
              {
                label: "Compression removes unnecessary or repeated data",
                terms: [["remove"], ["repeat"], ["unnecessary"], ["compress"]],
              },
              {
                label: "The file size becomes smaller",
                terms: [
                  ["file size"],
                  ["smaller"],
                  ["reduce", "size"],
                  ["less data"],
                ],
              },
              {
                label:
                  "Less bandwidth/data is needed, so transfer can be faster",
                terms: [
                  ["bandwidth"],
                  ["transfer"],
                  ["transmission"],
                  ["faster"],
                  ["speed"],
                ],
              },
            ],
            examinerTip:
              "A full answer builds the chain: remove/reduce data, smaller file, less to transmit, faster transfer.",
          },
        },
        {
          id: "q2e",
          label: "2(e)",
          marks: 3,
          promptHtml: `
            <p>The cloud-based server uses multi-factor authentication to protect user accounts.</p>
            <p>Users must first enter their username. They must then also enter:</p>
            <ul>
              <li>their password and either</li>
              <li>a 6-digit code that they receive by text message or the answer to a security question.</li>
            </ul>
            <p>Complete the table to show the logic for the given scenarios.</p>
          `,
          response: {
            type: "table",
            columns: [
              "Username",
              "Password",
              "6-digit code",
              "Security question",
              "Access granted?",
            ],
            rows: [
              {
                id: "row1",
                cells: ["TRUE", "TRUE", "TRUE", "FALSE"],
                answer: true,
              },
              {
                id: "row2",
                cells: ["TRUE", "FALSE", "FALSE", "TRUE"],
                answer: true,
              },
              {
                id: "row3",
                cells: ["TRUE", "TRUE", "FALSE", "TRUE"],
                answer: true,
              },
            ],
            options: ["TRUE", "FALSE"],
          },
          rubric: {
            type: "exact-table",
            maxMarks: 3,
            answers: {
              "q2e-row1": "TRUE",
              "q2e-row2": "FALSE",
              "q2e-row3": "TRUE",
            },
            examinerTip:
              "Access is granted only when the username and password are correct, plus one of the second factors is correct.",
          },
        },
        {
          id: "q2f",
          label: "2(f)",
          marks: 4,
          promptHtml: `
            <p>The cloud service provider is developing a script to automatically generate a username for a new user.</p>
            <p>Figure 4 shows a flow chart that represents the logic that will be used to develop the script.</p>
            <figure class="exam-figure">
              <figcaption>Figure 4</figcaption>
              <svg
                class="flowchart-svg"
                viewBox="0 0 500 654"
                role="img"
                aria-label="Username generation flow chart"
              >
                <defs>
                  <marker
                    id="flow-arrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z"></path>
                  </marker>
                </defs>

                <rect class="flow-terminator" x="148" y="12" width="58" height="14" rx="7"></rect>
                <text class="flow-text" x="177" y="19">Start</text>

                <rect class="flow-process" x="142" y="38" width="70" height="26"></rect>
                <text class="flow-text" x="177" y="51">username = ""</text>

                <polygon class="flow-io" points="148,78 222,78 212,112 138,112"></polygon>
                <text class="flow-text" x="180" y="92">User INPUT</text>
                <text class="flow-text" x="180" y="104">givenName</text>

                <polygon class="flow-decision-svg" points="177,124 246,166 177,208 108,166"></polygon>
                <text class="flow-text" x="177" y="157">is length of</text>
                <text class="flow-text" x="177" y="168">givenName</text>
                <text class="flow-text" x="177" y="179">&gt;=3?</text>

                <rect class="flow-process" x="4" y="153" width="88" height="26"></rect>
                <text class="flow-text" x="48" y="166">username = "Error"</text>
                <text class="flow-label" x="102" y="157">No</text>

                <rect class="flow-process" x="130" y="224" width="98" height="43"></rect>
                <text class="flow-text" x="179" y="239">APPEND letters 1 to 3</text>
                <text class="flow-text" x="179" y="251">IN givenName</text>
                <text class="flow-text" x="179" y="263">TO username</text>
                <text class="flow-label" x="188" y="219">Yes</text>

                <polygon class="flow-io" points="148,284 225,284 215,318 138,318"></polygon>
                <text class="flow-text" x="181" y="298">User INPUT</text>
                <text class="flow-text" x="181" y="310">familyName</text>

                <polygon class="flow-decision-svg" points="179,332 248,374 179,416 110,374"></polygon>
                <text class="flow-text" x="179" y="365">is length of</text>
                <text class="flow-text" x="179" y="376">familyName</text>
                <text class="flow-text" x="179" y="387">&gt;=4?</text>
                <text class="flow-label" x="190" y="427">Yes</text>
                <text class="flow-label" x="258" y="366">No</text>

                <rect class="flow-process" x="130" y="440" width="98" height="43"></rect>
                <text class="flow-text" x="179" y="455">APPEND letters 1 to 4</text>
                <text class="flow-text" x="179" y="467">IN familyName</text>
                <text class="flow-text" x="179" y="479">TO username</text>

                <rect class="flow-process" x="300" y="351" width="74" height="54"></rect>
                <text class="flow-text" x="337" y="365">extraLetters</text>
                <text class="flow-text" x="337" y="377">=</text>
                <text class="flow-text" x="337" y="389">4 - length of</text>
                <text class="flow-text" x="337" y="399">familyName</text>

                <rect class="flow-process" x="396" y="357" width="100" height="34"></rect>
                <text class="flow-text" x="446" y="371">APPEND familyName</text>
                <text class="flow-text" x="446" y="383">TO username</text>

                <rect class="flow-process" x="372" y="430" width="124" height="48"></rect>
                <text class="flow-text" x="434" y="445">APPEND letters 1 to extraLetters</text>
                <text class="flow-text" x="434" y="458">IN familyName</text>
                <text class="flow-text" x="434" y="470">TO username</text>

                <polygon class="flow-io" points="148,498 225,498 215,532 138,532"></polygon>
                <text class="flow-text" x="181" y="512">User INPUT</text>
                <text class="flow-text" x="181" y="524">yearStarted</text>

                <rect class="flow-process" x="130" y="548" width="98" height="43"></rect>
                <text class="flow-text" x="179" y="563">APPEND letters 3 to 4</text>
                <text class="flow-text" x="179" y="575">IN yearStarted</text>
                <text class="flow-text" x="179" y="587">TO username</text>

                <polygon class="flow-io" points="148,602 225,602 215,625 138,625"></polygon>
                <text class="flow-text" x="181" y="611">OUTPUT</text>
                <text class="flow-text" x="181" y="621">username</text>

                <rect class="flow-terminator" x="154" y="634" width="54" height="14" rx="7"></rect>
                <text class="flow-text" x="181" y="641">Stop</text>

                <path class="flow-line" marker-end="url(#flow-arrow)" d="M177 26 V38"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M177 64 V78"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M180 112 V124"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M108 166 H92"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M48 179 V610 H138"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M177 208 V224"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M179 267 V284"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M181 318 V332"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M179 416 V440"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M248 374 H300"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M374 374 H396"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M446 391 V430"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M179 483 V498"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M434 478 V515 H225"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M181 532 V548"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M179 591 V602"></path>
                <path class="flow-line" marker-end="url(#flow-arrow)" d="M181 625 V634"></path>
              </svg>
            </figure>
            <p>Complete the test table to show what the outputs would be if the script was developed using the logic in Figure 4.</p>
          `,
          response: {
            type: "table",
            columns: ["Test data", "Username output"],
            rows: [
              {
                id: "row1",
                cells: [
                  "givenName = Mae; familyName = Calderon; yearStarted = 2024",
                ],
              },
              {
                id: "row2",
                cells: [
                  "givenName = Jo; familyName = Mata; yearStarted = 2024",
                ],
              },
              {
                id: "row3",
                cells: [
                  "givenName = Terry; familyName = Bowlesworth; yearStarted = 2023",
                ],
              },
              {
                id: "row4",
                cells: [
                  "givenName = John; familyName = Poe; yearStarted = 2023",
                ],
              },
            ],
          },
          rubric: {
            type: "exact-text-table",
            maxMarks: 4,
            answers: {
              "q2f-row1": "MaeCald24",
              "q2f-row2": "Error",
              "q2f-row3": "TerBowl23",
              "q2f-row4": "JohPoeP23",
            },
            examinerTip:
              "Follow the flow chart exactly. If a name is too short, use the branch shown in the diagram rather than correcting the algorithm.",
          },
        },
      ],
    },
    {
      id: "q3",
      title: "Question 3",
      totalMarks: 18,
      scenarioHtml: `
        <p>Fran is a computer games designer. She designs computer games for different platforms and devices including the web, mobile and games consoles.</p>
      `,
      parts: [
        {
          id: "q3a",
          label: "3(a)",
          marks: 4,
          promptHtml:
            "<p>Fran uses many images in her games.</p><p>Describe how reducing the bit depth of an image will impact on the way the image data is stored and displayed.</p>",
          response: {
            type: "textarea",
            rows: 7,
            label: "Answer",
          },
          rubric: {
            type: "points",
            maxMarks: 4,
            points: [
              {
                label: "Fewer bits are used to represent each pixel/colour",
                terms: [["fewer", "bits"], ["less", "bits"], ["bit depth"]],
              },
              {
                label: "Fewer colours can be represented",
                terms: [
                  ["fewer", "colours"],
                  ["fewer", "colors"],
                  ["colour palette"],
                  ["less", "colour"],
                ],
              },
              {
                label:
                  "The displayed image may be less accurate or lower quality",
                terms: [
                  ["less accurate"],
                  ["quality"],
                  ["banding"],
                  ["detail"],
                  ["precise"],
                ],
              },
              {
                label: "The file size/storage space is reduced",
                terms: [
                  ["file size"],
                  ["storage"],
                  ["disk"],
                  ["smaller"],
                  ["less space"],
                ],
              },
            ],
            examinerTip:
              "Do not focus on file type. The mark scheme is about bits per pixel, number of colours, image accuracy, and file size.",
          },
        },
        {
          id: "q3b",
          label: "3(b)",
          marks: 6,
          promptHtml:
            "<p>Fran uses emulation when designing games.</p><p>Discuss the factors Fran will need to consider when using emulation. Support your discussion with examples relevant to the scenario.</p>",
          response: {
            type: "textarea",
            rows: 10,
            label: "Answer",
          },
          rubric: {
            type: "extended",
            maxMarks: 6,
            levelBands: [2, 4, 6],
            topicTerms: [
              "emulation",
              "platform",
              "mobile",
              "console",
              "web",
              "testing",
              "performance",
              "license",
              "copyright",
              "hardware",
              "cost",
            ],
            contextTerms: [
              "game",
              "designer",
              "fran",
              "console",
              "mobile",
              "web",
            ],
            examinerTip:
              "The examiner report says many answers stopped at defining emulation. A stronger answer discusses testing different platforms, accuracy limits, performance differences, cost, licensing, and the games-design context.",
          },
        },
        {
          id: "q3c",
          label: "3(c)",
          marks: 8,
          promptHtml:
            "<p>Fran is developing a multiplayer online game.</p><p>Analyse how the operating system will manage system components and tasks when executing the game.</p><p>You may wish to consider networking, multi-tasking, interrupts, and memory management. Support your analysis with examples relevant to the scenario.</p>",
          response: {
            type: "textarea",
            rows: 12,
            label: "Answer",
          },
          rubric: {
            type: "extended",
            maxMarks: 8,
            levelBands: [3, 6, 8],
            topicTerms: [
              "network",
              "protocol",
              "driver",
              "multi-tasking",
              "process",
              "cpu",
              "interrupt",
              "memory",
              "virtual memory",
              "fetch",
              "decode",
              "execute",
            ],
            contextTerms: [
              "multiplayer",
              "online",
              "game",
              "player",
              "input",
              "message",
              "network",
            ],
            examinerTip:
              "Analyse OS roles rather than listing them. Link each role to running a multiplayer online game, such as network drivers, player input interrupts, process scheduling, and memory allocation.",
          },
        },
      ],
    },
    {
      id: "q4",
      title: "Question 4",
      totalMarks: 22,
      scenarioHtml: `
        <p>A manufacturing company produces pre-packed meals for a number of different UK supermarket chains.</p>
        <p>The company employs over 300 workers including management, admin, production, and technical support staff.</p>
        <p>The company uses a range of computer systems for administrative tasks and to control the production process.</p>
        <p>It stores and uses a wide range of data including:</p>
        <ul>
          <li>staff personal data</li>
          <li>financial and business data</li>
          <li>production statistics</li>
        </ul>
      `,
      parts: [
        {
          id: "q4a",
          label: "4(a)",
          marks: 10,
          promptHtml:
            "<p>Discuss ways that the company could use computer hardware to protect its data and computer systems. Support your discussion with examples relevant to the scenario.</p>",
          response: {
            type: "textarea",
            rows: 14,
            label: "Answer",
          },
          rubric: {
            type: "extended",
            maxMarks: 10,
            levelBands: [4, 7, 10],
            topicTerms: [
              "firewall",
              "biometric",
              "fingerprint",
              "card reader",
              "access",
              "hardware",
              "removable",
              "backup",
              "device hardening",
              "lock",
              "physical",
            ],
            contextTerms: [
              "manufacturing",
              "production",
              "staff",
              "personal data",
              "financial",
              "business",
              "supermarket",
              "factory",
            ],
            examinerTip:
              "The examiner report says weaker answers stayed generic. Keep this about hardware protection and connect it to the company, its production systems, and sensitive data.",
          },
        },
        {
          id: "q4b",
          label: "4(b)",
          marks: 12,
          promptHtml: `
            <p>The company's network manager is assessing the devices used for backup and storage of its data.</p>
            <p>The company currently uses:</p>
            <ul>
              <li>solid state drives (SSD) and hard disk drives (HDD) in its servers and devices for storing active data</li>
              <li>external storage media, magnetic tape, to back up data at the end of each day.</li>
            </ul>
            <p>Evaluate the suitability of the company's current backup and storage systems. Support your evaluation with examples relevant to the scenario.</p>
          `,
          response: {
            type: "textarea",
            rows: 16,
            label: "Answer",
          },
          rubric: {
            type: "extended",
            maxMarks: 12,
            levelBands: [4, 8, 12],
            topicTerms: [
              "ssd",
              "hdd",
              "read",
              "write",
              "durability",
              "wear",
              "raid",
              "tape",
              "backup",
              "restore",
              "off-site",
              "cost",
              "shelf life",
              "active data",
            ],
            contextTerms: [
              "production",
              "business data",
              "staff data",
              "financial",
              "manufacturing",
              "orders",
              "profit",
              "daily",
            ],
            examinerTip:
              "Evaluation needs a judgement. Balance SSD/HDD active storage, tape backup, restore speed, off-site safety, daily backup gaps, production downtime, and the value of different data types.",
          },
        },
      ],
    },
  ],
};
