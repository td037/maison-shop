'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface TestData {
  products?: any[]
  users?: any[]
  loading: boolean
  error: string | null
}

export default function TestPage() {
  const [products, setProducts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch products
        const productsRes = await fetch('/api/products')
        if (!productsRes.ok) throw new Error('Failed to fetch products')
        const productsData = await productsRes.json()
        setProducts(productsData.products || [])

        // Fetch users
        const usersRes = await fetch('/api/users')
        if (!usersRes.ok) throw new Error('Failed to fetch users')
        const usersData = await usersRes.json()
        setUsers(usersData.users || [])

        setError(null)
      } catch (err: any) {
        setError(err.message)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display font-black text-4xl text-on-surface mb-2">
                Test Data Rendering
              </h1>
              <p className="text-sm text-on-surface-muted font-body">
                Kiểm tra API và render dữ liệu từ MongoDB
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-primary hover:bg-primary-container text-white font-display font-bold text-sm rounded-btn transition-all"
            >
              ← Back Home
            </Link>
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-surface-lowest border border-outline-variant/20 rounded-btn p-6">
            <p className="text-sm font-display font-bold text-on-surface-muted uppercase mb-2">
              Products
            </p>
            <p className="text-3xl font-display font-black text-on-surface">
              {products.length}
            </p>
          </div>
          <div className="bg-surface-lowest border border-outline-variant/20 rounded-btn p-6">
            <p className="text-sm font-display font-bold text-on-surface-muted uppercase mb-2">
              Users
            </p>
            <p className="text-3xl font-display font-black text-on-surface">
              {users.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-outline-variant/20 pb-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 font-body text-sm font-semibold transition-colors ${
              activeTab === 'products'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-muted hover:text-on-surface'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 font-body text-sm font-semibold transition-colors ${
              activeTab === 'users'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-muted hover:text-on-surface'
            }`}
          >
            Users ({users.length})
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error-container border border-error rounded-btn p-4 mb-8">
            <p className="text-sm text-error font-body">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-xs text-error/70 font-body mt-2">
              Make sure MongoDB is connected and seeded. Run: <code className="bg-error/10 px-2 py-1 rounded">npm run seed</code>
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        )}

        {/* Products List */}
        {!loading && activeTab === 'products' && (
          <div>
            {products.length === 0 ? (
              <div className="bg-surface-low rounded-btn p-12 text-center">
                <p className="text-sm text-on-surface-muted font-body">
                  Không có sản phẩm nào. Chạy <code className="bg-white/50 px-2 py-1 rounded text-xs">npm run seed</code> để tạo dữ liệu mẫu.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product: any) => (
                  <div
                    key={product._id}
                    className="bg-surface-lowest border border-outline-variant/20 rounded-btn p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-on-surface mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-on-surface-muted font-body">
                          SKU: {product.sku}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-display font-bold uppercase rounded-btn ${
                        product.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p className="text-sm text-on-surface-muted font-body mb-4">
                      {product.shortDescription || product.description?.substring(0, 100)}
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-on-surface-muted uppercase font-display font-bold mb-1">
                          Price
                        </p>
                        <p className="text-lg font-display font-black text-on-surface">
                          ${product.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-muted uppercase font-display font-bold mb-1">
                          Stock
                        </p>
                        <p className="text-lg font-display font-black text-on-surface">
                          {product.totalStock || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-muted uppercase font-display font-bold mb-1">
                          Featured
                        </p>
                        <p className="text-lg font-display font-black text-on-surface">
                          {product.isFeatured ? '✓' : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users List */}
        {!loading && activeTab === 'users' && (
          <div>
            {users.length === 0 ? (
              <div className="bg-surface-low rounded-btn p-12 text-center">
                <p className="text-sm text-on-surface-muted font-body">
                  Không có user nào. Hãy đăng ký user mới hoặc chạy seed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user: any) => (
                  <div
                    key={user._id}
                    className="bg-surface-lowest border border-outline-variant/20 rounded-btn p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-lg text-on-surface mb-1">
                          {user.name}
                        </h3>
                        <p className="text-sm text-on-surface-muted font-body">
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="text-sm text-on-surface-muted font-body">
                            {user.phone}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 text-xs font-display font-bold uppercase rounded-btn ${
                        user.role === 'admin'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-low text-on-surface-muted'
                      }`}>
                        {user.role}
                      </span>
                    </div>

                    {user.addresses && user.addresses.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-outline-variant/20">
                        <p className="text-xs font-display font-bold text-on-surface-muted uppercase mb-2">
                          Addresses
                        </p>
                        <div className="space-y-1">
                          {user.addresses.map((addr: any, idx: number) => (
                            <p key={idx} className="text-xs text-on-surface font-body">
                              {addr.label}: {addr.street}, {addr.district}, {addr.city}
                              {addr.isDefault && ' <span className="text-primary">(Default)</span>'}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
