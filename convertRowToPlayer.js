import { readFile } from "fs/promises";
import { waitForDebugger } from "inspector";

console.log(data);

// urlへのアクセス
const acceessURL = async (teamName, dateStr) => {
  const teamNameconverter = {
    日本ハム: "f",
    ソフトバンク: "h",
    オリックス: "b",
    楽天: "e",
    西武: "l",
    ロッテ: "m",
    巨人: "g",
    阪神: "t",
    中日: "d",
    広島: "c",
    DeNA: "db",
    ヤクルト: "s",
  };
  const featureTeam = teamNameconverter[teamName];
};

// 入力チーム、日付から個人成績の抽出とテーブル化
const mathdate = (teamName, strDate) => {
  // urlへのアクセス
  const acceessURL = async (teamName, dateStr) => {
    const teamNameconverter = {
      日本ハム: "f",
      ソフトバンク: "h",
      オリックス: "b",
      楽天: "e",
      西武: "l",
      ロッテ: "m",
      巨人: "g",
      阪神: "t",
      中日: "d",
      広島: "c",
      DeNA: "db",
      ヤクルト: "s",
    };
    // 入力日付データの整形
    const featureTeam = teamNameconverter[teamName];
    const date = String(new Date(dateStr));
    const year = String(date.getFullYear(date));
    const month = String(date.getMonth(date).padStart(2, "0"));
    const day = `${month}${date.getDate(date).padStart(2, "0")}`;

    // urlの検索
    const urls = JSON.parse(await readFile("url.json", "utf-8"));
    const url = urls[year][month][day][featureTeaam];

    // ブラウザ起動
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    //
    const tryUrl = async (url) => {
      try {
        const res = await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 5000,
        });
        if (res.status() === 200) {
          return true;
        }
      } catch (err) {
        return false;
      }
    };
  };
  for (let i = 0; i < strDate.length; i++) {}
};
