const { v4: uuidv4 } = require('uuid');

const generateConversationId = () => {
  const prefix = 'CONV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().split('-')[0].toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

module.exports = { generateConversationId };
