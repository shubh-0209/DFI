
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const rewardCatalogService = require('../modules/reward/rewardCatalog.service');
const aiImageService = require('../modules/reward/aiImage.service');
const rewardImageService = require('../modules/reward/rewardImage.service');
const { generateRewardImagePrompt } = require('../modules/reward/rewardPrompt.builder');

async function auditAndRegenerateRewards() {
  console.log('--- Starting Marketplace Reward Image Audit ---');

  try {
    // Wait for Supabase HTTP Client (mongoose-compat) to initialize

//     await new Promise(resolve => setTimeout(resolve, 2000));

    await new Promise(resolve => global.setTimeout(resolve, 2000));


    const { items: rewards } = await rewardCatalogService.getCatalog({ limit: 1000 });
    
    console.log(`Found ${rewards.length} rewards to audit.`);

    let updatedCount = 0;

    for (const reward of rewards) {

      console.log(`\nAuditing: ${reward.name} (${reward.category})`);
      
      const prompt = generateRewardImagePrompt({
        title: reward.name,
        category: reward.category,
        description: reward.description
      });
      
      console.log(`Generated Prompt snippet: ${prompt.slice(0, 100)}...`);

      let newImageUrl = '';

      if (reward.image && !reward.image.includes('placeholder') && !reward.image.includes('localhost') && reward.image_source !== 'manual') {
        continue;
      }
      
      console.log(`Auditing reward: ${reward.name} (Source: ${reward.image_source || 'Unknown'})`);
      
      const prompt = generateRewardImagePrompt(reward.name, reward.category);
      let newImageUrl;

      let imageGenerated = false;
      let imageSource = 'manual';

      try {
        console.log(`Attempting AI generation for ${reward.name}...`);
        newImageUrl = await aiImageService.generateAndUploadImage(prompt);
        imageGenerated = true;
        imageSource = 'ai_generated';
        console.log(`✅ Successfully generated AI image for ${reward.name}`);

      } catch (err) {

      } catch (_err) {

        console.warn(`⚠️ AI generation failed (likely missing API key). Falling back to generic image.`);
        newImageUrl = rewardImageService.assignImage(reward.name, reward.category);
        imageGenerated = true;
        imageSource = 'automatic';
      }

      // Update the database record
      await rewardCatalogService.updateReward(reward._id, {
        image: newImageUrl,
        image_url: newImageUrl,
        image_source: imageSource,
        image_generated: imageGenerated
      });

      console.log(`Updated ${reward.name} with new image_url: ${newImageUrl}`);
      updatedCount++;
    }

    console.log(`\n--- Audit Complete ---`);
    console.log(`Successfully updated ${updatedCount} rewards.`);
    process.exit(0);

  } catch (error) {
    console.error('Audit failed:', error);
    process.exit(1);
  }
}

auditAndRegenerateRewards();
