const http = require("http");
const fs = require("fs");
const moment = require("moment");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<html>");
    res.write("<head><title>Enter message</title></head>");
    res.write(
      "<body><form action='/write' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  } else if (req.url === "/read") {
    fs.readFile("file.txt", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(data);
      }
    });
  } else if (req.url === "/write" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      console.log(message);
      const filePath = "file.txt";
      if (fs.existsSync(filePath)) {
        fs.appendFile(filePath, `\n ${message}`, (err) => {
          if (err) {
            console.error(err);
          }
          res.statusCode = 302;
          res.setHeader("Location", "/read");
          return res.end();
        });
      } else {
        fs.writeFile(filePath, `\n ${message}`, (err) => {
          if (err) {
            console.error(err);
          }
          res.statusCode = 302;
          res.setHeader("Location", "/read");
          return res.end();
        });
      }
    });
  } else if (req.url === "/timestamp") {
    const timestamp = moment().format("MMMM Do YYYY, h:mm:ss A");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(timestamp);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
