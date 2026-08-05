#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const APP = path.join(__dirname, "src", "App.tsx");

if (!fs.existsSync(APP)) {
  console.error("❌ src/App.tsx not found");
  process.exit(1);
}

let code = fs.readFileSync(APP, "utf8");

const oldSave = `const handleSaveEntry = (newEntry: FitnessEntry) => {
    setEntries((prev) => {
      const existsIndex = prev.findIndex((e) => e.date === newEntry.date);
      if (existsIndex > -1) {
        const updated = [...prev];
        updated[existsIndex] = {
          ...prev[existsIndex],
          ...newEntry,
          updatedAt: new Date().toISOString()
        };
        return updated;
      } else {
        return [...prev, newEntry];
      }
    });
    setEditingEntry(null);
    setCustomAddDate(null);
  };`;

const newSave = `const handleSaveEntry = async (newEntry: FitnessEntry) => {

    try {

      await api.saveEntry(newEntry);

      const dbEntries = await api.getEntries();

      setEntries(Object.values(dbEntries) as FitnessEntry[]);

      setEditingEntry(null);

      setCustomAddDate(null);

    } catch (err) {

      console.error(err);

      alert("Failed to save entry.");

    }

  };`;

if (code.includes(oldSave)) {
  code = code.replace(oldSave, newSave);
  console.log("✅ handleSaveEntry migrated");
} else {
  console.log("⚠ handleSaveEntry not found exactly. Skipped.");
}

const oldDelete = `const handleDeleteEntry = (date: string) => {
    if (window.confirm(\`Are you sure you want to delete the log record for \${date}?\`)) {
      setEntries((prev) => prev.filter((e) => e.date !== date));
    }
  };`;

const newDelete = `const handleDeleteEntry = async (date: string) => {

    if (!window.confirm(\`Are you sure you want to delete the log record for \${date}?\`)) {
      return;
    }

    try {

      await api.deleteEntry(date);

      const dbEntries = await api.getEntries();

      setEntries(Object.values(dbEntries) as FitnessEntry[]);

    } catch (err) {

      console.error(err);

      alert("Failed to delete entry.");

    }

  };`;

if (code.includes(oldDelete)) {
  code = code.replace(oldDelete, newDelete);
  console.log("✅ handleDeleteEntry migrated");
} else {
  console.log("⚠ handleDeleteEntry not found exactly. Skipped.");
}

fs.writeFileSync(APP, code);

console.log("\n=================================");
console.log(" Part 2 completed");
console.log("=================================\n");
console.log("Run:");
console.log("npm run build");
