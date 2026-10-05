import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { User } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { registerSchema, loginSchema } from '../validators/auth.validator';

// Helper function - Zod errors ko clean format mein convert karta hai
const formatZodErrors = (error: ZodError) => {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
    code: issue.code,
  }));
};

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await hashPassword(data.password);
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role || 'user',
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });

    res.status(201).json({
      message: 'Registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: formatZodErrors(error),
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- UPDATED LOGIN FUNCTION ---
export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    // 1. Check if email exists
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(400).json({ message: 'Email is not registered. Please create an account.' });
    }

    // 2. Check if password is correct
    const ok = await comparePassword(data.password, user.password);
    if (!ok) {
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }

    // 3. Success
    const token = signToken({ userId: user._id.toString(), role: user.role });

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: formatZodErrors(error),
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const me = async (req: any, res: Response) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json({ user });
};