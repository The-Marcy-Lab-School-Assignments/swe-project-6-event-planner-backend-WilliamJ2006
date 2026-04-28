require('dotenv').config();
const rsvpModel = require('./models/rsvpModel');

(async () => {
  console.log(await rsvpModel.rsvpsByUser(1));
  process.exit();
})();
