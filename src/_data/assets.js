const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function hash(file) {
  const buf = fs.readFileSync(path.join(__dirname, "..", "assets", file));
  return crypto.createHash("sha256").update(buf).digest("hex").slice(0, 8);
}

module.exports = {
  cssHash: hash("styles.css"),
  jsHash: hash("app.js")
};
