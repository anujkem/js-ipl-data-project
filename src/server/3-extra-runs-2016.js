const fs = require('fs');
const csv = require('csv-parser');

const results = {};
const year = 2016;

fs.createReadStream('src/data/deliveries.csv')
  .pipe(csv())
  .on('data', (data) => {
    const matchId = parseInt(data.match_id);
    if (matchId >= 577 && matchId <= 636) { // Matches of the year 2016
      const team = data.bowling_team;
      results[team] = (results[team] || 0) + parseInt(data.extra_runs);
    }
  })
  .on('end', () => {
    fs.writeFileSync('src/public/output/extraRuns2016.json', JSON.stringify(results, null, 4));
    console.log("Extra runs conceded per team in 2016:", JSON.stringify(results, null, 4));
  });