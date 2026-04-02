import 'server-only'

import dbConnect from '@/lib/db/connect'
import User from '@/models/User'
import Product from '@/models/Product'
import Order from '@/models/Order'
import Category from '@/models/Category'

export type AdminSection = 'dashboard' | 'users' | 'products' | 'orders' | 'categories' | 'analytics'

export interface DashboardSummary {
  users: { total: number; customers: number; admins: number }
  products: { total: number; active: number; discounted: number; lowStock: number }
  orders: { total: number; pending: number; confirmed: number; shipping: number; delivered: number; cancelled: number }
  revenue: { gross: number; paid: number; averageOrderValue: number }
  categories: { total: number }
}

export interface RevenuePoint {
  date: string
  revenue: number
  orders: number
}

export interface OrderStatusCount {
  status: string
  count: number
}

function toNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value) || 0
  return 0
}

export function formatCurrencyVnd(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value || 0)
}

export function formatDateShort(input?: string | Date | null) {
  if (!input) return 'N/A'
  const date = new Date(input)
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

export function formatDateTime(input?: string | Date | null) {
  if (!input) return 'N/A'
  const date = new Date(input)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function startOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function buildRevenueSeries(orders: any[], days = 14): RevenuePoint[] {
  const series: RevenuePoint[] = []
  const revenueMap = new Map<string, RevenuePoint>()

  const start = startOfDay(new Date())
  start.setDate(start.getDate() - (days - 1))

  for (let i = 0; i < days; i += 1) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    const key = date.toISOString().slice(0, 10)
    const label = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(date)
    const point = { date: label, revenue: 0, orders: 0 }
    series.push(point)
    revenueMap.set(key, point)
  }

  for (const order of orders) {
    const createdAt = new Date(order.createdAt)
    const key = createdAt.toISOString().slice(0, 10)
    const point = revenueMap.get(key)
    if (!point) continue
    point.orders += 1
    point.revenue += toNumber(order.totalAmount)
  }

  return series
}

export async function getAdminDashboardData() {
  await dbConnect()

  const [
    totalUsers,
    totalCustomers,
    totalAdmins,
    totalProducts,
    activeProducts,
    discountedProducts,
    lowStockProducts,
    totalCategories,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    shippingOrders,
    deliveredOrders,
    cancelledOrders,
    paidRevenueAgg,
    paidOrdersCount,
    recentOrders,
    topProducts,
    ordersForTrend,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'admin' }),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true, salePrice: { $exists: true, $ne: null } }),
    Product.countDocuments({ isActive: true, totalStock: { $lte: 5 } }),
    Category.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'pending' }),
    Order.countDocuments({ orderStatus: 'confirmed' }),
    Order.countDocuments({ orderStatus: 'shipping' }),
    Order.countDocuments({ orderStatus: 'delivered' }),
    Order.countDocuments({ orderStatus: 'cancelled' }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' } } },
    ]),
    Order.countDocuments({ paymentStatus: 'paid' }),
    Order.find().populate('userId', 'name email phone').sort({ createdAt: -1 }).limit(8).lean(),
    Product.find({ isActive: true }).populate('category', 'name slug').sort({ 'rating.average': -1, createdAt: -1 }).limit(6).lean(),
    Order.find({ createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 13)) } })
      .sort({ createdAt: 1 })
      .lean(),
  ])

  const revenue = paidRevenueAgg[0]?.revenue || 0
  const averageOrderValue = paidOrdersCount > 0 ? revenue / paidOrdersCount : 0
  const revenueSeries = buildRevenueSeries(ordersForTrend, 14)

  return {
    summary: {
      users: { total: totalUsers, customers: totalCustomers, admins: totalAdmins },
      products: { total: totalProducts, active: activeProducts, discounted: discountedProducts, lowStock: lowStockProducts },
      orders: { total: totalOrders, pending: pendingOrders, confirmed: confirmedOrders, shipping: shippingOrders, delivered: deliveredOrders, cancelled: cancelledOrders },
      revenue: { gross: revenue, paid: revenue, averageOrderValue },
      categories: { total: totalCategories },
    } satisfies DashboardSummary,
    recentOrders,
    topProducts,
    revenueSeries,
    statusCounts: [
      { status: 'pending', count: pendingOrders },
      { status: 'confirmed', count: confirmedOrders },
      { status: 'shipping', count: shippingOrders },
      { status: 'delivered', count: deliveredOrders },
      { status: 'cancelled', count: cancelledOrders },
    ] satisfies OrderStatusCount[],
  }
}

export async function getAdminUsersData(options?: { search?: string; role?: string; page?: number; limit?: number }) {
  await dbConnect()

  const page = Math.max(1, options?.page || 1)
  const limit = Math.min(Math.max(options?.limit || 12, 1), 50)
  const search = options?.search?.trim()
  const role = options?.role && options.role !== 'all' ? options.role : undefined

  const filter: Record<string, any> = {}
  if (role) filter.role = role
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ]
  }

  const skip = (page - 1) * limit
  const [total, users, orderAgg, userAgg] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.aggregate([
      {
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 },
          spent: { $sum: '$totalAmount' },
          lastOrderAt: { $max: '$createdAt' },
        },
      },
    ]),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
  ])

  const statsMap = new Map(orderAgg.map((entry: any) => [String(entry._id), entry]))
  const roleMap = new Map(userAgg.map((entry: any) => [String(entry._id), entry.count]))

  const rows = users.map((user: any) => {
    const stats = statsMap.get(String(user._id))
    return {
      ...user,
      orderCount: stats?.orderCount || 0,
      spent: stats?.spent || 0,
      lastOrderAt: stats?.lastOrderAt || null,
    }
  })

  return {
    users: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    roleCounts: {
      customer: roleMap.get('customer') || 0,
      admin: roleMap.get('admin') || 0,
    },
  }
}

