'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/data'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  image: string
  imageHover: string
  tag: string | null
  colors: string[]
  sizes: string[]
  inStock: boolean
  isNew: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const [wished, setWished] = useState(false)

  return (
    <div
      className="product-card group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-surface-low mb-4" style={{ aspectRatio: '3/4' }}>
        <Image
          src={hovered ? product.imageHover : product.image}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount > 0 && (
            <span className="badge-sale">-{product.discount}%</span>
          )}
          {product.isNew && (
            <span className="bg-[#1a1a2e] text-white text-xs font-display font-bold px-2 py-0.5 rounded-sm">
              MỚI
            </span>
          )}
          {product.tag && !product.isNew && product.discount === 0 && (
            <span className="bg-white/90 text-on-surface text-xs font-display font-bold px-2 py-0.5 rounded-sm">
              {product.tag}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished) }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 border-none cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wished ? '#ab2e00' : 'none'} stroke={wished ? '#ab2e00' : '#1b1c1c'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {product.inStock ? (
            <button className="w-full bg-[#1a1a2e] text-white py-3 text-sm font-display font-semibold hover:bg-primary transition-colors border-none cursor-pointer">
              Thêm vào giỏ hàng
            </button>
          ) : (
            <div className="w-full bg-surface-mid text-on-surface-muted py-3 text-sm font-display font-semibold text-center">
              Hết hàng
            </div>
          )}
        </div>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <span className="bg-white text-on-surface-muted text-xs font-display font-bold px-4 py-2 rounded-btn">
              HẾT HÀNG
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <Link href={`/product/${product.slug}`} className="no-underline block">
        {/* Colors */}
        <div className="flex gap-1.5 mb-2">
          {product.colors.slice(0, 4).map((c, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-full border border-outline-variant/40"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Name */}
        <h3 className="font-display font-semibold text-sm text-on-surface leading-snug mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} width="11" height="11" viewBox="0 0 24 24"
                fill={star <= Math.round(product.rating) ? '#ab2e00' : 'none'}
                stroke="#ab2e00" strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-on-surface-muted text-xs font-body">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-base text-[#1a1a2e]">
            {formatPrice(product.price)}
          </span>
          {product.discount > 0 && (
            <span className="font-body text-xs text-on-surface-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}
