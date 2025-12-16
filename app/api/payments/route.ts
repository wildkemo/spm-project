
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        member: true,
      },
      orderBy: {
        date: 'desc',
      },
    })
    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.amount || !body.memberId || !body.method) {
      return NextResponse.json({ message: 'Amount, memberId, and method are required' }, { status: 400 })
    }

    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(body.amount),
        memberId: body.memberId,
        method: body.method,
        date: new Date(),
      },
    })
    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Error recording payment:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
