import express from 'express';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Email transporter for webhook automation
const createEmailTransporter = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      sendMail: async (mailOptions) => {
        console.log('📧 n8n Webhook Email:', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          content: mailOptions.text || 'Email content'
        });
        return { messageId: 'webhook-' + Date.now() };
      }
    };
  } else {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }
};

/**
 * POST /api/webhooks/magic-link
 * n8n webhook for automated magic link sending
 */
router.post('/magic-link', async (req, res) => {
  try {
    const { email, automation_id, custom_message } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        webhook_status: 'failed'
      });
    }

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          profile: { create: {} },
          settings: { create: {} }
        },
        include: { profile: true }
      });
    }

    // Generate magic link
    const magicToken = jwt.sign(
      { email, type: 'magic_link' },
      process.env.JWT_MAGIC_SECRET,
      { expiresIn: '15m' }
    );

    const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${magicToken}`;

    // Send email via webhook automation
    const transporter = createEmailTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: custom_message ? 'Mental Health Tracker - Custom Login' : 'Mental Health Tracker - Login Link',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>🧠 Mental Health Tracker</h2>
          <p>${custom_message || 'Click the link below to sign in:'}</p>
          <a href="${magicLink}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Sign In Securely
          </a>
          <p style="font-size: 12px; color: #666; margin-top: 20px;">
            This link expires in 15 minutes. Automated by n8n workflow ${automation_id || 'unknown'}.
          </p>
        </div>
      `
    });

    res.status(200).json({
      webhook_status: 'success',
      message: 'Magic link sent successfully',
      automation_id,
      user_id: user.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook magic link error:', error);
    res.status(500).json({
      webhook_status: 'error',
      error: 'Failed to send magic link',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/webhooks/mood-reminder
 * n8n webhook for automated mood tracking reminders
 */
router.post('/mood-reminder', async (req, res) => {
  try {
    const { user_emails, reminder_type, automation_id } = req.body;

    if (!user_emails || !Array.isArray(user_emails)) {
      return res.status(400).json({
        error: 'user_emails array is required',
        webhook_status: 'failed'
      });
    }

    const transporter = createEmailTransporter();
    const results = [];

    for (const email of user_emails) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: '🌟 Daily Mood Check-in Reminder',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>🧠 Mental Health Tracker</h2>
              <p>Hi there! 👋</p>
              <p>It's time for your daily mood check-in. Taking a moment to reflect on your feelings can help you understand your emotional patterns better.</p>
              <a href="${process.env.FRONTEND_URL}/mood-entry" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                📊 Log Your Mood
              </a>
              <p style="font-size: 12px; color: #666; margin-top: 20px;">
                Automated reminder via n8n workflow ${automation_id || 'unknown'}.
              </p>
            </div>
          `
        });
        results.push({ email, status: 'sent' });
      } catch (emailError) {
        results.push({ email, status: 'failed', error: emailError.message });
      }
    }

    res.status(200).json({
      webhook_status: 'success',
      message: 'Mood reminders processed',
      results,
      total_sent: results.filter(r => r.status === 'sent').length,
      automation_id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook mood reminder error:', error);
    res.status(500).json({
      webhook_status: 'error',
      error: 'Failed to send mood reminders',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/webhooks/test
 * n8n webhook health check
 */
router.get('/test', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      webhook_status: 'healthy',
      service: 'Mental Health Tracker Webhooks',
      version: '1.0.0',
      endpoints: [
        'POST /api/webhooks/magic-link',
        'POST /api/webhooks/mood-reminder',
        'GET /api/webhooks/test'
      ],
      database_status: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      webhook_status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;