const { NOTIFICATION_TYPES, PRIORITY, CHANNEL, STATUS, MESSAGES } = require('./notification.constants');

const NotificationPreferenceSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: '665f1b2c3d4e5f6789abcdef',
    },
    user: {
      type: 'string',
      example: '665f1b2c3d4e5f6789abcdeg',
    },
    inAppEnabled: {
      type: 'boolean',
      example: true,
    },
    emailEnabled: {
      type: 'boolean',
      example: false,
    },
    pushEnabled: {
      type: 'boolean',
      example: false,
    },
    smsEnabled: {
      type: 'boolean',
      example: false,
    },
    types: {
      type: 'object',
      properties: {
        application: { type: 'boolean', example: true },
        program: { type: 'boolean', example: true },
        attendance: { type: 'boolean', example: true },
        certificate: { type: 'boolean', example: true },
        reward: { type: 'boolean', example: true },
        leaderboard: { type: 'boolean', example: true },
        system: { type: 'boolean', example: true },
        announcement: { type: 'boolean', example: true },
      },
    },
    quietHours: {
      type: 'object',
      nullable: true,
      properties: {
        enabled: { type: 'boolean', example: false },
        startTime: { type: 'string', example: '22:00' },
        endTime: { type: 'string', example: '08:00' },
      },
    },
    digestFrequency: {
      type: 'string',
      enum: ['instant', 'daily', 'weekly'],
      example: 'instant',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
};

module.exports = {
  NotificationPreferenceSchema,
  NOTIFICATION_TYPES,
  PRIORITY,
  CHANNEL,
  STATUS,
  MESSAGES,
};
