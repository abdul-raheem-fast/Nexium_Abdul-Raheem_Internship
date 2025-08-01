import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate magic link token
    const magicToken = jwt.sign(
      { email, type: 'magic-link' },
      process.env.JWT_MAGIC_SECRET!,
      { expiresIn: '15m' }
    );

    // Create verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify?token=${magicToken}`;
    
    // Log the URL for debugging (remove in production)
    console.log('Magic link URL:', verificationUrl);

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Secure Sign-In Link - Mental Health Tracker',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sign In - Mental Health Tracker</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e40af; margin: 0; font-size: 28px;">🧠 Mental Health Tracker</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Your AI-powered wellness companion</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: #f8fafc; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Welcome Back! 👋</h2>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #4b5563;">
              We've sent you a secure sign-in link to access your Mental Health Tracker dashboard. 
              This link will take you directly to your personalized wellness dashboard.
            </p>
            
            <!-- Sign In Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
                        color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; 
                        font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                        transition: all 0.3s ease;">
                🔐 Sign In Securely
              </a>
            </div>
            
            <!-- Security Info -->
            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>🔒 Security Notice:</strong> This link expires in <strong>15 minutes</strong> and can only be used once. 
                If you didn't request this link, please ignore this email.
              </p>
            </div>
          </div>
          
          <!-- Features -->
          <div style="background: #f0f9ff; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">✨ What's waiting for you:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li style="margin-bottom: 8px;">📊 <strong>Mood Tracking:</strong> Log and analyze your daily mood patterns</li>
              <li style="margin-bottom: 8px;">🤖 <strong>AI Insights:</strong> Get personalized wellness recommendations</li>
              <li style="margin-bottom: 8px;">📈 <strong>Analytics:</strong> View your mental health trends and progress</li>
              <li style="margin-bottom: 0;">🎯 <strong>Goal Setting:</strong> Set and track your wellness goals</li>
            </ul>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
              Need help? Contact us at <a href="mailto:support@mentalhealthtracker.com" style="color: #3b82f6;">support@mentalhealthtracker.com</a>
            </p>
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
              © 2025 Mental Health Tracker. All rights reserved.
            </p>
          </div>
          
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Magic link sent successfully',
    });

  } catch (error: any) {
    console.error('Magic link error:', error);
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
} 