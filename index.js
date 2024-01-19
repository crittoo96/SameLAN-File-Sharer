const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const networkInterfaces = os.networkInterfaces();
let localhostIp;

for (const interface in networkInterfaces) {
  networkInterfaces[interface].forEach((details) => {
    if (details.family === "IPv4" && !details.internal) {
      console.log(`${interface}: ${details.address}`);
      localhostIp = details.address;
    }
  });
}

const server = http.createServer((req, res) => {
  const clientIp = req.socket.remoteAddress;
  const clientPort = req.socket.remotePort;

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end("Only GET method is allowed");
    return;
  }

  const filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );
  const fileExtension = path.extname(filePath);
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
  };

  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.end(`File not found: ${req.url}`);
    return;
  }

  console.log(`Serving file: ${filePath}`);
  console.log(`   to Client IP: ${clientIp}:${clientPort}`);

  const stream = fs.createReadStream(filePath, { highWaterMark: 16 * 1024 });

  stream.on("open", () => {
    res.writeHead(200, {
      "Content-Type": mimeTypes[fileExtension] || "application/octet-stream",
    });
    stream.pipe(res);
  });

  stream.on("error", (error) => {
    res.writeHead(500);
    res.end(`Server Error: ${error}`);
  });

  stream.on("end", () => {
    res.end();
  });
});

server.timeout = 0; // タイムアウトを無効にする

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://${localhostIp}:${PORT}/`);
});
