const mongoose = require('./src/mongoose-compat');
require('dotenv').config();

async function run() {
  await mongoose.connect();
  const User = mongoose.model('User', new mongoose.Schema({}));
  
  console.log('Fetching users...');
  const users = await User.find({});
  console.log(`Found ${users.length} users:`);
  for (const u of users) {
    console.log(JSON.stringify(u.toObject(), null, 2));
  }
  await mongoose.disconnect();
}

run().catch(console.error);
