import express from 'express';
import {
  sendNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  broadcastNotification,
  getNotificationStats,
} from '../controllers/notification.controller.js';

const router = express.Router();

// Send notification
router.post('/send', sendNotification);

// Get user notifications
router.get('/:userId', getUserNotifications);

// Get notification stats
router.get('/:userId/stats', getNotificationStats);

// Mark notification as read
router.put('/:id/read', markAsRead);

// Mark all notifications as read
router.put('/:userId/read-all', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

// Broadcast notification
router.post('/broadcast', broadcastNotification);

export default router;
