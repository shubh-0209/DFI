const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function findAndDelete() {
  try {
    // Fetch all reward catalogs
    const { data, error } = await supabase.from('rewardcatalogs').select('*');
    if (error) throw error;
    
    let deletedCount = 0;
    
    for (const row of data) {
      const doc = row.document;
      const title = doc.name || doc.title || '';
      
      if (title.toLowerCase().includes('smart watch') || title.toLowerCase().includes('smartwatch')) {
        console.log('Found matching record to delete:', doc);
        const { error: delError } = await supabase.from('rewardcatalogs').delete().eq('_id', row._id);
        if (delError) {
          console.error('Error deleting record:', delError);
        } else {
          console.log('Successfully deleted record with _id:', row._id);
          deletedCount++;
        }
      }
    }
    
    if (deletedCount === 0) {
      console.log('No matching "Smart Watch" record found.');
    }
  } catch (err) {
    console.error('Script Error:', err);
  }
}
findAndDelete();
