require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("node:dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// TODO: use db
const urls = [];

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;
  const urlObject = new URL(originalUrl);
  const hostname = urlObject.hostname;
  dns.lookup(hostname, (err) => {
    if (err) {
      res.json({ error: "invalid url" });
      return;
    }
    let index = urls.findIndex((url) => url === urlObject.href);
    if (index === -1) {
      index = urls.length;
      urls.push(urlObject.href);
    }
    res.json({
      original_url: urlObject.href,
      short_url: index,
    });
  });
});

app.get("/api/shorturl/:id", (req, res) => {
  const shortUrl = Number.parseInt(req.params.id);
  if (
    shortUrl === null ||
    shortUrl === undefined ||
    shortUrl > urls.length - 1
  ) {
    res.sendStatus(404);
    return;
  }
  res.redirect(urls[shortUrl]);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
