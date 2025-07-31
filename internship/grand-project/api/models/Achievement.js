import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['consistency', 'milestone', 'improvement', 'special']
  },
  icon: {
    type: String,
    default: '🏆'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  target: {
    type: Number,
    default: 100
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: Date,
  points: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

achievementSchema.index({ userId: 1, isUnlocked: 1 });

export default mongoose.model('Achievement', achievementSchema);