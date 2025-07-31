import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profile: {
    bio: String,
    phoneNumber: String,
    timezone: {
      type: String,
      default: 'UTC'
    },
    preferredLanguage: {
      type: String,
      default: 'en'
    }
  },
  settings: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      reminderTime: {
        type: String,
        default: '18:00'
      }
    },
    privacy: {
      shareAggregatedData: {
        type: Boolean,
        default: false
      },
      dataRetentionDays: {
        type: Number,
        default: 365
      }
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);