import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import createDefaultAnalytics from '../create-default-analytics.js';

const router = express.Router();

// Initialize Prisma with error handling for development
let prisma = null;

const initializePrisma = async () => {
  // Only use demo mode if explicitly set to true
  if (process.env.DEMO_MODE === 'true') {
    console.log('🎯 Demo mode: Using in-memory storage instead of Prisma database');
    return null;
  }
  
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ DATABASE_URL not provided - using development mode without database');
    return null;
  }
  
  try {
    const client = new PrismaClient();
    // Test the connection
    await client.$connect();
    console.log('✅ Prisma connected successfully');
    return client;
  } catch (error) {
    console.log('⚠️ Prisma connection failed - using development mode without database:', error.message);
    return null;
  }
};

// Initialize Prisma asynchronously
(async () => {
  if (process.env.DATABASE_URL) {
    prisma = await initializePrisma();
  }
})();

// In-memory storage for development
const devUsers = new Map();
const devMagicLinks = new Map();

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
  // For development, just log the email instead of sending
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Development mode: Email would be sent here');
    return {
      sendMail: async (mailOptions) => {
        console.log('📧 Magic Link Email:', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          magicLink: mailOptions.html.match(/href="([^"]*)/)?.[1] || 'Link not found'
        });
        return { messageId: 'dev-' + Date.now() };
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

    let user;
    let isNewUser = false;

    // Handle development mode without database
    if (!prisma) {
      console.log('🔧 Development mode: Using in-memory user storage');
      
      if (!devUsers.has(email)) {
        // Extract name from email (part before @)
        const extractedName = email.split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        
        // Create new user in development mode
        user = {
          id: `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Use CUID-like format
          email,
          name: extractedName,
          emailVerified: false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          profile: {
            hasTherapist: false,
            medications: [],
            conditions: [],
            triggers: [],
            copingStrategies: [
              "Deep breathing exercises",
              "Take a short walk",
              "Listen to calming music",
              "Practice gratitude"
            ],
            dataSharing: false,
            anonymousMode: false
          },
          settings: {
            emailNotifications: true,
            pushNotifications: true,
            reminderFrequency: 'DAILY',
            moodTrackingEnabled: true,
            dailyCheckIns: true,
            weeklyReports: true,
            dataRetentionDays: 365,
            aiInsightsEnabled: true,
            personalizedTips: true,
            trendAnalysis: true,
            crisisMode: false,
            emergencyContacts: true
          }
        };
        devUsers.set(email, user);
        isNewUser = true;
        console.log('✅ Created new user in development mode:', email, 'Name:', extractedName);
        
        // Create default analytics for new user
        if (isNewUser) {
          setTimeout(async () => {
            try {
              await createDefaultAnalytics(user.id, email);
            } catch (error) {
              console.log('⚠️ Could not create default analytics:', error.message);
            }
          }, 1000); // Create analytics after a brief delay
        }
      } else {
        user = devUsers.get(email);
        console.log('✅ Found existing user in development mode:', email);
      }
    } else {
      // Production mode with database
      try {
        user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true, settings: true }
        });

        isNewUser = !user;

        if (!user) {
          // Create new user with extracted name and default data
          // Extract name from email (part before @)
          const extractedName = email.split('@')[0]
            .replace(/[._-]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
          
          user = await prisma.user.create({
            data: {
              email,
              name: extractedName,
              emailVerified: false,
              isActive: true,
              profile: {
                create: {
                  // Add some default profile data
                  hasTherapist: false,
                  medications: [],
                  conditions: [],
                  triggers: [],
                  copingStrategies: [
                    "Deep breathing exercises",
                    "Take a short walk",
                    "Listen to calming music",
                    "Practice gratitude"
                  ],
                  dataSharing: false,
                  anonymousMode: false
                }
              },
              settings: {
                create: {
                  emailNotifications: true,
                  pushNotifications: true,
                  reminderFrequency: 'DAILY',
                  moodTrackingEnabled: true,
                  dailyCheckIns: true,
                  weeklyReports: true,
                  dataRetentionDays: 365,
                  aiInsightsEnabled: true,
                  personalizedTips: true,
                  trendAnalysis: true,
                  crisisMode: false,
                  emergencyContacts: true
                }
              }
            },
            include: { profile: true, settings: true }
          });
          
          // Create default analytics for new user
          if (user) {
            setTimeout(async () => {
              try {
                await createDefaultAnalytics(user.id, email);
              } catch (error) {
                console.log('⚠️ Could not create default analytics:', error.message);
              }
            }, 1000); // Create analytics after a brief delay
          }
        }
      } catch (dbError) {
        console.error('❌ Database error:', dbError.message);
        return res.status(500).json({
          error: 'Database Error',
          message: 'Unable to process authentication. Please try again later.'
        });
      }
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

    // In development mode, also log the magic link for easy testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Development Magic Link:', magicLink);
      console.log('📧 Email sent to:', email);
    }

    res.status(200).json({
      message: isNewUser 
        ? 'Welcome! Please check your email to complete setup.'
        : 'Magic link sent! Please check your email to sign in.',
      isNewUser,
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Partially mask email
      ...(process.env.NODE_ENV === 'development' && { 
        devMagicLink: magicLink,
        devNote: 'Check console for magic link in development mode'
      })
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
    let user;
    
    if (!prisma) {
      // Development mode - use in-memory storage
      console.log('🔧 Development mode: Looking up user in memory');
      user = devUsers.get(decoded.email);
      
      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User account not found'
        });
      }
      
      // Update user in memory
      user.lastLoginAt = new Date();
      user.emailVerified = true;
      devUsers.set(decoded.email, user);
      console.log('✅ Updated user in development mode:', decoded.email);
    } else {
      // Production mode - use database
      try {
        user = await prisma.user.findUnique({
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
      } catch (dbError) {
        console.error('❌ Database error:', dbError.message);
        return res.status(500).json({
          error: 'Database Error',
          message: 'Unable to process authentication. Please try again later.'
        });
      }
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Create session record
    if (prisma) {
      try {
        await prisma.userSession.create({
          data: {
            userId: user.id,
            sessionId: uuidv4(),
            device: req.get('User-Agent') || 'Unknown',
            ipAddress: req.ip,
            startedAt: new Date()
          }
        });
      } catch (sessionError) {
        console.log('⚠️ Session creation failed (continuing):', sessionError.message);
      }
    } else {
      console.log('🔧 Development mode: Skipping session creation');
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
    let user;
    
    if (!prisma) {
      // Development mode - find user by ID in memory
      for (const [email, devUser] of devUsers.entries()) {
        if (devUser.id === decoded.userId) {
          user = devUser;
          break;
        }
      }
    } else {
      // Production mode - use database
      try {
        user = await prisma.user.findUnique({
          where: { id: decoded.userId }
        });
      } catch (dbError) {
        console.error('❌ Database error:', dbError.message);
        return res.status(500).json({
          error: 'Database Error',
          message: 'Unable to process token refresh. Please try again later.'
        });
      }
    }

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
        if (prisma) {
          try {
            await prisma.userSession.updateMany({
              where: {
                userId: decoded.userId,
                endedAt: null
              },
              data: {
                endedAt: new Date()
              }
            });
          } catch (sessionError) {
            console.log('⚠️ Session update failed (continuing):', sessionError.message);
          }
        } else {
          console.log('🔧 Development mode: Skipping session cleanup');
        }
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
    let user;
    
    if (!prisma) {
      // Development mode - find user by ID in memory
      for (const [email, devUser] of devUsers.entries()) {
        if (devUser.id === decoded.userId) {
          user = devUser;
          break;
        }
      }
    } else {
      // Production mode - use database
      try {
        user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          include: {
            profile: true,
            settings: true
          }
        });
      } catch (dbError) {
        console.error('❌ Database error:', dbError.message);
        return res.status(500).json({
          error: 'Database Error',
          message: 'Unable to get user information. Please try again later.'
        });
      }
    }

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