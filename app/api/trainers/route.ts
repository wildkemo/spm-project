
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
    
    // Validate required fields
    if (!body.username || !body.password || !body.name || !body.email) {
      return NextResponse.json(
        { message: 'Username, password, name, and email are required' }, 
        { status: 400 }
      )
    }

    // Check for duplicate username or email
    const existing = await prisma.trainer.findFirst({
      where: {
        OR: [
          { username: body.username },
          { email: body.email }
        ]
      }
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Username or email already exists' },
        { status: 400 }
      )
    }

    const trainer = await prisma.trainer.create({
      data: {
        username: body.username,
        password: body.password, // Note: In production, this should be hashed
        name: body.name,
        email: body.email,
        specialization: body.specialization || null,
      },
    })
    
    // Don't return password in response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...trainerWithoutPassword } = trainer
    return NextResponse.json(trainerWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Error creating trainer:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
