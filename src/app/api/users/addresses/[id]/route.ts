import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import User from '@/models/User'
import dbConnect from '@/lib/db/connect'
import mongoose from 'mongoose'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const addressId = params.id

    // Check if this is a "set default" request
    if (addressData.setDefault === true) {
      let found = false
      
      user.addresses.forEach((addr: any) => {
        if (addr._id.toString() === addressId) {
          addr.isDefault = true
          found = true
        } else {
          addr.isDefault = false
        }
      })

      if (!found) {
        return NextResponse.json({ error: 'Địa chỉ không tồn tại' }, { status: 404 })
      }

      await user.save()
      return NextResponse.json(user)
    }

    // Regular update
    // Validate required fields
    if (!addressData.street || !addressData.district || !addressData.city || !addressData.province) {
      return NextResponse.json({ 
        error: 'Vui lòng điền đầy đủ thông tin (Đường phố, Quận/Huyện, Thành phố, Tỉnh/Thành phố)' 
      }, { status: 400 })
    }

    const address = user.addresses.find((addr: any) => addr._id.toString() === addressId)
    
    if (!address) {
      return NextResponse.json({ error: 'Địa chỉ không tồn tại' }, { status: 404 })
    }

    // If updating to default, clear other defaults
    if (addressData.isDefault && !address.isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false
      })
    }

    // Update address
    address.label = addressData.label || address.label
    address.street = addressData.street
    address.ward = addressData.ward || ''
    address.district = addressData.district
    address.city = addressData.city
    address.province = addressData.province
    address.postalCode = addressData.postalCode || ''
    address.isDefault = addressData.isDefault || false

    await user.save()

    return NextResponse.json(user)
  } catch (error) {
    console.error('Address update error:', error)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const addressId = params.id
    const initialLength = user.addresses.length
    
    user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== addressId)
    
    if (user.addresses.length === initialLength) {
      return NextResponse.json({ error: 'Địa chỉ không tồn tại' }, { status: 404 })
    }

    // If deleted address was default, set first address as default
    if (user.addresses.length > 0 && !user.addresses.some((addr: any) => addr.isDefault)) {
      user.addresses[0].isDefault = true
    }

    await user.save()

    return NextResponse.json(user)
  } catch (error) {
    console.error('Address delete error:', error)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}
