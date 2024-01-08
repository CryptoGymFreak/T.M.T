var express = require("express");
var cors = require("express-cors");
var path = require("path");
var bodyParser = require("body-parser");
var fs = require("fs");
var db;

var server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(express.static("public"));

server.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

server.get("/api/notes", (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname + "/db/db.json"), "utf-8");
    db = JSON.parse(data);
    res.json(JSON.parse(data));
  } catch (e) {
    console.log(e);
  }
});

server.post("/api/notes", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname + "/db/db.json"), "utf-8");
  db = JSON.parse(data);
  db.push(req.body);
  var counter = 1;
  for (item of db) {
    item.id = counter;
    counter++;
  }
  fs.writeFileSync(path.join(__dirname + "/db/db.json"), JSON.stringify(db));
  res.json(req.body);
});

server.delete("/api/notes/:id", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname + "/db/db.json"), "utf-8");
  db = JSON.parse(data);
  for (var i = 0; i < db.length; i++) {
    if (db[i].id == req.params.id) {
      db.splice(i, 1);
    }
  }

  fs.writeFileSync(path.join(__dirname + "/db/db.json"), JSON.stringify(db));
  res.json(req.body);
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port");
});
