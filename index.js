const express = require("express");
const bodyParser = require("body-parser");
const Game = require("./Game");
const path = require("path");

// Create a new express application instance
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "www")));

app.get("/users/:uname", (req, res) => {
  res.end("Hello " + req.params.uname);
});

let oGames = {};
app.post("/sms", (req, res) => {
  let sFrom = req.body.From || req.body.from;
  if (!oGames.hasOwnProperty(sFrom)) {
    oGames[sFrom] = new Game();
  }
  let sMessage = req.body.Body || req.body.body;
  let aReply = oGames[sFrom].makeAMove(sMessage);
  res.setHeader("content-type", "text/html");
  let sResponse = "<Response>";
  for (let n = 0; n < aReply.length; n++) {
    sResponse += "<Message>";
    sResponse += aReply[n];
    sResponse += "</Message>";
  }
  res.end(sResponse + "</Response>");
});

var port = process.env.PORT || parseInt(process.argv.pop()) || 3000;

app.listen(port, () =>
  console.log("Example app listening on port " + port + "!")
);