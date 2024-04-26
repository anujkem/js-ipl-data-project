const fs = require('fs');
const csv = require('csv-parser');

const results = {};

fs.createReadStream('src/data/deliveries.csv')
  .pipe(csv())
  .on('data', (data) => {
    const matchId = parseInt(data.match_id);
    if (matchId >= 518 && matchId <= 576) { // Matches of the year 2015
      const bowler = data.bowler;
      if (!results[bowler]) {
        results[bowler] = { runs: 0, balls: 0 };
      }
      if (data.noball_runs === '0' && data.wide_runs === '0') {
        results[bowler].balls += 1;
        results[bowler].runs += parseInt(data.total_runs);
      }
    }
  })
  .on('end', () => {
    const bowlers = Object.keys(results).map(bowler => ({
      bowler,
      economy: results[bowler].balls > 0 ? (results[bowler].runs / results[bowler].balls) * 6 : Infinity
    })).sort((a, b) => a.economy - b.economy).slice(0, 10);
    
    fs.writeFileSync('src/public/output/topEconomicalBowlers2015.json', JSON.stringify(bowlers, null, 4));
    console.log("Top 10 economical bowlers in 2015:", JSON.stringify(bowlers, null, 4));
  });