
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const plans = await prisma.membershipPlan.findMany()
    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.name || !body.price || !body.duration) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
    }

    const plan = await prisma.membershipPlan.create({
      data: {
        name: body.name,
        price: parseFloat(body.price),
        duration: parseInt(body.duration),
        description: body.description,
      },
    })
    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
