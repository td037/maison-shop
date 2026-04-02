import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

/**
 * PUT /api/users/profile
 * Update current user profile
 */
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // Verify token
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, phone, dateOfBirth, gender } = await req.json();

    // Validate input
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Họ và tên không được để trống' },
        { status: 400 }
      );
    }

    // Clean phone number (remove spaces, dashes, etc.)
    let cleanPhone = '';
    if (phone && phone.trim()) {
      cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
      // Validate cleaned phone has 10-11 digits
      if (!/^[0-9]{10,11}$/.test(cleanPhone)) {
        return NextResponse.json(
          { error: 'Số điện thoại phải có 10-11 chữ số' },
          { status: 400 }
        );
      }
    }

    // Update user
    const updateData: any = {
      name: name.trim(),
      dateOfBirth: dateOfBirth || undefined,
      gender: gender || undefined,
    };

    // Only set phone if provided and valid
    if (cleanPhone) {
      updateData.phone = cleanPhone;
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error.message || 'Profile update failed' },
      { status: 500 }
    );
  }
}
