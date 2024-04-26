const fs = require('fs');
const csv = require('csv-parser');

const results = {};

fs.createReadStream('src/data/deliveries.csv')
  .pipe(csv())
  .on('data', (data) => {
    const batsman = data.batsman;
    const bowler = data.bowler;
    const dismissalKind = data.dismissal_kind;
    if (dismissalKind && dismissalKind !== 'run out' && dismissalKind !== 'retired hurt' && dismissalKind !== 'obstructing the field') {
      const key = `${batsman} dismissed by ${bowler}`;
      results[key] = (results[key] || 0) + 1;
    }
  })
  .on('end', () => {
    fs.writeFileSync('src/public/output/playerDismissals.json', JSON.stringify(results, null, 4));
    console.log("Player dismissals data:", JSON.stringify(results, null, 4));
  });