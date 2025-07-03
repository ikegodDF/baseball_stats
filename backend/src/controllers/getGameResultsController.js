// このファイルは試合結果取得APIのビジネスロジック（コントローラー）を記述します。
// 例：DBやjsonからデータを取得し、レスポンスとして返す処理
//
// ここに書くべき内容：
// - リクエストパラメータの取得
// - データ取得処理（DBやjsonファイル）
// - レスポンスの整形と返却
//
import fs from "fs/promises";
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /api/game_results 用コントローラー
export const getGameResults = async (req, res) => {
  // try {
  //   // data/url.jsonの絶対パスを取得
  //   const filePath = path.resolve(__dirname, "../../../data/url.json");
  //   const data = await fs.readFile(filePath, "utf-8");
  //   const json = JSON.parse(data);
  //   res.json(json);
  // } catch (error) {
  //   console.error("API error", error);
  //   res.status(500).json({ error: "データの取得に失敗しました" });
  // }

  try {
    const { selectedDays, selectedTeamName } = req.body;
    if (!selectedDays || !selectedTeamName) {
      return res.status(400).json({
        error: "selectedDaysとselectedTeamIdが必要です",
      });
    }

    const accessURL = async (teamName, date) => {
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = month + String(date.getDate()).padStart(2, "0");

      const urls = JSON.parse(await fs.readFile("url.json", "utf-8"));
      const url = `https://npb.jp${urls[year][month][day][teamName]["href"]}box.html`;
      const homeoraway = urls[year][month][day][teamName]["fora"];
      return { url, homeoraway };
    };

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
      } catch (error) {
        await browser.close();
        return false;
      }
    };

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
        loss: x === "×" ? 1 : 0,
        save: x === "S" ? 1 : 0,
        hold: x === "H" ? 1 : 0,
      };
    };

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

    selectedDays.forEach(async (date) => {
      const { url, homeoraway } = await accessURL(selectedTeamName, date);
      const browserData = await tryUrl(url);
      if (!browserData) return;

      const { browser, page } = browserData;
      const { hitterStatsRaw, pitcherStatsRaw } = await getTable(
        page,
        homeoraway
      );
      convertRowToPlayer(cumulativeStats, {
        hitter: hitterStatsRaw,
        pitcher: pitcherStatsRaw,
      });
      await browser.close();
    });

    res.json(cumulativeStats);
  } catch (error) {
    console.log("API error", error);
    res.status(500).json({ error: "データの取得に失敗しました" });
  }
};
