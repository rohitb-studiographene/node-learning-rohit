const http = require("http");
const fs = require("fs");

const httpService = http.createServer((req, res) => {
  const url = req.url;
  console.log(url);
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && req.method === "POST") {
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
          res.setHeader("Location", "/");
          return res.end();
        });
      } else {
        fs.writeFile(filePath, `\n ${message}`, (err) => {
          if (err) {
            console.error(err);
          }
          res.statusCode = 302;
          res.setHeader("Location", "/");
          return res.end();
        });
      }
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from Node.js Server</h1></body>");
  res.write("</html>");
  res.end();
});

httpService.listen(3000, () => {
  console.log("Server is running on port 3000");
});
