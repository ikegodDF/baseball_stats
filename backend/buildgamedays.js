// このファイルはNPB公式サイトから各チームの試合日程をスクレイピングし、
// チームごとの試合日リスト（gamedays.json）を生成するスクリプトです。
// 主な処理：puppeteerでページ取得→日程抽出→チームごとに日付をまとめてjson出力
//
// 例：
// - NPB公式のスケジュールページにアクセス
// - 各試合の開催日・対戦カードを抽出
// - チームごとに「いつ試合があるか」を整理し、gamedays.jsonに保存
//

import puppeteer from "puppeteer";
import fs from "fs/promises";

const takeURL = async (year, month) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // User-Agent を設定
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  const teamNameConverter = {
    g: "読売ジャイアンツ",
    t: "阪神タイガース",
    d: "中日ドラゴンズ",
    c: "広島東洋カープ",
    s: "東京ヤクルトスワローズ",
    db: "横浜DeNAベイスターズ",
    h: "福岡ソフトバンクホークス",
    l: "埼玉西武ライオンズ",
    f: "北海道日本ハムファイターズ",
    e: "東北楽天ゴールデンイーグルス",
    b: "オリックス・バファローズ",
    m: "千葉ロッテマリーンズ",
  };

  try {
    await page.goto(
      `https://npb.jp/games/${year}/schedule_${month}_detail.html`,
      {
        timeout: 60000, // 60秒に延長
        waitUntil: "domcontentloaded", // 早めの読み込みで進める
      }
    );

    const links = await page.$$eval(
      `div.table_normal.summary_table tbody a`,
      (elements) =>
        elements.map((element) => {
          const cleanText = (text) => {
            return text.replace(/\s+/g, " ").trim();
          };

          const href = element.getAttribute("href");
          const row = element.closest("tr");
          const teams = href.match(
            /\/scores\/\d{4}\/\d{4}\/([a-z]+)\-([a-z]+)\-/i
          );
          const date = href.match(/\/scores\/(\d{4})\/(\d{4})\//);
          const score = cleanText(element.textContent);

          return {
            href,
            date: date[1] + date[2],
            teams: [[teams[1]], [teams[2]]],
            score,
          };
        })
    );

    await browser.close();

    const groupedByDate = links.reduce((acc, game) => {
      const date = game.date;
      const formattedDateArray = [
        parseInt(date.slice(0, 4)),
        parseInt(date.slice(4, 6)),
        parseInt(date.slice(6, 8)),
      ];
      const homeTeam = teamNameConverter[game.teams[0][0]];
      const awayTeam = teamNameConverter[game.teams[1][0]];

      // ホームチームの記録
      if (!acc[homeTeam]) acc[homeTeam] = [];
      acc[homeTeam].push({ date: formattedDateArray, role: "home" });

      // アウェイチームの記録
      if (!acc[awayTeam]) acc[awayTeam] = [];
      acc[awayTeam].push({ date: formattedDateArray, role: "away" });
      return acc;
    }, {});

    return groupedByDate;
  } catch (error) {
    console.error("データの取得中にエラーが発生しました:", error);
    await browser.close();
    return {};
  }
};

const years = ["2022", "2023", "2024", "2025"];
const months = ["03", "04", "05", "06", "07", "08", "09", "10"];
const teamDates = {};
const promises = [];

for (let i = 0; i < years.length; i++) {
  for (let j = 0; j < months.length; j++) {
    const p = takeURL(years[i], months[j]).then((result) => {
      for (const team in result) {
        if (!teamDates[team]) teamDates[team] = new Set();
        result[team].forEach((dateArr) =>
          teamDates[team].add(JSON.stringify(dateArr))
        );
      }
    });
    promises.push(p);
  }
}

// 全部終わってからまとめて使う
Promise.all(promises).then(() => {
  const finalResult = {};
  for (const team in teamDates) {
    finalResult[team] = Array.from(teamDates[team]).map((str) =>
      JSON.parse(str)
    );
  }
  fs.writeFile("gamedays.json", JSON.stringify(finalResult, null, 2));
});
