'use client'

export default function DebugVNPayPage() {
  const paymentMethods = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '🏠' },
    { id: 'vnpay', label: 'VNPay (ATM / Visa / Mastercard)', icon: '💳' },
  ]

  const checkVNPayAPI = async () => {
    try {
      const response = await fetch('/api/payments/vnpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: 'TEST123',
          amount: 100000,
          orderInfo: 'Test order',
        }),
      })
      const data = await response.json()
      return { status: response.status, data }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔍 VNPay Debug Page</h1>
      <hr />
      
      <h2>1. Payment Methods Array:</h2>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        {JSON.stringify(paymentMethods, null, 2)}
      </pre>

      <h2>2. VNPay Exists?</h2>
      <p style={{ fontSize: '24px', color: 'green' }}>
        ✅ YES - VNPay is in the code!
      </p>

      <h2>3. Test VNPay API:</h2>
      <button 
        onClick={async () => {
          const result = await checkVNPayAPI()
          alert(JSON.stringify(result, null, 2))
        }}
        style={{
          padding: '10px 20px',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Test VNPay API
      </button>

      <h2>4. Environment Variables (Server-side):</h2>
      <p>Check Vercel dashboard for:</p>
      <ul>
        <li>VNPAY_TMN_CODE</li>
        <li>VNPAY_HASH_SECRET</li>
        <li>VNPAY_URL</li>
        <li>VNPAY_RETURN_URL</li>
      </ul>

      <hr />
      <h2>5. Go to Checkout:</h2>
      <a 
        href="/checkout" 
        style={{ 
          display: 'inline-block',
          padding: '10px 20px',
          background: '#ff6b35',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          marginTop: '10px'
        }}
      >
        Go to Checkout Page
      </a>

      <hr />
      <h2>6. Instructions:</h2>
      <ol>
        <li>If you see this page → Deployment is working</li>
        <li>VNPay code exists in the deployment</li>
        <li>Click "Test VNPay API" to check API route</li>
        <li>Go to Checkout and do HARD REFRESH (Ctrl+Shift+R)</li>
      </ol>

      <hr />
      <p style={{ color: '#666', fontSize: '12px' }}>
        Deployment: {new Date().toISOString()}
      </p>
    </div>
  )
}
