const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "src", "App.tsx");

let text = fs.readFileSync(file, "utf8");

const oldCode = `if (dbSettings) {

          setSettings(dbSettings);

        }`;

const newCode = `if (dbSettings) {

          setSettings(prev => ({

            ...prev,

            profile: {
              ...prev.profile,
              heightCm: dbSettings.heightCm ?? prev.profile.heightCm,
              startWeightKg: dbSettings.startWeightKg ?? prev.profile.startWeightKg,
            },

            goals: {
              ...prev.goals,
              calorieGoal: dbSettings.calorieGoal ?? prev.goals.calorieGoal,
              proteinGoal: dbSettings.proteinGoal ?? prev.goals.proteinGoal,
              carbLimit: dbSettings.carbLimit ?? prev.goals.carbLimit,
              fatGoal: dbSettings.fatGoal ?? prev.goals.fatGoal,
              goalWeightKg: dbSettings.goalWeightKg ?? prev.goals.goalWeightKg,
            },

            appearance: {
              ...prev.appearance,
              theme: dbSettings.theme ?? prev.appearance.theme,
            }

          }));

        }`;

if (!text.includes(oldCode)) {
  console.log("❌ Could not find the old settings block.");
  process.exit(1);
}

fs.copyFileSync(file, file + ".bak-settings");

text = text.replace(oldCode, newCode);

fs.writeFileSync(file, text);

console.log("✅ App.tsx patched successfully.");
console.log("Backup saved as App.tsx.bak-settings");
console.log("");
console.log("Now run:");
console.log("npm run build");
