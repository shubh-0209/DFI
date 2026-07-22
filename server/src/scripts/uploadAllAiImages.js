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
  // Previous 6
  {
    matchTitle: 'Disha Volunteering Kit',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\disha_volunteering_kit_1783694667664.png'
  },
  {
    matchTitle: 'Online Course Access - Python for Beginners',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\online_course_python_1783694679084.png'
  },
  {
    matchTitle: 'Scholarship Application Fee Waiver',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\scholarship_fee_waiver_1783694687930.png'
  },
  {
    matchTitle: 'Disha Gift Voucher - Rs. 500', // Was updated previously
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\gift_voucher_reward_1783694700156.png'
  },
  {
    matchTitle: 'Professional Resume Builder', // Was updated previously
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\professional_resume_builder_1783694711321.png'
  },
  {
    matchTitle: 'E-Book: The Art of Volunteering',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\educational_book_reward_1783694723145.png'
  },
  // New 10
  {
    matchTitle: 'Disha Ceramic Coffee Mug',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\disha_ceramic_coffee_mug_1783695718979.png'
  },
  {
    matchTitle: 'Premium Study Laptop',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\premium_study_laptop_1783695730731.png'
  },
  {
    matchTitle: 'Smart Study Phone',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\smart_study_phone_1783695742064.png'
  },
  {
    matchTitle: 'DFI Premium Laptop Sleeve',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\dfi_premium_laptop_sleeve_1783695752694.png'
  },
  {
    matchTitle: 'TalentGrow Learning Coupon - 25% Off',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\talentgrow_learning_coupon_1783695763095.png'
  },
  {
    matchTitle: 'DFI Branded Water Bottle',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\dfi_branded_water_bottle_1783695773850.png'
  },
  {
    matchTitle: 'Volunteer Recognition Certificate',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\volunteer_recognition_certificate_1783695787452.png'
  },
  {
    matchTitle: 'Disha Official Keychain',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\disha_official_keychain_1783695797853.png'
  },
  {
    matchTitle: 'Disha Official T-Shirt',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\disha_official_tshirt_1783695810240.png'
  },
  {
    matchTitle: 'Limited Edition Disha Hoodie',
    filePath: 'C:\\Users\\Dhruv\\.gemini\\antigravity-ide\\brain\\7fe36578-54b2-4880-949c-31e3c7226b70\\limited_edition_disha_hoodie_1783695820063.png'
  }
];

async function uploadAndSync() {
  console.log('--- Starting Full AI Image Upload & Database Sync ---');
  
  await new Promise(resolve => global.setTimeout(resolve, 2000));
  
  const { items: allRewards } = await rewardCatalogService.getCatalog({ limit: 1000 });
  
  for (const mapping of imageMappings) {
    let reward = allRewards.find(r => r.name === mapping.matchTitle);
    
    // Fallbacks for the renamed rewards just in case
    if (!reward && mapping.matchTitle === 'Disha Gift Voucher - Rs. 500') {
       reward = allRewards.find(r => r.name === 'Amazon Gift Voucher - Rs. 500');
    }
    if (!reward && mapping.matchTitle === 'Professional Resume Builder') {
       reward = allRewards.find(r => r.name === 'Professional Resume Review');
    }
    
    if (!reward) {
      console.warn(`Could not find reward with title: ${mapping.matchTitle}`);
      continue;
    }
    
    console.log(`\nProcessing: ${reward.name}`);
    
    try {
      if (!fs.existsSync(mapping.filePath)) {
         throw new Error(`File not found: ${mapping.filePath}`);
      }
      
      const fileBuffer = fs.readFileSync(mapping.filePath);
      const fileName = path.basename(mapping.filePath);
      
      console.log(`Uploading ${fileName} to Supabase...`);
      const { error } = await supabase.storage
        .from('marketplace-assets')
        .upload(`ai-rewards/${fileName}`, fileBuffer, {
          contentType: 'image/png',
          upsert: true
        });
        
      if (error) {
        throw new Error(`Upload error: ${error.message}`);
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('marketplace-assets')
        .getPublicUrl(`ai-rewards/${fileName}`);
        
      console.log(`Uploaded successfully: ${publicUrl}`);
      
      await rewardCatalogService.updateReward(reward._id, {
        image: publicUrl,
        image_url: publicUrl,
        image_source: 'nano_banana_ai',
        image_generated: true,
        // Make sure we update the title if it was changed
        name: mapping.matchTitle 
      });
      
      console.log(`✅ Database updated for ${mapping.matchTitle}`);
      
    } catch (err) {
      console.error(`❌ Failed to process ${mapping.matchTitle}:`, err.message);
    }
  }
  
  console.log('\n--- Sync Complete ---');
  process.exit(0);
}

uploadAndSync();
