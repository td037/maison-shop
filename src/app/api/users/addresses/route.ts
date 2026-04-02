import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import User from '@/models/User'
import dbConnect from '@/lib/db/connect'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 })
    }

    await dbConnect()
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 })
    }

    const addressData = await req.json()

    // Validate required fields
    if (!addressData.street || !addressData.district || !addressData.city || !addressData.province) {
      return NextResponse.json({ 
        error: 'Vui lòng điền đầy đủ thông tin (Đường phố, Quận/Huyện, Thành phố, Tỉnh/Thành phố)' 
      }, { status: 400 })
    }

    // If new address is set as default, clear other defaults
    if (addressData.isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false
      })
    }

    // Add new address
    user.addresses.push({
      label: addressData.label || 'Nhà',
      street: addressData.street,
      ward: addressData.ward || '',
      district: addressData.district,
      city: addressData.city,
      province: addressData.province,
      postalCode: addressData.postalCode || '',
      isDefault: addressData.isDefault || false,
    })

    await user.save()

    return NextResponse.json(user)
  } catch (error) {
    console.error('Address creation error:', error)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}
