const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src", "assets");
const DIST = path.join(__dirname, "..", "dist", "assets");

function hashSrc(file) {
  const buf = fs.readFileSync(path.join(SRC, file));
  return crypto.createHash("sha256").update(buf).digest("hex").slice(0, 8);
}

function rename(filename) {
  const h = hashSrc(filename);
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const oldPath = path.join(DIST, filename);
  const newPath = path.join(DIST, `${base}.${h}${ext}`);
  if (!fs.existsSync(oldPath)) {
    console.log(`[hash-rename] SKIP ${filename} (not in dist)`);
    return;
  }
  fs.renameSync(oldPath, newPath);
  console.log(`[hash-rename] ${filename} → ${base}.${h}${ext}`);
}

rename("styles.css");
rename("app.js");
