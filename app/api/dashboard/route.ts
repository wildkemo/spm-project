
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalMembers,
      activeMembers,
      inactiveMembers,
      totalTrainers,
      recentAttendance,
      todayAttendance,
      thisMonthRevenue,
      lastMonthRevenue,
      recentPayments,
      upcomingSchedules,
      totalPlans,
      membersWithPlans,
    ] = await Promise.all([
      // Member stats
      prisma.member.count(),
      prisma.member.count({ where: { status: 'Active' } }),
      prisma.member.count({ where: { status: 'Inactive' } }),
      
      // Trainer stats
      prisma.trainer.count(),
      
      // Attendance stats
      prisma.attendance.findMany({
        take: 10,
        orderBy: { date: 'desc' },
        include: { 
          member: { select: { firstName: true, lastName: true } },
          trainer: { select: { name: true } }
        },
      }),
      prisma.attendance.count({
        where: {
          date: { gte: startOfToday }
        }
      }),
      
      // Revenue stats
      prisma.payment.aggregate({
        where: {
          date: { gte: startOfMonth }
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.payment.aggregate({
        where: {
          date: { gte: startOfLastMonth, lte: endOfLastMonth }
        },
        _sum: { amount: true },
      }),
      
      // Recent payments
      prisma.payment.findMany({
        take: 5,
        orderBy: { date: 'desc' },
        include: {
          member: { select: { firstName: true, lastName: true } }
        }
      }),
      
      // Upcoming schedules (today's schedules)
      prisma.schedule.findMany({
        where: {
          day: now.toLocaleDateString('en-US', { weekday: 'long' })
        },
        include: {
          trainer: { select: { name: true } }
        },
        orderBy: { startTime: 'asc' }
      }),
      
      // Plan stats
      prisma.membershipPlan.count(),
      prisma.member.count({ where: { planId: { not: null } } }),
    ])

    const thisMonthRevenueAmount = thisMonthRevenue._sum.amount || 0;
    const lastMonthRevenueAmount = lastMonthRevenue._sum.amount || 0;
    const revenueGrowth = lastMonthRevenueAmount > 0 
      ? ((thisMonthRevenueAmount - lastMonthRevenueAmount) / lastMonthRevenueAmount * 100).toFixed(1)
      : 0;

    return NextResponse.json({
      members: {
        total: totalMembers,
        active: activeMembers,
        inactive: inactiveMembers,
        withPlans: membersWithPlans,
      },
      trainers: {
        total: totalTrainers,
      },
      attendance: {
        today: todayAttendance,
        recent: recentAttendance,
      },
      revenue: {
        thisMonth: thisMonthRevenueAmount,
        lastMonth: lastMonthRevenueAmount,
        growth: parseFloat(revenueGrowth as string),
        paymentsCount: thisMonthRevenue._count,
      },
      payments: {
        recent: recentPayments,
      },
      schedules: {
        today: upcomingSchedules,
      },
      plans: {
        total: totalPlans,
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
