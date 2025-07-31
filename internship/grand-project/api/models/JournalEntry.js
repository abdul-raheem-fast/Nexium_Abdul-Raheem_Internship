import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  mood: {
    type: String,
    enum: ['EXCELLENT', 'GOOD', 'OKAY', 'POOR', 'TERRIBLE']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  aiAnalysis: {
    sentiment: {
      score: Number,
      label: String
    },
    emotions: [{
      emotion: String,
      confidence: Number
    }],
    keyTopics: [String],
    riskFactors: [String],
    suggestions: [String]
  }
}, {
  timestamps: true
});

journalEntrySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('JournalEntry', journalEntrySchema);