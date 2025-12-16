
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const body = await request.json()

    const plan = await prisma.membershipPlan.update({
      where: { id },
      data: {
        name: body.name,
        price: body.price ? parseFloat(body.price) : undefined,
        duration: body.duration ? parseInt(body.duration) : undefined,
        description: body.description,
      },
    })
    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error updating plan:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    await prisma.membershipPlan.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Plan deleted' })
  } catch (error) {
    console.error('Error deleting plan:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
