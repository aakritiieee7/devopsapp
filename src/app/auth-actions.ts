"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Mocking OTP storage in memory for this demo, 
// in production use Redis or a DB table with TTL
const otpStore = new Map<string, { otp: string, expires: number }>();

export async function sendOtp(email: string) {
  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save OTP with 5 minute expiration
  otpStore.set(email, { 
    otp, 
    expires: Date.now() + 5 * 60 * 1000 
  });

  console.log(`[AUTH_SYSTEM] OTP for ${email}: ${otp}`);
  
  // Return success even though we're just logging it
  return { success: true, message: `System: Verification code transmitted to ${email}` };
}

export async function verifyOtpAndRegister(data: any) {
  const { email, password, name, enrollmentId, otp } = data;
  
  const record = otpStore.get(email);
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return { success: false, error: "INVALID_OR_EXPIRED_OTP" };
  }

  try {
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { success: false, error: "IDENTITY_ALREADY_EXISTS" };

    // Create user
    await prisma.user.create({
      data: {
        email,
        name,
        enrollmentId,
        password, // In real app, hash this!
        role: "STUDENT",
        semester: "6th",
        branch: "Information Technology"
      }
    });

    otpStore.delete(email);
    return { success: true };
  } catch (err) {
    return { success: false, error: "DATABASE_TRANSACTION_FAILURE" };
  }
}

export async function verifyOtpAndResetPassword(email: string, otp: string, newPassword: string) {
  const record = otpStore.get(email);
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return { success: false, error: "INVALID_OR_EXPIRED_OTP" };
  }

  try {
    await (prisma.user as any).update({
      where: { email },
      data: { password: newPassword }
    });

    otpStore.delete(email);
    return { success: true };
  } catch (err) {
    return { success: false, error: "PASSWORD_RESET_PROTOCOL_FAILED" };
  }
}
