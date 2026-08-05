#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const APP = path.join(__dirname, "src", "App.tsx");
const BACKUP = APP + ".bak";

if (!fs.existsSync(APP)) {
  console.error("❌ src/App.tsx not found");
  process.exit(1);
}

if (!fs.existsSync(BACKUP)) {
  fs.copyFileSync(APP, BACKUP);
  console.log("✅ Backup created:", BACKUP);
}

let code = fs.readFileSync(APP, "utf8");

// ------------------------------------------------
// Add import
// ------------------------------------------------

if (!code.includes("import api from './lib/api'")) {

  const importAnchor = "} from './types';";

  code = code.replace(
    importAnchor,
    importAnchor + "\nimport api from './lib/api';"
  );

  console.log("✅ Added api import");
}

// ------------------------------------------------
// Inject loader effect
// ------------------------------------------------

if (!code.includes("const loadBackendData = async")) {

const effect = `

// ------------------------------------------------
// Backend Sync
// ------------------------------------------------

useEffect(() => {

  const loadBackendData = async () => {

    try {

      const dbEntries = await api.getEntries();

      if (dbEntries && Object.keys(dbEntries).length > 0) {

        setEntries(Object.values(dbEntries));

      }

      try {

        const dbSettings = await api.getSettings();

        if (dbSettings) {

          setSettings(dbSettings);

        }

      } catch (e) {

        console.warn("Settings API unavailable.");

      }

    } catch (e) {

      console.warn("Backend unavailable, keeping LocalStorage.");

    }

  };

  loadBackendData();

}, []);

`;

const anchor =
"const [customAddDate, setCustomAddDate] = useState<string | null>(null);";

code = code.replace(anchor, anchor + effect);

console.log("✅ Added backend loader");

}

// ------------------------------------------------
// Save
// ------------------------------------------------

fs.writeFileSync(APP, code);

console.log("");
console.log("===================================");
console.log(" Part 1 completed");
console.log("===================================");
console.log("");
console.log("Now run:");
console.log("");
console.log("npm run build");
console.log("");
