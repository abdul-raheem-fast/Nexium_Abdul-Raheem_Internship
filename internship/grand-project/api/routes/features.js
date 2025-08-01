const express = require('express');
const router = express.Router();

// Crisis Support
router.get('/crisis', (req, res) => {
  res.json({ 
    message: 'Crisis support endpoint',
    resources: [
      'National Suicide Prevention Lifeline: 988',
      'Crisis Text Line: Text HOME to 741741'
    ]
  });
});

// Notifications
router.get('/notifications', (req, res) => {
  res.json({ 
    message: 'Notifications endpoint',
    notifications: []
  });
});

// Insights
router.get('/insights', (req, res) => {
  res.json({ 
    message: 'Insights endpoint',
    insights: []
  });
});

// Goals
router.get('/goals', (req, res) => {
  res.json({ 
    message: 'Goals endpoint',
    goals: []
  });
});

// Activities
router.get('/activities', (req, res) => {
  res.json({ 
    message: 'Activities endpoint',
    activities: []
  });
});

// Journals
router.get('/journals', (req, res) => {
  res.json({ 
    message: 'Journals endpoint',
    journals: []
  });
});

module.exports = router; 