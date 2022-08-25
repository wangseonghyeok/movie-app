const express = require("express");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.set("port", process.env.PORT || 8100);
const PORT = app.get("port");

app.use(cors());
app.get("/", (req, res) => {
  res.send("hello express");
});

app.listen(PORT, () => {
  console.log(`${PORT}에서 서버 대기 중`);
});
