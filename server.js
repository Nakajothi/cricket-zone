const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";
const ROOT = __dirname;
const CONFIG_PATH = path.join(ROOT, "server-config.js");

let CRICAPI_KEY = process.env.CRICAPI_KEY || "";
if (!CRICAPI_KEY) {
  try {
    ({ CRICAPI_KEY } = require(CONFIG_PATH));
  } catch (error) {
    console.error("Missing CRICAPI_KEY. Set it in Render environment variables or create server-config.js locally.");
    process.exit(1);
  }
}

if (!CRICAPI_KEY) {
  console.error("CRICAPI_KEY is empty. Set it in Render environment variables or server-config.js.");
  process.exit(1);
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
}

function proxyCricApi(endpointPath, res) {
  const apiUrl = new URL(`https://api.cricapi.com${endpointPath}`);
  apiUrl.searchParams.set("apikey", CRICAPI_KEY);

  https.get(apiUrl, apiRes => {
    let body = "";
    apiRes.on("data", chunk => {
      body += chunk;
    });
    apiRes.on("end", () => {
      res.writeHead(apiRes.statusCode || 200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(body);
    });
  }).on("error", error => {
    sendJson(res, 502, { status: "error", reason: `Proxy request failed: ${error.message}` });
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (requestUrl.pathname === "/api/currentMatches") {
    proxyCricApi(`/v1/currentMatches?offset=${requestUrl.searchParams.get("offset") || "0"}`, res);
    return;
  }

  if (requestUrl.pathname === "/api/match_scorecard") {
    const matchId = requestUrl.searchParams.get("id");
    if (!matchId) {
      sendJson(res, 400, { status: "error", reason: "Match id is required." });
      return;
    }
    proxyCricApi(`/v1/match_scorecard?id=${encodeURIComponent(matchId)}`, res);
    return;
  }

  let filePath = path.join(ROOT, requestUrl.pathname === "/" ? "index.html" : requestUrl.pathname);
  const normalized = path.normalize(filePath);
  if (!normalized.startsWith(ROOT)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  fs.stat(normalized, (err, stats) => {
    if (!err && stats.isDirectory()) {
      serveFile(path.join(normalized, "index.html"), res);
      return;
    }
    serveFile(normalized, res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`CricZone server running at http://${HOST}:${PORT}`);
});
