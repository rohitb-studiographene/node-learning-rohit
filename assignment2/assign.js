// Spin up a Node.js-driven Server (on port 3000)

// Handle two Routes: “/” and “/users”

// Return some greeting text on “/”
// Return a list of dummy users (e.g. <ul><li>User 1</li></ul>)
// Add a form with a “username” <input> to the “/” page and submit a POST request to “/create-user” upon a button click

// Add the “/create-user” route and parse the incoming data (i.e. the username) and simply log it to the console

const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  console.log(url);
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter message</title></head>");
    res.write(
      "<body><form action='/create-user' method='POST'><input type='text' name='username'><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/create-user" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      console.log(username);
      // write the username in a file
      const filePath = "users.txt";
      if (fs.existsSync(filePath)) {
        fs.appendFile(filePath, `\n ${username}`, (err) => {
          if (err) {
            console.error(err);
          }
          res.statusCode = 302;
          res.setHeader("Location", "/");
          return res.end();
        });
      } else {
        fs.writeFile(filePath, `\n ${username}`, (err) => {
          if (err) {
            console.error(err);
          }
          res.statusCode = 302;
          res.setHeader("Location", "/");
          return res.end();
        });
      }
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }
  if (url === "/users") {
    res.write("<html>");
    res.write("<head><title>Users</title></head>");
    // write the users from the file
    const users = fs.readFileSync("users.txt", "utf8").split("\n");
    res.write("<body><ul>");
    users.forEach((user) => {
      res.write(`<li>${user}</li>`);
    });
    res.write("</ul></body>");
    res.write("</html>");
    return res.end();
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from Node.js Server</h1></body>");
  res.write("</html>");
  res.end();
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
