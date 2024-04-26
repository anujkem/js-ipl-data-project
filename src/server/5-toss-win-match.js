const fs = require('fs');
const csv = require('csv-parser');

const results = {};

fs.createReadStream('src/data/matches.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (data.toss_winner === data.winner) {
      results[data.toss_winner] = (results[data.toss_winner] || 0) + 1;
    }
  })
  .on('end', () => {
    fs.writeFileSync('src/public/output/tossWinMatch.json', JSON.stringify(results, null, 4));
    console.log("Number of times each team won the toss and also won the match:", JSON.stringify(results, null, 4));
  });