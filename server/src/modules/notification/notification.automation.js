/* eslint-disable no-console */
const Notification = require('./notification.model');

const AUTOMATION_INTERVAL_MS = Number(process.env.NOTIFICATION_AUTOMATION_INTERVAL_MS) || 3600000; // default 1 hour

class NotificationAutomationService {
  constructor() {
    this.running = false;
    this.timer = null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.tick();
    this.timer = setInterval(() => this.tick(), AUTOMATION_INTERVAL_MS);
    console.log(`[NotificationAutomation] Started (Interval: ${AUTOMATION_INTERVAL_MS}ms)`);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.running = false;
    console.log('[NotificationAutomation] Stopped');
  }

  async tick() {
    try {
      await this.cleanupExpiredNotifications();
    } catch (err) {
      console.error('[NotificationAutomation] tick failed:', err.message);
    }
  }

  async cleanupExpiredNotifications() {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    // Delete query matching:
    // 1. Explicitly expired notifications (expiresAt <= now)
    // 2. OR legacy notifications without expiresAt:
    //    - If read: delete if readAt is older than 24 hours
    //    - If unread: delete if createdAt is older than 3 days
    const result = await Notification.deleteMany({
      $or: [
        { expiresAt: { $lte: now } },
        {
          expiresAt: null,
          isRead: true,
          readAt: { $lte: twentyFourHoursAgo },
        },
        {
          expiresAt: null,
          isRead: false,
          createdAt: { $lte: threeDaysAgo },
        },
      ],
    });

    if (result && result.deletedCount > 0) {
      console.log(`[NotificationAutomation] ✅ Cleaned up ${result.deletedCount} expired notification(s).`);
    }
  }
}

const notificationAutomation = new NotificationAutomationService();

const initializeNotificationAutomation = () => {
  notificationAutomation.start();
  return notificationAutomation;
};

module.exports = {
  notificationAutomation,
  initializeNotificationAutomation,
};
