// このファイルはNPB公式サイトから各試合の詳細ページURLやスコア情報をスクレイピングし、
// 年・月ごとにまとめてurl.jsonに保存するスクリプトです。
// 主な処理：puppeteerでページ取得→試合ごとのURL・スコア抽出→json出力
//
// 例：
// - NPB公式のスケジュールページにアクセス
// - 各試合の詳細ページURL・スコア・対戦カードを抽出
// - 年・月ごとにまとめてurl.jsonに保存
//

import puppeteer from "puppeteer";
import fs from "fs/promises";

const takeURL = async (year, month) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(
      `https://npb.jp/games/${year}/schedule_${month}_detail.html`
    );

    const links = await page.$$eval(
      `div.table_normal.summary_table tbody a`,
      (elements) =>
        elements.map((element) => {
          // テキストの整形関数(空白の削除)
          const cleanText = (text) => {
            return text.replace(/\s+/g, " ").trim();
          };

          const row = element.closest("tr");
          const href = element.getAttribute("href");
          const teams = href.match(
            /\/scores\/\d{4}\/\d{4}\/([a-z]+)\-([a-z]+)\-/i
          );
          const score = cleanText(element.textContent);

          return {
            href: href,
            date: element
              .getAttribute("href")
              .match(/\/scores\/\d{4}\/(\d{4})\//)[1],
            teams: [teams[1], teams[2]],
            score: score,
          };
        })
    );

    await browser.close();

    const groupedByDate = links.reduce((acc, game) => {
      const date = game.date;
      if (!acc[date]) {
        acc[date] = {};
      }
      acc[date][game.teams[0]] = {
        href: game.href,
        score: game.score,
        opponent: game.teams[1],
        fora: "home",
      };
      acc[date][game.teams[1]] = {
        href: game.href,
        score: game.score,
        opponent: game.teams[0],
        fora: "away",
      };
      return acc;
    }, {});

    return groupedByDate;
  } catch (error) {
    console.error("データの取得中にエラーが発生しました:", error);
    await browser.close();
    return [];
  }
};

const years = ["2022", "2023", "2024", "2025"];
const months = ["03", "04", "05", "06", "07", "08", "09", "10"];
const year = {};
const promises = [];

for (let i = 0; i < years.length; i++) {
  year[years[i]] = {};
  for (let j = 0; j < months.length; j++) {
    const p = takeURL(years[i], months[j]).then((result) => {
      year[years[i]][months[j]] = result;
    });
    promises.push(p);
  }
}

// 全部終わってからまとめて使う
Promise.all(promises).then(() => {
  fs.writeFile("url.json", JSON.stringify(year, null, 2));
});
