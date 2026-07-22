/**
 * fix-missing-coins.js
 *
 * One-time script to credit coins to volunteers whose contributions were
 * approved but whose User.coins was never incremented (the original bug).
 *
 * It finds every completed contributionreward row, sums up the coins per
 * volunteer, compares against User.coins, and applies the delta.
 *
 * Run once:
 *   node src/scripts/fix-missing-coins.js
 *
 * Safe to re-run — it only applies a delta so it won't double-credit.
 */

require('dotenv').config();

const mongoose    = require('mongoose'); // this is the compat layer
const User        = require('../modules/user/user.model');
const supabase    = require('../config/supabase');

async function run() {
  // Connect via compat layer (uses SUPABASE_URL + SUPABASE_KEY)
  await mongoose.connect();
  console.log('[fix-missing-coins] Connected.');

  // 1. Pull all completed contribution rewards from Supabase directly
  const { data: rewards, error } = await supabase
    .from('contributionrewards')
    .select('document')
    .eq('document->>status', 'completed');

  if (error) {
    console.error('[fix-missing-coins] Failed to fetch contribution rewards:', error.message);
    process.exit(1);
  }

  if (!rewards || rewards.length === 0) {
    console.log('[fix-missing-coins] No completed rewards found. Nothing to fix.');
    process.exit(0);
  }

  // 2. Sum coins per volunteer
  const coinsByUser = {};
  for (const row of rewards) {
    const doc = row.document;
    const userId  = String(doc.userId);
    const coins   = Number(doc.coinsAwarded) || 0;
    if (coins > 0) {
      coinsByUser[userId] = (coinsByUser[userId] || 0) + coins;
    }
  }

  console.log(`[fix-missing-coins] Found ${Object.keys(coinsByUser).length} volunteers with awarded coins.`);

  // 3. For each volunteer, calculate delta and apply
  let fixed = 0;
  let skipped = 0;

  for (const [userId, totalAwarded] of Object.entries(coinsByUser)) {
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`[fix-missing-coins] User ${userId} not found — skipping.`);
      skipped++;
      continue;
    }

    const currentCoins = Number(user.coins) || 0;
    const delta = totalAwarded - currentCoins;

    if (delta <= 0) {
      console.log(`[fix-missing-coins] ${user.name} (${userId}) — already has ${currentCoins} coins, awarded ${totalAwarded}. OK.`);
      skipped++;
      continue;
    }

    await User.updateOne({ _id: userId }, { $inc: { coins: delta } });
    console.log(`[fix-missing-coins] ✅ ${user.name} (${userId}) — credited ${delta} missing coins (was ${currentCoins}, should be ${totalAwarded}).`);
    fixed++;
  }

  console.log(`\n[fix-missing-coins] Done. Fixed: ${fixed}, Skipped/already correct: ${skipped}.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('[fix-missing-coins] Fatal error:', err.message);
  process.exit(1);
});
