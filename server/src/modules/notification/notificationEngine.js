const EventEmitter = require('events');
const Notification = require('./notification.model');
const templateBuilders = require('./notification.templates');

class NotificationEngine extends EventEmitter {
  async sendNotification(data) {
    const notification = await Notification.create(data);
    this.emit('notification.created', notification);
    return notification;
  }

  async sendTemplate(templateName, data) {
    const builder = templateBuilders[templateName];
    if (!builder) {
      throw new Error(`Unknown notification template: ${templateName}`);
    }
    const notificationData = builder(data);
    return this.sendNotification(notificationData);
  }
}

const notificationEngine = new NotificationEngine();

module.exports = notificationEngine;
