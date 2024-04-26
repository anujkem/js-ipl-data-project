const fs = require('fs');
const csv = require('csv-parser');

const results = {};

fs.createReadStream('src/data/deliveries.csv')
  .pipe(csv())
  .on('data', (data) => {
    const season = data.season;
    const batsman = data.batsman;
    const runs = parseInt(data.batsman_runs);
    if (!results[season]) {
      results[season] = {};
    }
    if (!results[season][batsman]) {
      results[season][batsman] = { runs: 0, balls: 0 };
    }
    results[season][batsman].runs += runs;
    results[season][batsman].balls += 1; // Count every delivery faced
  })
  .on('end', () => {
    Object.keys(results).forEach(season => {
      Object.keys(results[season]).forEach(batsman => {
        const data = results[season][batsman];
        data.strikeRate = (data.runs / data.balls) * 100;
      });
    });
    fs.writeFileSync('src/public/output/batsmanStrikeRate.json', JSON.stringify(results, null, 4));
    console.log("Batsman strike rate per season:", JSON.stringify(results, null, 4));
  });