export async function getAdminDiscountProductsData(options?: { search?: string; page?: number; limit?: number }) {
  await dbConnect()

  const page = Math.max(1, options?.page || 1)
  const limit = Math.min(Math.max(options?.limit || 12, 1), 50)
  const search = options?.search?.trim()
  const filter: Record<string, any> = {
    isActive: true,
    salePrice: { $exists: true, $ne: null },
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ]
  }

  const skip = (page - 1) * limit
  const [total, products, featuredCount] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter).populate('category', 'name slug').sort({ salePrice: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments({ ...filter, isFeatured: true }),
  ])

  const rows = products.map((product: any) => {
    const discountPercent = product.salePrice && product.price ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0
    return {
      ...product,
      discountPercent,
      currentPrice: product.salePrice || product.price,
      categoryName: product.category?.name || 'Chưa phân loại',
    }
  })

  return {
    products: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    stats: {
      total,
      featuredCount,
      averageDiscount: rows.length > 0 ? Math.round(rows.reduce((sum: number, item: any) => sum + item.discountPercent, 0) / rows.length) : 0,
    },
  }
}

export async function getAdminOrdersData(options?: { search?: string; status?: string; page?: number; limit?: number }) {
  await dbConnect()

  const page = Math.max(1, options?.page || 1)
  const limit = Math.min(Math.max(options?.limit || 12, 1), 50)
  const search = options?.search?.trim()
  const status = options?.status && options.status !== 'all' ? options.status : undefined

  const filter: Record<string, any> = {}
  if (status) filter.orderStatus = status
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { shippingAddress: { $regex: search, $options: 'i' } },
      { 'guestInfo.fullName': { $regex: search, $options: 'i' } },
    ]
  }

  const skip = (page - 1) * limit
  const [total, orders, statusAgg, revenueAgg] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter).populate('userId', 'name email phone').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' } } },
    ]),
  ])

  const statusMap = new Map(statusAgg.map((entry: any) => [String(entry._id), entry.count]))

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
    statusCounts: [
      { status: 'pending', count: statusMap.get('pending') || 0 },
      { status: 'confirmed', count: statusMap.get('confirmed') || 0 },
      { status: 'shipping', count: statusMap.get('shipping') || 0 },
      { status: 'delivered', count: statusMap.get('delivered') || 0 },
      { status: 'cancelled', count: statusMap.get('cancelled') || 0 },
    ] satisfies OrderStatusCount[],
    revenue: revenueAgg[0]?.revenue || 0,
  }
}

export async function getAdminCategoriesData() {
  await dbConnect()

  const [categories, productCounts, childCounts, activeProductsCount] = await Promise.all([
    Category.find({ parentCategory: null }).sort({ order: 1, createdAt: -1 }).lean(),
    Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    Category.aggregate([{ $match: { parentCategory: { $ne: null } } }, { $group: { _id: '$parentCategory', count: { $sum: 1 } } }]),
    Product.countDocuments({ isActive: true }),
  ])

  const productMap = new Map(productCounts.map((entry: any) => [String(entry._id), entry.count]))
  const childMap = new Map(childCounts.map((entry: any) => [String(entry._id), entry.count]))

  const rows = categories.map((category: any) => ({
    ...category,
    productCount: productMap.get(String(category._id)) || 0,
    subcategoryCount: childMap.get(String(category._id)) || 0,
  }))

  return {
    categories: rows,
    stats: {
      totalCategories: categories.length,
      activeProductsCount,
      categoryWithMostProducts: rows.reduce((best: any, category: any) => (category.productCount > (best?.productCount || 0) ? category : best), null),
    },
  }
}

export async function getAdminAnalyticsData() {
  await dbConnect()

  const [orders, ordersByStatus, productsByCategory, paidRevenueAgg, orderCount, paidOrdersCount, cancelledCount] = await Promise.all([
    Order.find({ createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 29)) } }).sort({ createdAt: 1 }).lean(),
    Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, revenue: { $sum: '$totalAmount' } } }]),
    Order.countDocuments(),
    Order.countDocuments({ paymentStatus: 'paid' }),
    Order.countDocuments({ orderStatus: 'cancelled' }),
  ])

  const revenueMap = new Map<string, { revenue: number; orders: number }>()
  const start = startOfDay(new Date())
  start.setDate(start.getDate() - 29)

  for (let i = 0; i < 30; i += 1) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    revenueMap.set(date.toISOString().slice(0, 10), { revenue: 0, orders: 0 })
  }

  for (const order of orders) {
    const key = new Date(order.createdAt).toISOString().slice(0, 10)
    const bucket = revenueMap.get(key)
    if (!bucket) continue
    bucket.orders += 1
    if (order.paymentStatus === 'paid' || order.orderStatus === 'delivered') {
      bucket.revenue += toNumber(order.totalAmount)
    }
  }

  const revenueSeries = Array.from(revenueMap.entries()).map(([date, value]) => ({
    date: new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(date)),
    revenue: value.revenue,
    orders: value.orders,
  }))

  const totalRevenue = paidRevenueAgg[0]?.revenue || 0
  const conversionRate = orderCount > 0 ? Math.round((paidOrdersCount / orderCount) * 100) : 0

  return {
    revenueSeries,
    orderCount,
    paidOrdersCount,
    cancelledCount,
    conversionRate,
    totalRevenue,
    ordersByStatus: ordersByStatus as OrderStatusCount[],
    productsByCategory,
  }
}
