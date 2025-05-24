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
const mathdate = async (teamName, strDate) => {
  // urlの探索
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
    const url = `npb.jp${urls[year][month][day][featureTeam]["href"]}box.html`;
    return url;
  };

  //urlへのアクセス
  const tryUrl = async (url) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
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

  // テーブルの取得
  const getTable = async () => {
    if (urls[year][month][day][featureTeam]["fora"] === "home") {
      await page.waitForSelector("#tablefix_b_b");
      const hitterStatsRaw = await page.$$eval(
        "#tablefix_b_b tbody tr",
        (rows) =>
          rows.map((row) => {
            const cells = row.querySelectorAll("td");
            return Array.from(cells).map((cell) => cell.innerText.trim());
          })
      );
      await page.waitForSelector("#tablefix_b_p");
      const pitcherStatsRaw = await page.$$eval(
        "#tablefix_b_p tbody tr",
        (rows) =>
          rows.map((row) => {
            const cells = row.querySelectorAll("td");
            return Array.from(cells).map((cell) => cell.innerText.trim());
          })
      );
      return { hitterStatsRaw, pitcherStatsRaw };
    } else if (urls[year][month][day][featureTeam]["fora"] === "away") {
      await page.waitForSelector("#tablefix_t_b");
      const hitterStatsRaw = await page.$$eval(
        "#tablefix_t_b tbody tr",
        (rows) =>
          rows.map((row) => {
            const cells = row.querySelectorAll("td");
            return Array.from(cells).map((cell) => cell.innerText.trim());
          })
      );
      await page.waitForSelector("#tablefix_t_p");
      const pitcherStatsRaw = await page.$$eval(
        "#tablefix_t_p tbody tr",
        (rows) =>
          rows.map((row) => {
            const cells = row.querySelectorAll("td");
            return Array.from(cells).map((cell) => cell.innerText.trim());
          })
      );
      return { hitterStatsRaw, pitcherStatsRaw };
    }
  };

  // データ整形(打者)
  const convertRowToHitter = (row) => {
    const [no, pos, name, atBats, runs, hits, rbi, steals, ...results] = row;
    return {
      number: parseInt(no) || 0,
      name: name,
      position: pos || "",
      stats: {
        atBats: parseInt(atBats) || 0,
        runs: parseInt(runs) || 0,
        hits: parseInt(hits) || 0,
        rbi: parseInt(rbi) || 0,
        steals: parseInt(steals) || 0,
        results: results.filter((r) => r && r !== "-"),
      },
    };
  };

  // データ整形(投手)
  const convertRowToPitcher = (row) => {
    const [
      x,
      name,
      pitches,
      ip,
      hits,
      homeruns,
      walks,
      hbp,
      strikeouts,
      wp,
      bk,
      r,
      er,
    ] = row;
    return {
      name: name,
      pitches: parseInt(pitches) || 0,
      innings: parseFloat(ip) || 0,
      hits: parseInt(hits) || 0,
      homeruns: parseInt(homeruns) || 0,
      walks: parseInt(walks) || 0,
      hbp: parseInt(hbp) || 0,
      strikeouts: parseInt(strikeouts) || 0,
      wp: parseInt(wp) || 0,
      bk: parseInt(bk) || 0,
      r: parseInt(r) || 0,
      er: parseInt(er) || 0,
      win: x === "○" ? 1 : 0,
      loss: x === "●" ? 1 : 0,
      save: x === "S" ? 1 : 0,
      hold: x === "H" ? 1 : 0,
    };
  };

  // 入力された日付データからデータ取得＆整形
  for (let i = 0; i < strDate.length; i++) {
    const url = await acceessURL(teamName, strDate[i]);
  }
};
