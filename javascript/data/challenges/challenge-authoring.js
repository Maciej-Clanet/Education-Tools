// Instructions are rendered as text, not HTML. Blank sources stay blank.
export function challenge({ id, section, number, kind, topic, title, skills, task, steps, checks, expectedOutput, code = "", sources, scaffold = {} }) {
  const javascript = section === "javascript-basics"
  return {
    id, section, number, kind, topic, title, skills,
    workspace: {
      title: `Challenge ${number}: ${title}`,
      executionMode: javascript ? "javascript" : "html-css",
      instructions: [
        { type: "p", text: `${topic} · ${kind === "debug" ? "Debugging" : "Create from scratch"}` },
        { type: "p", text: task },
        { type: "ol", items: steps },
        ...(expectedOutput !== undefined ? [
          { type: "p", text: "Expected console output:" },
          { type: "pre", code: expectedOutput },
        ] : []),
        { type: "p", text: "Check your work:" },
        { type: "ul", items: checks },
      ],
      sources: sources ?? [{ id: "javascript", type: "javascript", label: "JavaScript", code }],
      scaffold,
      ...(javascript ? { execution: { timeoutMs: 3000, network: { mode: "disabled" } } } : {}),
    },
  }
}
