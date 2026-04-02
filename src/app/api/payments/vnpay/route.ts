import { NextRequest, NextResponse } from 'next/server'
import { createVNPayService } from '@/lib/vnpay'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount, orderInfo, bankCode } = body

    // Validation
    if (!orderId || !amount || !orderInfo) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, amount, orderInfo' },
        { status: 400 }
      )
    }

    // Lấy IP address
    const ipAddr = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1'

    // Tạo VNPay service
    const vnpayService = createVNPayService()

    // Tạo payment URL
    const paymentUrl = vnpayService.createPaymentUrl({
      amount: parseInt(amount),
      orderId: orderId.toString(),
      orderInfo,
      ipAddr: ipAddr.split(',')[0].trim(),
      locale: 'vn',
      bankCode: bankCode || undefined,
    })

    console.log('✅ VNPay payment URL created:', {
      orderId,
      amount,
      environment: process.env.VNPAY_TMN_CODE,
    })

    return NextResponse.json({
      success: true,
      data: {
        paymentUrl,
      },
    })
  } catch (error: any) {
    console.error('❌ VNPay payment error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create payment URL',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
