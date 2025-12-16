
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [memberCount, trainerCount, recentAttendance, totalPayments] = await Promise.all([
      prisma.member.count(),
      prisma.trainer.count(),
      prisma.attendance.findMany({
        take: 5,
        orderBy: { date: 'desc' },
        include: { member: true },
      }),
      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ])

    return NextResponse.json({
      memberCount,
      trainerCount,
      recentAttendance,
      totalRevenue: totalPayments._sum.amount || 0,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
