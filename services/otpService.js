const twilio = require('twilio');
const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('./emailService');

const prisma = new PrismaClient();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class OTPService {
  // Generate OTP code
  static generateOTP(length = 6) {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send SMS OTP
  static async sendSMSOTP(phoneNumber, code) {
    try {
      const message = await twilioClient.messages.create({
        body: `Your FinQuest verification code is: ${code}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('SMS OTP Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send Email OTP (using nodemailer)
  static async sendEmailOTP(email, code) {
    try {
      await sendEmail(
        email,
        'Your FinQuest OTP Code',
        `Your FinQuest verification code is: ${code}. Valid for 10 minutes.`
      );
      return { success: true };
    } catch (error) {
      console.error('Email OTP Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create OTP record in database
  static async createOTPRecord(userId, code, type, expiryMinutes = 10) {
    try {
      const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
      const otpRecord = await prisma.otpCode.create({
        data: {
          userId,
          code,
          type,
          expiresAt
        }
      });
      return { success: true, otpRecord };
    } catch (error) {
      console.error('Create OTP Record Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Verify OTP code
  static async verifyOTP(userId, code, type) {
    try {
      const otpRecord = await prisma.otpCode.findFirst({
        where: {
          userId,
          code,
          type,
          isUsed: false,
          expiresAt: {
            gt: new Date()
          }
        }
      });
      if (!otpRecord) {
        return { success: false, error: 'Invalid or expired OTP' };
      }
      // Mark OTP as used
      await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { isUsed: true }
      });
      return { success: true, otpRecord };
    } catch (error) {
      console.error('Verify OTP Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Clean up expired OTP codes
  static async cleanupExpiredOTPs() {
    try {
      await prisma.otpCode.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });
    } catch (error) {
      console.error('Cleanup OTP Error:', error);
    }
  }
}

module.exports = OTPService; 