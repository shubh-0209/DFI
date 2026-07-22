/* eslint-disable */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const rewardCatalogService = require('../modules/reward/rewardCatalog.service');

async function listAllRewards() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  await new Promise(resolve => global.setTimeout(resolve, 2000));
  const { items: rewards } = await rewardCatalogService.getCatalog({ limit: 1000 });
  
  console.log('--- ALL REWARDS ---');
  rewards.forEach(r => {
    console.log(`Title: ${r.name}`);
    console.log(`Category: ${r.category}`);
    console.log(`Description: ${r.description}`);
    console.log(`Cost: ${r.coinCost}`);
    console.log('-------------------');
  });
  
  process.exit(0);
}

listAllRewards();
