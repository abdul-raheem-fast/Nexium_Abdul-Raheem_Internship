import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const router = express.Router();
const prisma = new PrismaClient();

// Rate limiters for different auth operations
const loginLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 5, // 5 attempts
  duration: 900, // per 15 minutes
});

const magicLinkLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 3, // 3 magic links
  duration: 600, // per 10 minutes
});

// Email transporter setup
const createEmailTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  } else {
    // Development setup with Ethereal Email
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.ETHEREAL_PASS || 'ethereal.pass',
      },
    });
  }
};

// JWT token generation
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Magic link token generation
const generateMagicLinkToken = (email) => {
  return jwt.sign(
    { email, type: 'magic_link' },
    process.env.JWT_MAGIC_SECRET,
    { expiresIn: '15m' }
  );
};

// Validation middleware
const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
];

const validateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('timezone')
    .optional()
    .isIn(['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo'])
    .withMessage('Invalid timezone'),
];

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array()
    });
  }
  next();
};

// AUTH ROUTES

/**
 * POST /api/auth/magic-link
 * Send magic link to user's email
 */
router.post('/magic-link', validateEmail, checkValidation, async (req, res) => {
  try {
    // Check rate limit
    await magicLinkLimiter.consume(req.ip);

    const { email } = req.body;

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true, settings: true }
    });

    const isNewUser = !user;

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          profile: {
            create: {}
          },
          settings: {
            create: {}
          }
        },
        include: { profile: true, settings: true }
      });
    }

    // Generate magic link token
    const magicToken = generateMagicLinkToken(email);
    const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${magicToken}`;

    // Send email
    const transporter = createEmailTransporter();
    
    const emailTemplate = {
      from: process.env.EMAIL_FROM || 'Mental Health Tracker <noreply@mentalhealthtracker.com>',
      to: email,
      subject: isNewUser ? 'Welcome to Mental Health Tracker!' : 'Sign in to Mental Health Tracker',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${isNewUser ? 'Welcome' : 'Sign In'} - Mental Health Tracker</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🧠 Mental Health Tracker</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Your Personal Wellness Companion</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px; border-radius: 0 0 10px 10px;">
            ${isNewUser ? `
              <h2 style="color: #667eea; margin-top: 0;">Welcome to Your Wellness Journey! 🎉</h2>
              <p>Thank you for joining Mental Health Tracker. We're excited to support you on your path to better mental wellness.</p>
              <p>Here's what you can do with our platform:</p>
              <ul style="padding-left: 20px;">
                <li>📊 Track your daily mood and emotions</li>
                <li>📝 Keep a private digital journal</li>
                <li>🎯 Set and achieve wellness goals</li>
                <li>🤖 Get personalized AI insights</li>
                <li>🆘 Access crisis support when needed</li>
              </ul>
            ` : `
              <h2 style="color: #667eea; margin-top: 0;">Welcome Back! 👋</h2>
              <p>Click the button below to securely sign in to your Mental Health Tracker account.</p>
            `}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        font-size: 16px; 
                        display: inline-block;">
                ${isNewUser ? '🚀 Complete Setup' : '🔐 Sign In Securely'}
              </a>
            </div>
            
            <div style="background: #e8f0fe; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>🔒 Security Note:</strong> This link will expire in 15 minutes and can only be used once.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; margin: 20px 0 0 0;">
              If you didn't request this email, you can safely ignore it. No account was created.
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                Mental Health Tracker - Supporting your wellness journey<br>
                Need help? Contact us at support@mentalhealthtracker.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(emailTemplate);

    res.status(200).json({
      message: isNewUser 
        ? 'Welcome! Please check your email to complete setup.'
        : 'Magic link sent! Please check your email to sign in.',
      isNewUser,
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2') // Partially mask email
    });

  } catch (error) {
    if (error instanceof Error && error.message.includes('Too Many Requests')) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Please wait before requesting another magic link.',
      });
    }

    console.error('Magic link error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to send magic link. Please try again.'
    });
  }
});

/**
 * POST /api/auth/verify
 * Verify magic link token and sign in user
 */
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Magic link token is required'
      });
    }

    // Verify magic link token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_MAGIC_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired magic link'
      });
    }

    if (decoded.type !== 'magic_link') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token type'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      include: {
        profile: true,
        settings: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User account not found'
      });
    }

    // Update user login info
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        emailVerified: true
      }
    });

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Create session record
    await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionId: uuidv4(),
        device: req.get('User-Agent') || 'Unknown',
        ipAddress: req.ip,
        startedAt: new Date()
      }
    });

    // Prepare user data (exclude sensitive information)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      timezone: user.timezone,
      language: user.language,
      profile: user.profile,
      settings: user.settings,
      createdAt: user.createdAt
    };

    res.status(200).json({
      message: 'Successfully signed in',
      user: userData,
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify magic link'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired refresh token'
      });
    }

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token type'
      });
    }

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User account not found or deactivated'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

    res.status(200).json({
      message: 'Tokens refreshed successfully',
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to refresh tokens'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user and invalidate session
 */
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // End user sessions
        await prisma.userSession.updateMany({
          where: {
            userId: decoded.userId,
            endedAt: null
          },
          data: {
            endedAt: new Date()
          }
        });
      } catch (jwtError) {
        // Token invalid, but still return success for logout
      }
    }

    res.status(200).json({
      message: 'Successfully logged out'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to logout'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    if (decoded.type !== 'access') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token type'
      });
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
        settings: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User account not found or deactivated'
      });
    }

    // Prepare user data (exclude sensitive information)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      timezone: user.timezone,
      language: user.language,
      profile: user.profile,
      settings: user.settings,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt
    };

    res.status(200).json({
      user: userData
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user information'
    });
  }
});

export default router; 