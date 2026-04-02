import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connect'
import Category from '@/models/Category'

function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    const category = await Category.findById(id)
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: category })
  } catch (error: any) {
    console.error('Get category error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get category' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    const body = await req.json()
    delete body._id
    delete body.__v

    const category = await Category.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Category updated successfully', category })
  } catch (error: any) {
    console.error('Update category error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    const category = await Category.findByIdAndDelete(id)
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error: any) {
    console.error('Delete category error:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 })
  }
}
