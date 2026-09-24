export const raidLevels = [
  { id: "0", technique: "Striping", min: 2, formula: "N × S", speed: "High read/write potential", tolerance: "No drive failures", strength: "All capacity available", tradeoff: "No redundancy", use: "Temporary render workspace" },
  { id: "1", technique: "Mirroring", min: 2, formula: "S (two-drive mirror)", speed: "Good reads; writes to both copies", tolerance: "One drive in a two-drive mirror", strength: "Simple continued access", tradeoff: "50% capacity in a two-drive mirror", use: "Two-bay office NAS" },
  { id: "5", technique: "Striping + distributed parity", min: 3, formula: "(N − 1) × S", speed: "Good reads; parity adds write work", tolerance: "Any one drive", strength: "Capacity with fault tolerance", tradeoff: "Parity overhead; vulnerable during rebuild", use: "Shared files with capacity priority" },
  { id: "6", technique: "Striping + dual distributed parity", min: 4, formula: "(N − 2) × S", speed: "Good reads; more parity write work", tolerance: "Any two drives", strength: "Protection against a second failure", tradeoff: "Two drives’ worth of capacity overhead", use: "Large arrays with long rebuilds" },
  { id: "10", technique: "Stripe across mirrored pairs", min: 4, formula: "(N ÷ 2) × S", speed: "High read/write potential; no parity", tolerance: "One per pair; losing both in a pair loses the array", strength: "Performance and availability", tradeoff: "50% capacity; pair-dependent failures", use: "Busy database/application server" },
];

export const raidPreviews = {
  '0': { title: 'Speed and space', benefit: 'Drives share the work; all installed space can hold files.', cost: 'No protection if a drive fails.' },
  '1': { title: 'Keep a complete twin', benefit: 'Another drive has the same files if one drive fails.', cost: 'In a two-drive mirror, half the installed space holds the copy.' },
  '5': { title: 'Space with one-drive protection', benefit: 'Keep files available after any one drive fails, using calculated recovery information.', cost: 'Recovery information uses space and adds work when writing.' },
  '6': { title: 'Protection against two failures', benefit: 'Keep files available even when any two drives fail.', cost: 'More space and write work are used for recovery information than in RAID 5.' },
  '10': { title: 'Share work between pairs', benefit: 'Pairs share the work; each pair keeps a complete second copy.', cost: 'Half the installed space holds copies; losing both drives in one pair loses the array.' },
};

export function usableCapacity(level, count, size) {
  const info = raidLevels.find(item => item.id === level);
  if (!info || !Number.isInteger(count) || count < info.min || !Number.isFinite(size) || size <= 0) return null;
  if (level === "1" && count !== 2 || level === "10" && count % 2 !== 0) return null;
  return ({ "0": count, "1": 1, "5": count - 1, "6": count - 2, "10": count / 2 })[level] * size;
}

export function arraySurvives(level, count, failures) {
  if (usableCapacity(level, count, 1) === null) return false;
  const failed = new Set(failures);
  if ([...failed].some(i => !Number.isInteger(i) || i < 0 || i >= count)) return false;
  if (level === "10") return Array.from({ length: count / 2 }, (_, pair) => pair * 2).every(i => !(failed.has(i) && failed.has(i + 1)));
  return failed.size <= ({ "0": 0, "1": 1, "5": 1, "6": 2 })[level];
}

export function xorBits(a, b) {
  if (!/^[01]+$/.test(a) || a.length !== b.length || !/^[01]+$/.test(b)) throw new Error("Use equal-length binary strings.");
  return [...a].map((bit, i) => bit === b[i] ? "0" : "1").join("");
}

