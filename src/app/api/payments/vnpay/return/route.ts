import { NextRequest, NextResponse } from 'next/server'
import { createVNPayService } from '@/lib/vnpay'
import connectDB from '@/lib/db/connect'
import Order from '@/models/Order'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vnpParams: any = {}

    // Lấy tất cả params từ query string
    searchParams.forEach((value, key) => {
      vnpParams[key] = value
    })

    console.log('📥 VNPay return params:', vnpParams)

    // Tạo VNPay service
    const vnpayService = createVNPayService()

    // Xác thực chữ ký
    const verification = vnpayService.verifyReturnUrl({ ...vnpParams })
    
    // Lấy thông tin giao dịch
    const transactionInfo = vnpayService.getTransactionInfo(vnpParams)

    console.log('🔍 Transaction info:', transactionInfo)
    console.log('✅ Verification:', verification)

    // Kết nối database
    await connectDB()

    // Tìm order
    const order = await Order.findById(transactionInfo.orderId)

    if (!order) {
      console.error('❌ Order not found:', transactionInfo.orderId)
      return NextResponse.redirect(
        new URL(`/payment/failed?message=Order not found`, request.url)
      )
    }

    // Cập nhật order status
    if (verification.isValid && transactionInfo.responseCode === '00') {
      order.status = 'paid'
      order.paymentStatus = 'paid'
      order.vnpayTransactionNo = transactionInfo.transactionNo
      order.vnpayBankCode = transactionInfo.bankCode
      order.vnpayPayDate = transactionInfo.payDate
      await order.save()

      console.log('✅ Order updated to paid:', order._id)

      // Redirect to success page
      return NextResponse.redirect(
        new URL(`/payment/success?orderId=${order._id}`, request.url)
      )
    } else {
      order.status = 'cancelled'
      order.paymentStatus = 'failed'
      order.vnpayResponseCode = transactionInfo.responseCode
      await order.save()

      console.log('❌ Payment failed:', verification.message)

      // Redirect to failed page
      return NextResponse.redirect(
        new URL(`/payment/failed?message=${encodeURIComponent(verification.message)}`, request.url)
      )
    }
  } catch (error: any) {
    console.error('❌ VNPay return error:', error)
    return NextResponse.redirect(
      new URL(`/payment/failed?message=System error`, request.url)
    )
  }
}
