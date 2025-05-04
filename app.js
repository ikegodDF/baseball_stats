const puppeteer = require("puppeteer");

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

  const { browser, page } = await buildUrl("日本ハム", "2024-06-05");

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
