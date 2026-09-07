export const raidLevels = [
  { id: "0", technique: "Striping", min: 2, formula: "N × S", speed: "High read/write potential", tolerance: "No drive failures", strength: "All capacity available", tradeoff: "No redundancy", use: "Temporary render workspace" },
  { id: "1", technique: "Mirroring", min: 2, formula: "S (two-drive mirror)", speed: "Good reads; writes to both copies", tolerance: "One drive in a two-drive mirror", strength: "Simple continued access", tradeoff: "50% capacity in a two-drive mirror", use: "Two-bay office NAS" },
  { id: "5", technique: "Striping + distributed parity", min: 3, formula: "(N − 1) × S", speed: "Good reads; parity adds write work", tolerance: "Any one drive", strength: "Capacity with fault tolerance", tradeoff: "Parity overhead; vulnerable during rebuild", use: "Shared files with capacity priority" },
  { id: "6", technique: "Striping + dual distributed parity", min: 4, formula: "(N − 2) × S", speed: "Good reads; more parity write work", tolerance: "Any two drives", strength: "Protection against a second failure", tradeoff: "Two drives’ worth of capacity overhead", use: "Large arrays with long rebuilds" },
  { id: "10", technique: "Stripe across mirrored pairs", min: 4, formula: "(N ÷ 2) × S", speed: "High read/write potential; no parity", tolerance: "One per pair; losing both in a pair loses the array", strength: "Performance and availability", tradeoff: "50% capacity; pair-dependent failures", use: "Busy database/application server" },
];

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
  { id: "render", title: "A · Temporary render workspace", drives: 4, size: 2, needs: "Use all 8 TB for temporary video-render files and prioritise speed. Source files are safely stored elsewhere. Work can be recreated after a failure; redundancy is not required.", valid: ["0"], reasons: { "0": "RAID 0 supplies 8 TB with striping and no redundancy overhead. A drive failure loses the workspace, so this only fits because the temporary work can be recreated." } },
  { id: "office", title: "B · Two-bay office NAS", drives: 2, size: 2, needs: "Store 2 TB of important shared files in a simple two-drive arrangement. Staff must keep accessing files after either drive fails. Separate backups are already planned.", valid: ["1"], reasons: { "1": "The two-drive mirror provides 2 TB usable and keeps a complete copy after either drive fails. RAID 0 cannot meet the failure requirement; the other levels need more drives." } },
  { id: "photo", title: "C · Four-bay photography NAS", drives: 4, size: 2, needs: "Provide at least 6 TB usable for shared photographs and continue after any one drive fails. All four bays are occupied. Backups are separate.", valid: ["5"], reasons: { "5": "RAID 5 gives (4 − 1) × 2 = 6 TB and tolerates one failure. RAID 6 and RAID 10 give only 4 TB here; RAID 0 fails the resilience requirement." } },
  { id: "archive", title: "D · Large archive", drives: 6, size: 2, needs: "Provide at least 8 TB usable. Rebuilds may take a long time. The array must survive any second drive failing before the first failed drive has finished rebuilding.", valid: ["6"], reasons: { "6": "RAID 6 gives 8 TB and tolerates any two drive failures. RAID 5 only tolerates one; RAID 10 cannot guarantee survival of any two failures and gives 6 TB here." } },
  { id: "database", title: "E · Busy database server", drives: 4, size: 2, needs: "Provide 4 TB usable, continue after any one drive fails, and favour frequent small writes without parity calculations. Storage cost is secondary.", valid: ["10"], reasons: { "10": "RAID 10 gives 4 TB, stripes across mirror pairs, and avoids parity calculations. It suits the stated write workload, but losing both members of one pair still loses the array." } },
  { id: "business", title: "F · Four-drive business NAS", drives: 4, size: 2, needs: "Provide at least 4 TB for shared business files and survive any one drive failure. The business has not yet decided whether extra capacity, protection against a second failure, or write performance matters most. Choose one or more options you could defend, and explain when you would choose each.", valid: ["5", "6", "10"], reasons: { "5": "RAID 5 provides 6 TB: defend this when usable capacity matters most. It cannot survive a second failure during rebuild.", "6": "RAID 6 provides 4 TB: defend this when surviving any two drive failures matters most. There is more parity work and less capacity than RAID 5.", "10": "RAID 10 provides 4 TB: defend this when write performance and no parity calculation matter most. Two failures are only survivable if they affect different mirror pairs." } },
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