export const raidScenarios = [
  { id: "science", title: "A · Science simulation workspace", drives: 4, size: 2, needs: "A research class needs all 8 TB for temporary simulation output. Fast processing matters. The input dataset is safely stored elsewhere and the output can be generated again; redundancy is not required.", valid: ["0"], reasons: { "0": "RAID 0 supplies 8 TB and lets drives share read/write work. A failure loses the temporary output, which is acceptable only because it can be generated again." } },
  { id: "radio", title: "B · Community radio automation", drives: 2, size: 2, needs: "The station has exactly two drive bays and needs 2 TB for its programme library. Playback must continue after either drive fails. A separate backup already exists.", valid: ["1"], reasons: { "1": "RAID 1 keeps the complete 2 TB library on both drives. Either drive may fail while the other serves the programmes. RAID 0 lacks that protection and the other taught levels require more drives." } },
  { id: "maps", title: "C · Geography department map library", drives: 4, size: 2, needs: "Students mostly read large map datasets. Four occupied bays must provide at least 6 TB and keep the files available after any one drive fails. Separate backups are maintained.", valid: ["5"], reasons: { "5": "RAID 5 provides 6 TB for files and 2 TB of distributed parity, with one-drive protection. RAID 6 and RAID 10 provide only 4 TB here; RAID 0 cannot survive a failure." } },
  { id: "observatory", title: "D · Remote observatory recorder", drives: 6, size: 2, needs: "Provide at least 8 TB for telescope recordings. Replacement visits and rebuilds take time. The system must survive any second drive failing before the first replacement finishes rebuilding. Backups are sent elsewhere.", valid: ["6"], reasons: { "6": "RAID 6 supplies 8 TB and protection against any two drive failures. RAID 5 cannot survive a second failure. RAID 10 neither guarantees any two failures nor provides 8 TB with these drives." } },
  { id: "ticketing", title: "E · Live festival ticket service", drives: 4, size: 2, needs: "Provide 4 TB for a service making frequent small seat-reservation updates. Continue after any one drive fails and avoid parity calculations on these writes. The organisers accept the cost of duplicate copies.", valid: ["10"], reasons: { "10": "RAID 10 gives 4 TB and lets mirror pairs share the work without parity calculations. It survives any one failure, but losing both members of one pair still loses the array." } },
  { id: "club", title: "F · Engineering club project store", drives: 4, size: 2, needs: "Provide at least 4 TB for shared project data and survive any one drive failure. The club has not decided whether extra space, protection against a second failure, or frequent-write performance is most important. Choose one or more defensible options and explain the priority behind each.", valid: ["5", "6", "10"], reasons: { "5": "RAID 5 gives 6 TB: defend it when extra file space matters most. A second drive failure during rebuild can lose the array.", "6": "RAID 6 gives 4 TB: defend it when surviving any two failures matters most. It uses more capacity and parity write work than RAID 5.", "10": "RAID 10 gives 4 TB: defend it for frequent writes without parity calculations. Two failures are survivable only when they affect different pairs." } },
];

export function evaluateRaidChoice(scenarioId, choices) {
  const scenario = raidScenarios.find(item => item.id === scenarioId);
  if (!scenario) return { valid: false, messages: ["Choose a scenario."] };
  const selected = [...new Set(choices)];
  if (!selected.length) return { valid: false, messages: ["Choose at least one RAID level first."] };
  return {
    valid: selected.every(id => scenario.valid.includes(id)),
    messages: selected.map(id => scenario.reasons[id] ?? `RAID ${id} does not meet these requirements. Check drive count, usable capacity, failure protection, and the stated workload.`),
  };
}

export function raidReferenceTable() {
  return `<div class="raid-table-scroll" tabindex="0" role="region" aria-label="RAID comparison table; scroll sideways on small screens"><table class="comparison-table raid-reference"><caption>Equal-size drives: N = drive count; S = smallest drive capacity. RAID 1 here is a two-drive mirror; RAID 10 uses an even number of drives. Formatting and system overhead are ignored. Speed depends on workload and implementation.</caption><thead><tr>${["RAID", "Technique", "Min drives", "Usable capacity", "Relative performance", "Failures tolerated", "Main strength", "Main trade-off", "Suitable use"].map(x => `<th scope="col">${x}</th>`).join("")}</tr></thead><tbody>${raidLevels.map(x => `<tr><th scope="row">RAID ${x.id}</th>${[x.technique, x.min, x.formula, x.speed, x.tolerance, x.strength, x.tradeoff, x.use].map(value => `<td>${value}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
