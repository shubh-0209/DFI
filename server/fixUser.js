require('dotenv').config();
const User = require('./src/modules/user/user.model');

async function fix() {
  try {
    const user = await User.findOne({ email: 'induaggarwal@gmail.com' });
    console.log('Current user:', user);
    
    if (user) {
      console.log('Updating role to ADMIN...');
      user.role = 'ADMIN';
      await user.save();
      console.log('Updated user:', await User.findOne({ email: 'induaggarwal@gmail.com' }));
    } else {
      console.log('User not found!');
    }
  } catch(e) {
    console.error(e);
  }
}
fix();
