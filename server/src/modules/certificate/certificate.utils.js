const crypto = require('crypto');

/**
 * Generate a unique Certificate Number.
 * Format: DISHA-CERT-YYYY-XXXXXX (zero-padded sequential portion via random hex)
 * @returns {string}
 */
const generateCertificateNumber = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `DISHA-CERT-${year}-${randomSuffix}`;
};

/**
 * Generate a unique Certificate ID.
 * @returns {string}
 */
const generateCertificateId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CERT-${dateStr}-${randomStr}`;
};

module.exports = {
  generateCertificateNumber,
  generateCertificateId,
};
