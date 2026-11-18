// Reads files asynchronously (fs.promises) and works out their content type.
const fs = require("fs/promises");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "..", "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

// Returns the contents of a file inside /public, or throws if it does not exist
async function readPublicFile(relativePath) {
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  // Block paths like ../../etc/passwd
  if (!fullPath.startsWith(PUBLIC_DIR + path.sep)) {
    const error = new Error("Forbidden path");
    error.code = "FORBIDDEN";
    throw error;
  }
  return fs.readFile(fullPath);
}

const getMimeType = (file) =>
  MIME_TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";

module.exports = { readPublicFile, getMimeType };
