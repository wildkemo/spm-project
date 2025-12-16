
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        trainer: true,
      },
    })
    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.trainerId || !body.day || !body.startTime || !body.endTime) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    const schedule = await prisma.schedule.create({
      data: {
        trainerId: body.trainerId,
        day: body.day,
        startTime: body.startTime,
        endTime: body.endTime,
      },
    })
    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    console.error('Error creating schedule:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
