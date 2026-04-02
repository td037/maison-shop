export default function TestVNPayPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>VNPay Integration Test</h1>
      <p>Version: 2.0</p>
      <p>Status: Deployed</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      <hr />
      <h2>Payment Methods Available:</h2>
      <ul>
        <li>✅ COD - Thanh toán khi nhận hàng</li>
        <li>✅ VNPay - ATM / Visa / Mastercard</li>
      </ul>
      <hr />
      <p>If you can see this page, the deployment is working.</p>
      <a href="/checkout" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go to Checkout Page
      </a>
    </div>
  )
}
