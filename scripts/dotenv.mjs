// Loads .env.local and .env into process.env for the scripts that run before
// Next.js does its own loading. A variable that is already set wins.
// Deliberately tiny: KEY=value lines, # comments, optional single or double
// quotes.
import { existsSync, readFileSync } from "node:fs";

export default function loadEnv(files = [".env.local", ".env"]) {
  for (const file of files) {
    if (!existsSync(file)) continue;
    for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}
