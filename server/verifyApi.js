const axios = require('axios');

async function checkApi() {
  try {
    const res = await axios.get('http://localhost:5000/api/v1/rewards/marketplace');
    const rewards = res.data.data;
    
    const smartWatch = rewards.find(r => (r.name && r.name.toLowerCase().includes('smart watch')) || (r.title && r.title.toLowerCase().includes('smart watch')));
    
    if (smartWatch) {
      console.log('API still returned Smart Watch:', smartWatch);
    } else {
      console.log('Verification Success: API no longer returns Smart Watch.');
    }
  } catch(e) {
    console.error('Error fetching API:', e.message);
  }
}
checkApi();
