// Decides what to send for each URL: pages, CSS files, redirects and the custom 404.
const { readPublicFile, getMimeType } = require("./pageLoader");

// URL path -> HTML file in public/pages
const PAGE_ROUTES = {
  "/home": "home.html",
  "/about": "about.html",
  "/contact": "contact.html",
  // extra routes with their own content
  "/services": "services.html",
  "/pricing": "pricing.html",
};

function send(res, statusCode, contentType, body) {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(body);
}

async function sendPage(res, statusCode, file) {
  const html = await readPublicFile(`pages/${file}`);
  send(res, statusCode, "text/html; charset=utf-8", html);
}

// Custom 404 page (falls back to plain text if the file itself is missing)
async function sendNotFound(res) {
  try {
    await sendPage(res, 404, "404.html");
  } catch {
    send(res, 404, "text/plain; charset=utf-8", "404 - Page Not Found");
  }
}

async function handleRequest(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  // "/about/" and "/about" are the same page
  const route = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  console.log(`${new Date().toISOString()}  ${req.method}  ${pathname}`);

  // Only GET and HEAD make sense for a static site
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return send(res, 405, "text/plain; charset=utf-8", "405 - Method Not Allowed");
  }

  // "/" -> "/home"
  if (route === "/") {
    res.writeHead(302, { Location: "/home" });
    return res.end();
  }

  // HTML pages
  if (PAGE_ROUTES[route]) {
    return sendPage(res, 200, PAGE_ROUTES[route]);
  }

  // Static files (CSS)
  if (route.startsWith("/css/")) {
    try {
      const file = await readPublicFile(route.slice(1));
      return send(res, 200, getMimeType(route), file);
    } catch (error) {
      if (error.code === "ENOENT" || error.code === "FORBIDDEN" || error.code === "EISDIR") {
        return sendNotFound(res);
      }
      throw error;
    }
  }

  // Everything else
  return sendNotFound(res);
}

module.exports = { handleRequest };
