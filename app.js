const puppeteer = require("puppeteer");

async function scrapeData() {
  // Puppeteerでブラウザを起動
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // 試合結果ページにアクセス
  const url = "https://npb.jp/scores/2022/0325/h-f-01/";
  await page.goto(url, { waitUntil: "load" });

  // ページのHTMLを取得してコンソールに表示
  const pageContent = await page.content();
  console.log(pageContent); // これでページ全体のHTMLが表示されます

  // 必要な要素を確認する
  const score = await page.$eval(".score", (el) => el.textContent);
  console.log("Score:", score);

  // ブラウザを閉じる
  await browser.close();
}

scrapeData();
