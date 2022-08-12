const express = require("express");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.set("port", process.env.PORT || 8099);
const PORT = app.get("port");

app.use(cors());
app.get("/", (req, res) => {
  res.send("hello express");
});
app.get("/daum/news", async (req, res) => {
  axios({
    url: "https://news.daum.net",
  }).then((response) => {
    //console.log(response.data);
    const $ = cheerio.load(response.data);
    const newsList = $(".list_newsissue").children("li");
    const sendNewsList = [];
    newsList.each((idx, item) => {
      sendNewsList.push({
        title: $(item).find(".tit_g").text().replaceAll("\n", "").trim(),
        img: $(item).find(".wrap_thumb .thumb_g").attr("src"),
        category: $(item).find(".txt_category").text(),
        company: $(item).find(".logo_cp .thumb_g").attr("src"),
        url: $(item).find(".tit_g a").attr("href"),
      });
    });
    res.json(sendNewsList);
    //res.send(sendNewsList);
  });
});

// 동적 로딩  ssr  / csr  (vue,react)  puppeteer  ( 구글 )
// 동기적 실행 비 동기적 실행

// promise  비동기적 실행을 동기적으로 처리할 수 있다.
app.get("/gmarket/:item", async (req, res) => {
  const item = req.params.item;
  const searchItem = encodeURIComponent(item);
  console.log(item);
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 50000,
  });
  await page.goto(`http://browse.gmarket.co.kr/search?keyword=${searchItem}`);
  //await autoScroll(page);

  const content = await page.content();
  const $ = cheerio.load(content);
  const items = $(".box__component-itemcard");
  const sendItemsArray = [];

  //console.log($(items[2]).find("img").attr("src"));
  items.each((idx, item) => {
    //await wait(3000);
    const title = $(item).find(".text__item").text();
    const price = $(item).find(".text__value").text();
    const img = $(item).find(".image__item").attr("src");
    const link = $(item).find(".box__image a").attr("href");
    sendItemsArray.push({ title: title, price: price, img: img, link: link });
  });
  res.json(sendItemsArray);
  //res.send(content);
});

app.get("/test", (req, res) => {
  axios({
    url: "https://browse.gmarket.co.kr/search?keyword=%ED%86%A0%EB%A7%88%ED%86%A0",
  }).then((response) => {
    const $ = cheerio.load(response.data);
    const lists = $(".section__module-wrap:nth-child(3) .box__component");
    lists.each((idx, item) => {
      console.log($(item).find(".box__item-container").text());
    });
    res.send(response.data);
    //res.send(sendNewsList);
  });
});

app.listen(PORT, () => {
  console.log(`${PORT}에서 서버 대기 중`);
});
