import express from "express";
import mysql from "mysql2";
import puppeteer from "puppeteer";
import { readFile } from "fs/promises";

const app = express();
app.use(express.json());
app.use(express.static("website"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "ikegodDF",
  password: "tamtam24",
  database: "baseballstats",
});

//2022~2025にかけて選手情報保存する
const getdate = async () => {};

// スクレイピング&データほぞんお試し
const scrapeData = async (teamName, dateStr) => {
  const teamShortNames = {
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
  console.log(teamName);
  console.log(dateStr);

  const buildUrl = async (teamName, dateStr) => {
    const featuredTeam = teamShortNames[teamName];
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const yyyymmdd = `${month}${day}`;

    const gameListUrl = `https://npb.jp/scores/${year}/${yyyymmdd}/`;

    const opponents = Object.values(teamShortNames).filter(
      (t) => t !== featuredTeam
    );
    const gameNums = Array.from({ length: 25 }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

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

    if (parseInt(month) === 6) {
      for (const opp of opponents) {
        for (const num of gameNums) {
          let testUrl = `${gameListUrl}/${featuredTeam}-${opp}-${num}/box.html`;
          let isUrlValid = await tryUrl(testUrl);
          if (isUrlValid) {
            console.log(testUrl);
            return { browser, page };
          } else {
          }
          testUrl = `${gameListUrl}/${opp}-${featuredTeam}-${num}/box.html`;
          isUrlValid = await tryUrl(testUrl);
          if (isUrlValid) {
            console.log(testUrl);
            return { browser, page };
          } else {
          }
        }
      }
    } else {
      for (const opp of opponents) {
        for (const num of gameNums) {
          let testUrl = `${gameListUrl}/${featuredTeam}-${opp}-${num}/box.html`;
          let isUrlValid = await tryUrl(testUrl);
          if (isUrlValid) {
            console.log(testUrl);
            return { browser, page };
          } else {
            console.log(testUrl);
          }
          testUrl = `${gameListUrl}/${opp}-${featuredTeam}-${num}/box.html`;
          isUrlValid = await tryUrl(testUrl);
          if (isUrlValid) {
            console.log(testUrl);
            return { browser, page };
          } else {
          }
        }
      }
    }
    await browser.close();
    throw new Error("有効な試合ページが見つかりませんでした");
  };

  const { browser, page } = await buildUrl(teamName, dateStr);

  // // Puppeteerでブラウザを起動
  // const browser = await puppeteer.launch({ headless: true });
  // const page = await browser.newPage();

  // // 試合結果ページにアクセス
  // const url = "https://npb.jp/scores/2022/0325/h-f-01/box.html";
  // await page.goto(url, { waitUntil: "load" });

  // セレクタが見つかるまで待つ
  await page.waitForSelector("#tablefix_t_b");

  // テーブルの行データをすべて取得
  const playerStatsRaw = await page.$$eval("#tablefix_t_b tbody tr", (rows) =>
    rows.map((row) => {
      const cells = row.querySelectorAll("td");
      return Array.from(cells).map((cell) => cell.innerText.trim());
    })
  );

  // 個人成績の記録
  const cumulativeStats = {};

  // 読み込んだデータの成形
  const convertRowToPlayer = (row) => {
    const [no, pos, name, atBats, runs, hits, rbi, steals, ...results] = row;

    return {
      name,
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

  // 個人成績の記録,加算
  const addPlayerStats = (player) => {
    console.log(player);
    if (!player?.stats?.atBats || !player.name) {
      console.warn("不正なplayerデータをスキップ:", player);
      return;
    }

    const player_name = player.name;
    const player_id = player.stats.atBats;
    connection.query(
      "INSERT INTO players (player_id, player_name) VALUES (?, ?)",
      [player.stats.atBats, player.name],
      (err, results) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Inserted: ${player}`);
        }
      }
    );
  };

  for (const row of playerStatsRaw) {
    if (row.length < 8) continue;
    const player = convertRowToPlayer(row);
    addPlayerStats(player);
  }

  await browser.close();
};

scrapeData("日本ハム", "2024-04-03");

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
