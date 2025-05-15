const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const takeURL = async (year, month) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(`https://npb.jp/games/${year}/schedule_${month}_detail.html`);

        const links = await page.$$eval(`div.table_normal.summary_table tbody a`, elements =>
            elements.map(element => {
                // テキストの整形関数(空白の削除)
                const cleanText = (text) => {
                    return text.replace(/\s+/g, ' ').trim();
                }

                const row = element.closest('tr');
                const href = element.getAttribute('href')
                const teams = href.match(/\/scores\/\d{4}\/\d{4}\/([a-z]+)\-([a-z]+)\-/i);
                const score = cleanText(element.textContent);

                return {
                    href: href,
                    date: element.getAttribute('href').match(/\/scores\/\d{4}\/(\d{4})\//)[1],
                    teams: [teams[1],teams[2]],
                    score: score
                }
            })
        );

        await browser.close();

        const groupedByDate = links.reduce((acc,game)=> {
            const date = game.date;
            if(!acc[date]){
                acc[date] = [];
            }
            acc[date].push({
                href: game.href,
                score: game.score,
                teams: game.teams
            });
            return acc;
        }, {});
        
        return groupedByDate;
    } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
        await browser.close();
        return [];
    }
}

const years = ["2002","2023","2024","2025"];
const months = ["03","04","05","06","07","08","09","10"];
const year = {};
const promises = [];

for(let i = 0; i < years.length; i++){
    year[years[i]] = {};
    for(let j = 0; j < months.length;j++){
        year[years[i]][months[j]] = [];
        const p =takeURL(years[i],months[j]).then(result => {
            year[years[i]][months[j]].push(result);;
        });
        promises.push(p);
    }
}

// 全部終わってからまとめて使う
Promise.all(promises).then(() => {
    fs.writeFile("url.json", JSON.stringify(year, null ,2));
});
