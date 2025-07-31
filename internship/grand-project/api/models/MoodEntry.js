import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  moodScore: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  moodType: {
    type: String,
    required: true,
    enum: ['EXCELLENT', 'GOOD', 'OKAY', 'POOR', 'TERRIBLE']
  },
  energy: {
    type: Number,
    min: 1,
    max: 10
  },
  anxiety: {
    type: Number,
    min: 1,
    max: 10
  },
  stress: {
    type: Number,
    min: 1,
    max: 10
  },
  sleep: {
    type: Number,
    min: 1,
    max: 10
  },
  activities: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: 1000
  },
  socialContext: {
    type: String,
    enum: ['alone', 'with_friends', 'with_family', 'at_work', 'other']
  },
  location: {
    type: String,
    enum: ['home', 'work', 'outdoors', 'gym', 'other']
  },
  aiAnalysis: {
    sentiment: String,
    themes: [String],
    suggestions: [String],
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
moodEntrySchema.index({ userId: 1, date: -1 });
moodEntrySchema.index({ userId: 1, moodType: 1 });

export default mongoose.model('MoodEntry', moodEntrySchema);