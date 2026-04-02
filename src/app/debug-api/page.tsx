'use client';

import { useEffect, useState } from 'react';

export default function DebugAPIPage() {
  const [products, setProducts] = useState<any>(null);
  const [categories, setCategories] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Test products API
        const productsRes = await fetch('/api/products');
        const productsData = await productsRes.json();
        setProducts(productsData);

        // Test categories API
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 API Debug Page</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Products */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">📦 Products API</h2>
          <p className="text-sm text-gray-600 mb-4">
            Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">/api/products</code>
          </p>
          
          {products ? (
            <>
              <div className="mb-4">
                <p className="font-semibold">
                  Total Products: {products.pagination?.total || products.products?.length || 0}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {products.products ? '✅ Success' : '❌ Failed'}
                </p>
              </div>

              <details className="mb-4">
                <summary className="cursor-pointer font-semibold mb-2">
                  View Raw Response
                </summary>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                  {JSON.stringify(products, null, 2)}
                </pre>
              </details>

              {products.products && products.products.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {products.products.map((p: any) => (
                    <div key={p._id} className="border rounded p-3">
                      <img 
                        src={p.images?.[0]?.url || 'https://via.placeholder.com/200'} 
                        alt={p.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <p className="font-semibold text-sm line-clamp-2">{p.name}</p>
                      <p className="text-xs text-gray-600">
                        {p.price?.toLocaleString('vi-VN')}₫
                      </p>
                      <p className="text-xs">
                        Active: {p.isActive ? '✅' : '❌'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-red-600">No products data received</p>
          )}
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">📁 Categories API</h2>
          <p className="text-sm text-gray-600 mb-4">
            Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">/api/categories</code>
          </p>
          
          {categories ? (
            <>
              <div className="mb-4">
                <p className="font-semibold">
                  Total Categories: {categories.data?.length || 0}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {categories.success ? '✅ Success' : '❌ Failed'}
                </p>
              </div>

              <details className="mb-4">
                <summary className="cursor-pointer font-semibold mb-2">
                  View Raw Response
                </summary>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                  {JSON.stringify(categories, null, 2)}
                </pre>
              </details>

              {categories.data && categories.data.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.data.map((c: any) => (
                    <div key={c._id} className="border rounded p-3">
                      <p className="font-semibold">{c.icon} {c.name}</p>
                      <p className="text-xs text-gray-600">{c.slug}</p>
                      <p className="text-xs">
                        Active: {c.isActive ? '✅' : '❌'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-red-600">No categories data received</p>
          )}
        </div>

        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4">⚙️ Environment Info</h2>
          <p className="text-sm">
            <strong>NEXT_PUBLIC_API_URL:</strong>{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_API_URL || 'Not set (using relative URLs)'}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
