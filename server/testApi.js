const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
  try {
    // 1. Login to get JWT
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'induaggarwal@gmail.com',
      password: 'Password@123'
    });
    
    if (error) throw error;
    
    console.log('Successfully logged into Supabase. Got JWT.');
    
    const token = data.session.access_token;
    
    // 2. Make request to our API
    const response = await fetch('http://localhost:5000/api/v1/rewards/admin/marketplace', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test Laptop (Auth Fix Test)',
        description: 'Test description',
        category: 'Technology',
        pointsCost: 50,
        coinCost: 50,
        stock: 5,
        isActive: true,
        autoGenerateImage: true
      })
    });
    
    const resData = await response.json();
    console.log('API Status:', response.status);
    console.log('API Response:', resData);
  } catch(e) {
    console.error('API Error:', e);
  }
}
test();
