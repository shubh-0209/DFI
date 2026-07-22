const { v4: uuidv4 } = require('uuid');

const generateNotificationId = () => {
  const prefix = 'NTF';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().split('-')[0].toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const notificationFormatter = (notification) => {
  if (!notification) {
    return null;
  }

  const formatted = {
    id: notification._id,
    notificationId: notification.notificationId,
    recipient: notification.recipient,
    sender: notification.sender,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    category: notification.category,
    priority: notification.priority,
    channel: notification.channel,
    actionUrl: notification.actionUrl,
    icon: notification.icon,
    relatedEntityType: notification.relatedEntityType,
    relatedEntityId: notification.relatedEntityId,
    isRead: notification.isRead,
    readAt: notification.readAt,
    scheduledFor: notification.scheduledFor,
    sentAt: notification.sentAt,
    expiresAt: notification.expiresAt,
    metadata: notification.metadata || {},
    status: notification.status,
    failureReason: notification.failureReason,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
  };

  return formatted;
};

const formatNotificationList = (notifications) => {
  if (!Array.isArray(notifications)) {
    return [];
  }
  return notifications.map(notificationFormatter);
};

module.exports = {
  generateNotificationId,
  notificationFormatter,
  formatNotificationList,
};
