const fs = require('fs');
const csv = require('csv-parser');

const results = {};

fs.createReadStream('src/data/matches.csv')
  .pipe(csv())
  .on('data', (data) => {
    const year = data.season;
    const winner = data.winner;
    if (winner) { // Ensure that there is a winner for the match
        if (!results[year]) {
            results[year] = {};
        }
        results[year][winner] = (results[year][winner] || 0) + 1;
    }
  })
  .on('end', () => {
    const outputPath = 'src/public/output/matchesWonPerTeamPerYear.json';
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 4));
    console.log(`Matches won per team per year data saved to ${outputPath}.`);
    console.log("Results:", JSON.stringify(results, null, 4));
  });