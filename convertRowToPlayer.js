import { readFile } from "fs/promises";
import puppeteer from "puppeteer";

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
    const date = new Date(dateStr);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = `${month}${String(date.getDate()).padStart(2, "0")}`;

    // urlの検索
    const urls = JSON.parse(await readFile("url.json", "utf-8"));
    const url = `https://npb.jp${urls[year][month][day][featureTeam]["href"]}box.html`;
    const homeoraway = urls[year][month][day][featureTeam]["fora"];
    return { url, homeoraway };
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
        return { browser, page };
      }
    } catch (err) {
      await browser.close();
      return false;
    }
  };

  // テーブルの取得
  const getTable = async (page, homeoraway) => {
    if (homeoraway === "home") {
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
    } else if (homeoraway === "away") {
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
      batter,
      pitches,
      ip,
      voids,
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

  // 個人成績の記録(打者)
  const addHitterStats = (cumulative, hitter) => {
    const name = hitter.name;
    if (!cumulative[name]) {
      cumulative[name] = {
        position: hitter.position,
        atBats: hitter.stats.atBats,
        runs: hitter.stats.runs,
        hits: hitter.stats.hits,
        rbi: hitter.stats.rbi,
        steals: hitter.stats.steals,
      };
    } else {
      const p = cumulative[name];
      p.atBats += hitter.stats.atBats;
      p.runs += hitter.stats.runs;
      p.hits += hitter.stats.hits;
      p.rbi += hitter.stats.rbi;
      p.steals += hitter.stats.steals;
    }
  };

  // 個人成績の記録(投手)
  const addPitcherStats = (cumulative, pitcher) => {
    const name = pitcher.name;
    if (!cumulative[name]) {
      cumulative[name] = pitcher;
    } else {
      const p = cumulative[name];
      p.pitches += pitcher.pitches;
      p.innings += pitcher.innings;
      p.hits += pitcher.hits;
      p.homeruns += pitcher.homeruns;
      p.walks += pitcher.walks;
      p.hbp += pitcher.hbp;
      p.strikeouts += pitcher.strikeouts;
      p.wp += pitcher.wp;
      p.bk += pitcher.bk;
      p.r += pitcher.r;
      p.er += pitcher.er;
      p.win += pitcher.win;
      p.loss += pitcher.loss;
      p.save += pitcher.save;
      p.hold += pitcher.hold;
    }
  };

  const convertRowToPlayer = (cumulative, { hitter, pitcher }) => {
    for (const row of hitter) {
      const player = convertRowToHitter(row);
      addHitterStats(cumulative.hitter, player);
    }
    for (const row of pitcher) {
      const player = convertRowToPitcher(row);
      addPitcherStats(cumulative.pitcher, player);
    }
  };

  const cumulativeStats = { hitter: {}, pitcher: {} };

  // 入力された日付データからデータ取得＆整形
  for (let i = 0; i < strDate.length; i++) {
    const { url, homeoraway } = await acceessURL(teamName, strDate[i]);
    const browserData = await tryUrl(url);
    if (!browserData) continue;

    const { browser, page } = browserData;
    const { hitterStatsRaw, pitcherStatsRaw } = await getTable(
      page,
      homeoraway
    );
    await convertRowToPlayer(cumulativeStats, {
      hitter: hitterStatsRaw,
      pitcher: pitcherStatsRaw,
    });
    await browser.close();
  }
  return cumulativeStats;
};

const homedays = [
  "2022-03-29",
  "2022-03-30",
  "2022-03-31",
  "2022-05-27",
  "2022-08-10",
  "2022-08-16",
  "2022-9-12",
  "2022-09-13",
  "2022-09-28",
  "2023-03-30",
  "2023-06-06",
  "2023-06-17",
  "2023-8-18",
  "2023-8-19",
  "2023-8-20",
  "2023-09-08",
  "2023-09-28",
  "2024-03-29",
  "2024-03-30",
  "2024-04-02",
  "2024-04-03",
  "2024-04-06",
  "2024-04-16",
  "2024-06-04",
  "2024-06-05",
  "2024-06-06",
  "2024-06-07",
  "2024-06-14",
  "2024-06-15",
  "2024-10-13",
  "2024-10-17",
  "2024-10-18",
  "2025-03-28",
  "2025-03-29",
  "2025-04-01",
  "2025-04-23",
];

mathdate("日本ハム", homedays)
  .then((result) => console.log(result))
  .catch((error) => console.error("エラーが発生しました:", error));
