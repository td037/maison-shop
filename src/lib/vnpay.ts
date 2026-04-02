import crypto from 'crypto'
import querystring from 'querystring'

export interface VNPayConfig {
  tmnCode: string
  hashSecret: string
  url: string
  returnUrl: string
}

export interface VNPayPaymentParams {
  amount: number
  orderId: string
  orderInfo: string
  ipAddr: string
  locale?: string
  bankCode?: string
}

export class VNPayService {
  private config: VNPayConfig

  constructor(config: VNPayConfig) {
    this.config = config
  }

  /**
   * Tạo URL thanh toán VNPay
   */
  createPaymentUrl(params: VNPayPaymentParams): string {
    // Lấy thời gian hiện tại theo múi giờ Việt Nam (GMT+7)
    const now = new Date()
    const vietnamTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }))
    
    const createDate = this.formatDate(vietnamTime)
    const expireDate = this.formatDate(new Date(vietnamTime.getTime() + 15 * 60 * 1000)) // 15 minutes
    
    console.log('🕐 VNPay Payment Time:', {
      serverTime: now.toISOString(),
      vietnamTime: vietnamTime.toISOString(),
      createDate,
      expireDate
    })

    let vnpParams: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.config.tmnCode,
      vnp_Locale: params.locale || 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: params.orderId,
      vnp_OrderInfo: params.orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: params.amount * 100, // VNPay yêu cầu số tiền * 100
      vnp_ReturnUrl: this.config.returnUrl,
      vnp_IpAddr: params.ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    }

    console.log('📋 VNPay Config:', {
      tmnCode: this.config.tmnCode,
      returnUrl: this.config.returnUrl,
      url: this.config.url
    })

    console.log('📦 VNPay Params (before sort):', vnpParams)

    // Thêm bank code nếu có
    if (params.bankCode) {
      vnpParams.vnp_BankCode = params.bankCode
    }

    // Sắp xếp params theo alphabet
    vnpParams = this.sortObject(vnpParams)

    // Tạo query string cho signing (encode: false)
    const signData = querystring.stringify(vnpParams, { encode: false })
    
    console.log('📝 SignData:', signData.substring(0, 100) + '...')
    
    // Tạo secure hash
    const hmac = crypto.createHmac('sha512', this.config.hashSecret)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
    vnpParams.vnp_SecureHash = signed

    // Tạo URL cuối cùng (encode: true)
    const paymentUrl = this.config.url + '?' + querystring.stringify(vnpParams, { encode: true })

    console.log('✅ VNPay Payment URL Created')
    console.log('🔐 SecureHash:', signed)

    return paymentUrl
  }

  /**
   * Xác thực callback từ VNPay
   */
  verifyReturnUrl(vnpParams: any): { isValid: boolean; message: string } {
    const secureHash = vnpParams.vnp_SecureHash
    delete vnpParams.vnp_SecureHash
    delete vnpParams.vnp_SecureHashType

    // Sắp xếp params
    const sortedParams = this.sortObject(vnpParams)
    const signData = querystring.stringify(sortedParams, { encode: false })
    
    // Tạo hash để so sánh
    const hmac = crypto.createHmac('sha512', this.config.hashSecret)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    if (secureHash === signed) {
      // Kiểm tra response code
      if (vnpParams.vnp_ResponseCode === '00') {
        return {
          isValid: true,
          message: 'Giao dịch thành công',
        }
      } else {
        return {
          isValid: false,
          message: this.getResponseMessage(vnpParams.vnp_ResponseCode),
        }
      }
    } else {
      return {
        isValid: false,
        message: 'Chữ ký không hợp lệ',
      }
    }
  }

  /**
   * Lấy thông tin giao dịch từ return URL
   */
  getTransactionInfo(vnpParams: any) {
    return {
      orderId: vnpParams.vnp_TxnRef,
      amount: parseInt(vnpParams.vnp_Amount) / 100,
      orderInfo: vnpParams.vnp_OrderInfo,
      responseCode: vnpParams.vnp_ResponseCode,
      transactionNo: vnpParams.vnp_TransactionNo,
      bankCode: vnpParams.vnp_BankCode,
      payDate: vnpParams.vnp_PayDate,
    }
  }

  /**
   * Sắp xếp object theo key
   */
  private sortObject(obj: any): any {
    const sorted: any = {}
    const keys = Object.keys(obj).sort()
    keys.forEach((key) => {
      sorted[key] = obj[key]
    })
    return sorted
  }

  /**
   * Format date theo yêu cầu VNPay: yyyyMMddHHmmss
   * Sử dụng thời gian Việt Nam (GMT+7)
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}${month}${day}${hours}${minutes}${seconds}`
  }

  /**
   * Lấy message từ response code
   */
  private getResponseMessage(code: string): string {
    const messages: { [key: string]: string } = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
    }
    return messages[code] || 'Lỗi không xác định'
  }
}

/**
 * Khởi tạo VNPay service từ environment variables
 */
export function createVNPayService(): VNPayService {
  const config: VNPayConfig = {
    tmnCode: process.env.VNPAY_TMN_CODE || '',
    hashSecret: process.env.VNPAY_HASH_SECRET || '',
    url: process.env.VNPAY_URL || '',
    returnUrl: process.env.VNPAY_RETURN_URL || '',
  }

  console.log('🔧 VNPay Service Init:', {
    tmnCode: config.tmnCode,
    hasHashSecret: !!config.hashSecret,
    url: config.url,
    returnUrl: config.returnUrl
  })

  // Validate config
  if (!config.tmnCode || !config.hashSecret || !config.url || !config.returnUrl) {
    console.error('❌ VNPay Config Missing:', {
      hasTmnCode: !!config.tmnCode,
      hasHashSecret: !!config.hashSecret,
      hasUrl: !!config.url,
      hasReturnUrl: !!config.returnUrl
    })
    throw new Error('VNPay configuration is incomplete. Please check environment variables.')
  }

  return new VNPayService(config)
}
