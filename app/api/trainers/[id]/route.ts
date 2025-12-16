
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const trainer = await prisma.trainer.findUnique({
      where: { id },
      include: { schedules: true },
    })

    if (!trainer) {
      return NextResponse.json({ message: 'Trainer not found' }, { status: 404 })
    }
    return NextResponse.json(trainer)
  } catch (error) {
    console.error('Error fetching trainer:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const body = await request.json()

    const trainer = await prisma.trainer.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        specialization: body.specialization,
      },
    })
    return NextResponse.json(trainer)
  } catch (error) {
     console.error('Error updating trainer:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    await prisma.trainer.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Trainer deleted' })
  } catch (error) {
     console.error('Error deleting trainer:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
