require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const imageMap = {
  'Disha Official T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
  'Volunteer Recognition Certificate': 'https://images.unsplash.com/photo-1589330694653-efa63704b2c1?q=80&w=1000&auto=format&fit=crop',
  'TalentGrow Learning Coupon - 25% Off': 'https://images.unsplash.com/photo-1555529771-835f59bfc50c?q=80&w=1000&auto=format&fit=crop',
  'Online Course Access - Python for Beginners': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000&auto=format&fit=crop',
  'DFI Branded Water Bottle': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop',
  'Scholarship Application Fee Waiver': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
  'Amazon Gift Voucher - Rs. 500': 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1000&auto=format&fit=crop',
  'Limited Edition Disha Hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
  'Professional Resume Review': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop',
  'E-Book: The Art of Volunteering': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop'
};

async function runMigration() {
  console.log('Starting image population script...');

  const { data: rewards, error: fetchErr } = await supabase.from('rewardcatalogs').select('*');
  if (fetchErr) throw fetchErr;

  console.log(`Found ${rewards.length} existing rewards in Supabase 'rewardcatalogs' table.`);
  
  for (const reward of rewards) {
    const doc = reward.document;
    let imageUrl = doc.image;
    
    // Assign missing image
    if ((!imageUrl || imageUrl === '') && imageMap[doc.name]) {
      imageUrl = imageMap[doc.name];
      doc.image = imageUrl;
      
      const { error: updateErr } = await supabase
        .from('rewardcatalogs')
        .update({ document: doc })
        .eq('_id', reward._id);

      if (updateErr) {
        console.error('Error updating reward:', doc.name, updateErr);
      } else {
        console.log('Successfully updated missing image for:', doc.name);
      }
    }
  }

  console.log('Image population complete!');
  process.exit(0);
}

runMigration().catch(console.error);
