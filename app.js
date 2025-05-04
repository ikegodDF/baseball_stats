const puppeteer = require("puppeteer");

async function scrapeData() {
  // Puppeteerでブラウザを起動
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // 試合結果ページにアクセス
  const url = "https://npb.jp/scores/2022/0325/h-f-01/";
  await page.goto(url, { waitUntil: "load" });

  // セレクタが見つかるまで待つ
  await page.waitForSelector("#tablefix_t_b");

  // テーブルの行データをすべて取得
  const playerStats = await page.$$eval("#tablefix_t_b tbody tr", (rows) =>
    rows.map((row) => {
      const cells = row.querySelectorAll("td");
      return Array.from(cells).map((cell) => cell.innerText.trim());
    })
  );

  console.log(playerStats); // 配列の配列で出力される

  await browser.close();
}

scrapeData();
