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
    width: 100,
    height: 1080,
  });

  await page.goto(`https://browse.gmarket.co.kr/search?keyword=${searchItem}`);
  //await autoScroll(page);
  await page.evaluate(async () => {
    console.log(document.body.scrollHeight);
    const scrollHeight = document.body.scrollHeight;
    const aa = await new Promise((resolve, reject) => {
      let total = 0;
      const amount = 200;
      const timer = setInterval(() => {
        window.scrollBy(0, amount);
        total += amount;
        if (total > scrollHeight) {
          clearInterval(timer);
          resolve("end");
        }
      }, 50);
    });
    console.log(aa);
  });

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
app.get("/gmarket02/:item", async (req, res) => {
  const item = req.params.item;
  const searchItem = encodeURIComponent(item);
  console.log(item);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1600,2000"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 1080,
  });
  await page.goto(`https://browse.gmarket.co.kr/search?keyword=${searchItem}`);
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
app.get("/youtube/:word", async (req, res) => {
  try {
    const word = req.params.word;
    const queryWord = encodeURIComponent(word);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 30000,
    });
    await page.goto(`https://www.youtube.com/results?search_query=${queryWord}`, { waitUntil: "load" });

    const content = await page.content();
    const $ = cheerio.load(content);
    const items = $("#dismissible");
    console.log(items.length);
    let listArr = [];
    items.each((idx, item) => {
      const img = $(item).find("#thumbnail").find(".yt-img-shadow").attr("src");
      //console.log($(item).find("#channel-name").length);
      // const title = $(item).find("#video-title:nth-child(2)").text();
      const title = $(item).find("#title-wrapper").find("#video-title").attr("title");
      const link = $(item).find("#thumbnail").attr("href");
      const view = $(item).find("#metadata-line").find(".ytd-video-meta-block:nth-child(1)").text();
      const time = $(item).find("#metadata-line").find(".ytd-video-meta-block:nth-child(2)").text();
      const auth = $(item).find("#channel-info #channel-name").find(".yt-simple-endpoint").text();
      listArr.push({
        img,
        title,
        link,
        view,
        time,
        auth,
      });
    });
    res.json(listArr);
  } catch (err) {
    console.log(err);
  }
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
