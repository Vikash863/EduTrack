import Notification from '../models/Notification.model.js';
import nodemailer from 'nodemailer';

// Email configuration - Update these with your own credentials
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-password',
  },
};

const transporter = nodemailer.createTransport(emailConfig);

// Send Notification
export const sendNotification = async (req, res) => {
  try {
    const { recipient, type, title, message, deliveryMethod, relatedStudent, relatedSubject } = req.body;

    if (!recipient || !type || !title || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const notification = new Notification({
      recipient,
      type,
      title,
      message,
      relatedStudent,
      relatedSubject,
      deliveryMethod,
      deliveryStatus: 'pending',
    });

    await notification.save();

    // Send email if delivery method is email
    if (deliveryMethod === 'email') {
      try {
        await sendEmail(recipient, title, message);
        notification.deliveryStatus = 'sent';
      } catch (error) {
        notification.deliveryStatus = 'failed';
        console.error('Email sending failed:', error);
      }
    }

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send email
const sendEmail = async (email, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'edutrack@gmail.com',
    to: email,
    subject: `EduTrack: ${subject}`,
    html: `
      <h2>${subject}</h2>
      <p>${message}</p>
      <br>
      <p>Best regards,</p>
      <p>EduTrack Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Get Notifications for User
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { read } = req.query;

    const filter = { recipient: userId };
    if (read !== undefined) {
      filter.read = read === 'true';
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark All Notifications as Read
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Broadcast Notification to Multiple Users
export const broadcastNotification = async (req, res) => {
  try {
    const { userIds, type, title, message, deliveryMethod } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Please provide user IDs' });
    }

    const notifications = userIds.map((userId) => ({
      recipient: userId,
      type,
      title,
      message,
      deliveryMethod,
      deliveryStatus: 'pending',
    }));

    const result = await Notification.insertMany(notifications);

    // Send emails if delivery method is email
    if (deliveryMethod === 'email') {
      for (const userId of userIds) {
        try {
          await sendEmail(userId, title, message);
        } catch (error) {
          console.error('Email sending failed for user:', userId, error);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `${result.length} notifications sent successfully`,
      count: result.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Notification Statistics
export const getNotificationStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const totalNotifications = await Notification.countDocuments({ recipient: userId });
    const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });
    const readCount = totalNotifications - unreadCount;

    res.status(200).json({
      success: true,
      stats: {
        totalNotifications,
        unreadCount,
        readCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
