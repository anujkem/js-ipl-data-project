const fs = require('fs');
const csv = require('csv-parser');

const results = {};

fs.createReadStream('src/data/deliveries.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (data.is_super_over === '1') {
      const bowler = data.bowler;
      if (!results[bowler]) {
        results[bowler] = { runs: 0, balls: 0 };
      }
      results[bowler].runs += parseInt(data.total_runs);
      results[bowler].balls += 1; // Count each ball in a super over
    }
  })
  .on('end', () => {
    Object.keys(results).forEach(bowler => {
      const data = results[bowler];
      data.economy = (data.runs / (data.balls / 6)).toFixed(2); // Calculate economy rate per over
    });
    const sortedBowlers = Object.entries(results).sort((a, b) => a[1].economy - b[1].economy);
    const bestEconomy = sortedBowlers[0];
    fs.writeFileSync('src/public/output/bestSuperOverEconomy.json', JSON.stringify(bestEconomy, null, 4));
    console.log("Best super over economy:", JSON.stringify(bestEconomy, null, 4));
  });