/* eslint-disable */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');
const rewardCatalogService = require('../modules/reward/rewardCatalog.service');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const imageMappings = [
  {
    matchTitle: 'Disha Volunteering Kit',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\disha_volunteering_kit_1783694667664.png',
    newTitle: 'Disha Volunteering Kit'
  },
  {
    matchTitle: 'Online Course Access - Python for Beginners',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\online_course_python_1783694679084.png',
    newTitle: 'Online Course Access - Python for Beginners'
  },
  {
    matchTitle: 'Scholarship Application Fee Waiver',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\scholarship_fee_waiver_1783694687930.png',
    newTitle: 'Scholarship Application Fee Waiver'
  },
  {
    matchTitle: 'Amazon Gift Voucher - Rs. 500',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\gift_voucher_reward_1783694700156.png',
    newTitle: 'Disha Gift Voucher - Rs. 500' // Changing title to avoid Amazon branding
  },
  {
    matchTitle: 'Professional Resume Review',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\professional_resume_builder_1783694711321.png',
    newTitle: 'Professional Resume Builder'
  },
  {
    matchTitle: 'E-Book: The Art of Volunteering',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\educational_book_reward_1783694723145.png',
    newTitle: 'E-Book: The Art of Volunteering'
  }
];

async function uploadAndSync() {
  console.log('--- Starting AI Image Upload & Database Sync ---');
  

  await new Promise(resolve => global.setTimeout(resolve, 2000));
  
  const { items: allRewards } = await rewardCatalogService.getCatalog({ limit: 1000 });
  
  for (const mapping of imageMappings) {
    const reward = allRewards.find(r => r.name === mapping.matchTitle);
    
    if (!reward) {
      console.warn(`Could not find reward with title: ${mapping.matchTitle}`);
      continue;
    }
    
    console.log(`\nProcessing: ${mapping.matchTitle}`);
    
    try {
      // 1. Read file
      const fileBuffer = fs.readFileSync(mapping.filePath);
      const fileName = path.basename(mapping.filePath);
      
      // 2. Upload to Supabase Storage
      console.log(`Uploading ${fileName} to Supabase...`);
      const { data, error } = await supabase.storage
      const { error } = await supabase.storage
        .from('marketplace-assets')
        .upload(`ai-rewards/${fileName}`, fileBuffer, {
          contentType: 'image/png',
          upsert: true
        });
        
      if (error) {
        throw new Error(`Upload error: ${error.message}`);
      }
      
      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('marketplace-assets')
        .getPublicUrl(`ai-rewards/${fileName}`);
        
      console.log(`Uploaded successfully: ${publicUrl}`);
      
      // 4. Update Database
      await rewardCatalogService.updateReward(reward._id, {
        name: mapping.newTitle,
        image: publicUrl,
        image_url: publicUrl,
        image_source: 'nano_banana_ai',
        image_generated: true
      });
      
      console.log(`✅ Database updated for ${mapping.newTitle}`);
      
    } catch (err) {
      console.error(`❌ Failed to process ${mapping.matchTitle}:`, err.message);
    }
  }
  
  console.log('\n--- Sync Complete ---');
  process.exit(0);
}

uploadAndSync();
