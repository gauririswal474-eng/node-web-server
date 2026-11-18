// Entry point: creates the HTTP server with Node's built-in http module.
const http = require("http");
const { handleRequest } = require("./src/router");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    // Last safety net: any unexpected error becomes a 500 response, the server keeps running
    console.error(`[ERROR] ${req.method} ${req.url} -> ${error.message}`);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    }
    res.end("500 - Internal Server Error");
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
