const express = require("express");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.set("port", process.env.PORT || 8100);
const PORT = app.get("port");

app.use(cors({ credentials: true }));
app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/megabox", async (req, res) => {
  // const item = req.params.item;
  // const searchItem = encodeURIComponent(item);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1600,2000"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 1080,
  });
  await page.goto(`https://www.megabox.co.kr/movie`);
  //await autoScroll(page);
  await page.evaluate(async () => {
    console.log(document.body.scrollHeight);
    const scrollHeight = document.body.scrollHeight;
    const aa = await new Promise((resolve, reject) => {
      let total = 0;
      const amount = 200;
      window.scrollTo(0, scrollHeight);
      const timer = setTimeout(() => {
        clearTimeout(timer);
        resolve("end");
      }, 3000);
    });
    console.log(aa);
  });

  const content = await page.content();
  const $ = cheerio.load(content);
  const items = $("#movieList li");
  const sendItemsArray = [];

  //console.log($(items[2]).find("img").attr("src"));
  items.each((idx, item) => {
    //await wait(3000);

    const summary = $(item).find(".summary").text();
    const grade = $(item).find(".number").text();
    const title = $(item).find(".tit-area .tit").text();
    const rate = $(item).find(".rate-date .rate").text();
    const date = $(item).find(".rate-date .date").text();
    const img = $(item).find(".movie-list-info img").attr("src");
    const like = $(item).find(".btn-util span").text();
    sendItemsArray.push({ summary, grade, title, rate, date, img, like });
  });
  res.send(sendItemsArray);
  //res.send(content);
});

app.get("/megabox/:item", async (req, res) => {
  const item = req.params.item;
  const searchItem = encodeURIComponent(item);
  console.log(item);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 1080,
  });
  await page.goto(`https://www.megabox.co.kr/movie?searchText=${searchItem}`);
  //await autoScroll(page);
  await page.evaluate(async () => {
    console.log(document.body.scrollHeight);
    const scrollHeight = document.body.scrollHeight;
    const aa = await new Promise((resolve, reject) => {
      let total = 0;
      const amount = 200;
      window.scrollTo(0, scrollHeight);
      const timer = setTimeout(() => {
        clearTimeout(timer);
        resolve("end");
      }, 3000);
    });
    console.log(aa);
  });

  const content = await page.content();
  const $ = cheerio.load(content);
  const items = $("#movieList li");
  const sendItemsArray = [];

  //console.log($(items[2]).find("img").attr("src"));
  items.each((idx, item) => {
    //await wait(3000);
    const summary = $(item).find(".summary").text();
    const grade = $(item).find(".number").text();
    const title = $(item).find(".tit-area .tit").text();
    const rate = $(item).find(".rate-date .rate").text();
    const date = $(item).find(".rate-date .date").text();
    const img = $(item).find(".movie-list-info img").attr("src");
    const like = $(item).find(".btn-util span").text();
    sendItemsArray.push({ summary, grade, title, rate, date, img, like });
  });
  res.json(sendItemsArray);
  //res.send(content);
});

app.listen(PORT, () => {
  console.log(`${PORT}에서 서버 대기 중`);
});
