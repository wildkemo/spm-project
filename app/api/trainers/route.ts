
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const trainers = await prisma.trainer.findMany()
    return NextResponse.json(trainers)
  } catch (error) {
    console.error('Error fetching trainers:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name || !body.email) {
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 })
    }

    const trainer = await prisma.trainer.create({
      data: {
        name: body.name,
        email: body.email,
        specialization: body.specialization,
      },
    })
    return NextResponse.json(trainer, { status: 201 })
  } catch (error) {
    console.error('Error creating trainer:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
