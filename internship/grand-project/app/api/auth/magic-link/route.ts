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
      subject: 'Sign in to Mental Health Tracker',
      html: `
        <h2>Welcome to Mental Health Tracker</h2>
        <p>Click the link below to sign in:</p>
        <a href="${verificationUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Sign In
        </a>
        <p>This link expires in 15 minutes.</p>
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