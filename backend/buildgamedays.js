import puppeteer from "puppeteer";
import fs from "fs/promises";

const takeURL = async (year, month) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
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
          const date = href.match(/\/scores\/(\d{4})\/(\d{4})\//);
          const score = cleanText(element.textContent);

          return {
            href: href,
            date: date[1] + date[2],
            teams: [[teams[1]], [teams[2]]],
            score: score,
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
      game.teams.forEach((team) => {
        if (!acc[teamNameConverter[team]]) acc[teamNameConverter[team]] = [];
        acc[teamNameConverter[team]].push(formattedDateArray);
      });
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
