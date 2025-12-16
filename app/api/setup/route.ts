import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const userCount = await db.user.count()
    if (userCount > 0) {
      return NextResponse.json({ message: 'Database already seeded', count: userCount })
    }

    const admin = await db.user.create({
      data: {
        username: 'admin',
        password: 'adminpassword',
        role: 'Admin',
      },
    })

    const staff = await db.user.create({
      data: {
        username: 'staff',
        password: 'staffpassword',
        role: 'Staff',
      },
    })

    const trainer = await db.user.create({
      data: {
        username: 'trainer',
        password: 'trainerpassword',
        role: 'Trainer',
      },
    })

    return NextResponse.json({ message: 'Database seeded successfully', users: [admin, staff, trainer] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed database', message: (error as Error).message, stack: (error as Error).stack }, { status: 500 })
  }
}
