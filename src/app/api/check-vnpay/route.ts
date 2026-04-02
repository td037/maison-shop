import { NextResponse } from 'next/server'

export async function GET() {
  const paymentMethods = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '🏠' },
    { id: 'vnpay', label: 'VNPay (ATM / Visa / Mastercard)', icon: '💳' },
  ]

  const envVars = {
    VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE ? 'SET' : 'NOT SET',
    VNPAY_HASH_SECRET: process.env.VNPAY_HASH_SECRET ? 'SET' : 'NOT SET',
    VNPAY_URL: process.env.VNPAY_URL ? 'SET' : 'NOT SET',
    VNPAY_RETURN_URL: process.env.VNPAY_RETURN_URL ? 'SET' : 'NOT SET',
  }

  return NextResponse.json({
    status: 'OK',
    vnpayExists: true,
    paymentMethods,
    environmentVariables: envVars,
    timestamp: new Date().toISOString(),
  })
}
