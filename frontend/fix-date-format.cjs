const fs = require("fs");
const path = require("path");

const files = [
  "src/components/CalendarGrid.tsx",
  "src/components/Dashboard.tsx",
  "src/components/HistoryLogs.tsx",
];

for (const file of files) {
  const full = path.join(process.cwd(), file);

  if (!fs.existsSync(full)) {
    console.log("Skipping", file);
    continue;
  }

  let src = fs.readFileSync(full, "utf8");
  const original = src;

  // ----------------------------------------
  // CalendarGrid
  // ----------------------------------------

  src = src.replace(
    /map\[e\.date\]\s*=\s*e;/g,
    `map[e.date.split("T")[0]] = e;`
  );

  // ----------------------------------------
  // Dashboard
  // ----------------------------------------

  src = src.replace(
    /entries\.find\(e\s*=>\s*e\.date\s*===\s*selectedDate\)/g,
    `entries.find(e => e.date.split("T")[0] === selectedDate.split("T")[0])`
  );

  // ----------------------------------------
  // History search
  // ----------------------------------------

  src = src.replace(
    /entry\.date\.includes\(searchTerm\)/g,
    `entry.date.split("T")[0].includes(searchTerm)`
  );

  if (src !== original) {
    fs.copyFileSync(full, full + ".bak");
    fs.writeFileSync(full, src);
    console.log("✅ Fixed", file);
  } else {
    console.log("ℹ No changes needed:", file);
  }
}

console.log("");
console.log("====================================");
console.log("Date format fixes completed.");
console.log("====================================");
console.log("");
console.log("Next:");
console.log("npm run build");
