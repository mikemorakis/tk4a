const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "..", "dist");
const ASSETS = path.join(DIST, "assets");

function hash(file) {
  const buf = fs.readFileSync(file);
  return crypto.createHash("sha256").update(buf).digest("hex").slice(0, 8);
}

function renameWithHash(filename) {
  const src = path.join(ASSETS, filename);
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const h = hash(src);
  const newName = `${base}.${h}${ext}`;
  fs.renameSync(src, path.join(ASSETS, newName));
  return { oldRef: `/assets/${filename}`, newRef: `/assets/${newName}`, hash: h };
}

const cssRename = renameWithHash("styles.css");
const jsRename = renameWithHash("app.js");

console.log(`[hash-rename] styles.css → styles.${cssRename.hash}.css`);
console.log(`[hash-rename] app.js → app.${jsRename.hash}.js`);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && (full.endsWith(".html") || full.endsWith(".xml"))) {
      let content = fs.readFileSync(full, "utf8");
      let changed = false;
      if (content.includes(cssRename.oldRef)) {
        content = content.split(cssRename.oldRef).join(cssRename.newRef);
        changed = true;
      }
      if (content.includes(jsRename.oldRef)) {
        content = content.split(jsRename.oldRef).join(jsRename.newRef);
        changed = true;
      }
      if (changed) fs.writeFileSync(full, content);
    }
  }
}

walk(DIST);
console.log("[hash-rename] HTML/XML references updated");
