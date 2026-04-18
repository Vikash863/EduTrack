import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['marks', 'attendance', 'announcement', 'report', 'warning'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    relatedSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
    read: {
      type: Boolean,
      default: false,
    },
    deliveryMethod: {
      type: String,
      enum: ['in-app', 'email', 'sms'],
      default: 'in-app',
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
