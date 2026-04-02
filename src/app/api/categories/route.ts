import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connect'
import Category from '@/models/Category'

// Hàm kiểm tra URL ảnh có hợp lệ không
function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80';

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '6', 10)
    const isActive = searchParams.get('active') !== 'false'
    const randomize = searchParams.get('random') === 'true'

    // Fetch only top-level categories (without parent)
    const categories = await Category.find(
      isActive ? { isActive: true, parentCategory: null } : { parentCategory: null }
    )
      .sort({ order: 1 })
      .lean()

    // Random shuffle nếu request random=true
    let resultCategories = categories
    if (randomize && categories.length > 0) {
      resultCategories = categories.sort(() => Math.random() - 0.5).slice(0, limit)
    } else {
      resultCategories = categories.slice(0, limit)
    }

    // Transform documents to include category name in place of id
    const formattedCategories = resultCategories.map((cat: any) => ({
      id: cat._id.toString(),
      name: cat.name || 'Danh mục không tên',
      slug: cat.slug,
      image: isValidImageUrl(cat.image) ? cat.image : DEFAULT_IMAGE,
      count: 0, // Will be populated later if needed
      icon: cat.icon || '📦',
    }))

    return NextResponse.json({
      success: true,
      data: formattedCategories,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { name, slug, description, icon, order, parentCategory, isActive } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
    }

    const existingCategory = await Category.findOne({ slug: slug.toLowerCase() })
    if (existingCategory) {
      return NextResponse.json({ error: 'Category slug already exists' }, { status: 409 })
    }

    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      order,
      parentCategory: parentCategory || null,
      isActive: typeof isActive === 'boolean' ? isActive : true,
    })

    return NextResponse.json({ message: 'Category created successfully', category }, { status: 201 })
  } catch (error: any) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 })
  }
}
