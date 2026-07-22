const supabase = require('../config/supabase');

/**
 * Generate a sequential Volunteer ID in the format DISHAXXXXXX (e.g. DISHA000001).
 * @returns {Promise<string>} The next sequential volunteer ID.
 */
const generateVolunteerId = async () => {
  // Use Supabase natively to find the last user with a DISHA prefix in the document JSONB
  const { data: users } = await supabase
    .from('users')
    .select('document')
    .filter('document->>volunteerId', 'ilike', 'DISHA%')
    // We can't easily order by JSONB text field natively without a view, 
    // so let's fetch them and sort in JS (or just rely on the fallback below)
    .limit(100);

  let lastUser = null;
  if (users && users.length > 0) {
    const sorted = users
      .map(u => u.document)
      .filter(doc => doc && doc.volunteerId && doc.volunteerId.startsWith('DISHA'))
      .sort((a, b) => b.volunteerId.localeCompare(a.volunteerId));
    lastUser = sorted[0];
  }

  if (!lastUser || !lastUser.volunteerId) {
    return 'DISHA000001';
  }

  // Extract the numeric part, increment it, and pad with leading zeros
  const lastIdNumber = parseInt(lastUser.volunteerId.replace('DISHA', ''), 10);
  const nextIdNumber = lastIdNumber + 1;
  const paddedNumber = nextIdNumber.toString().padStart(6, '0');

  return `DISHA${paddedNumber}`;
};

module.exports = {
  generateVolunteerId,
};
