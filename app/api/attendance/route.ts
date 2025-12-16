
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        member: true,
      },
      orderBy: {
        date: 'desc',
      },
    })
    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.memberId) {
      return NextResponse.json({ message: 'Member ID is required' }, { status: 400 })
    }

    const attendance = await prisma.attendance.create({
      data: {
        memberId: body.memberId,
        date: new Date(),
      },
    })
    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    console.error('Error recording attendance:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
