const puppeteer = require("puppeteer");

const scrapeData = async () => {
  // Puppeteerでブラウザを起動
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // 試合結果ページにアクセス
  const url = "https://npb.jp/scores/2022/0325/h-f-01/box.html";
  await page.goto(url, { waitUntil: "load" });

  // セレクタが見つかるまで待つ
  await page.waitForSelector("#tablefix_t_b");

  // テーブルの行データをすべて取得
  const playerStatsRaw = await page.$$eval("#tablefix_t_b tbody tr", (rows) =>
    rows.map((row) => {
      const cells = row.querySelectorAll("td");
      return Array.from(cells).map((cell) => cell.innerText.trim());
    })
  );

  const cumulativeStats = {};

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

  const addPlayerStats = (cumulative, player) => {
    const name = player.name;
    if (!cumulative[name]) {
      cumulative[name] = {
        position: player.stats.position,
        atBats: player.stats.runs,
        hits: player.stats.hits,
        rbi: player.stats.rbi,
        steals: player.stats.steals,
        results: [...player.stats.results],
      };
    } else {
      const p = cumulative[name];
      p.atBats += player.stats.atBats;
      p.runs += player.stats.runs;
      p.hits += player.stats.hits;
      p.rbi += player.stats.rbi;
      p.steals += player.stats.steals;
      p.results.push(...player.stats.results);
    }
  };

  for (const row of playerStatsRaw) {
    if (row.length < 8) continue;
    const player = convertRowToPlayer(row);
    addPlayerStats(cumulativeStats, player);
  }

  await browser.close();
  console.log(JSON.stringify(cumulativeStats, null, 2));
};

scrapeData();
