const fs = require('fs');
const csv = require('csv-parser');

const results = {};

fs.createReadStream('src/data/matches.csv')
  .pipe(csv())
  .on('data', (data) => {
    const season = data.season;
    const playerOfMatch = data.player_of_match;
    if (!results[season]) {
      results[season] = {};
    }
    if (playerOfMatch) {
      results[season][playerOfMatch] = (results[season][playerOfMatch] || 0) + 1;
    }
  })
  .on('end', () => {
    const summary = {};
    for (const season in results) {
      const players = Object.keys(results[season]);
      const maxAwardsPlayer = players.reduce((a, b) => results[season][a] > results[season][b] ? a : b);
      summary[season] = { player: maxAwardsPlayer, awards: results[season][maxAwardsPlayer] };
    }
    fs.writeFileSync('src/public/output/playerOfMatchSeason.json', JSON.stringify(summary, null, 4));
    console.log("Player of the Match awards per season:", JSON.stringify(summary, null, 4));
  });