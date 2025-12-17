import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const trainer = await prisma.trainer.findUnique({
      where: { id },
      include: {
        schedules: {
          orderBy: { day: 'asc' },
        },
        members: {
          include: {
            member: true,
          },
        },
      },
    });

    if (!trainer) {
      return NextResponse.json(
        { message: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    const todaySchedules = trainer.schedules.filter(s => s.day === currentDay);
    
    // Calculate total hours this week (sum of all schedule hours)
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let totalHours = 0;
    
    trainer.schedules.forEach(schedule => {
      const start = schedule.startTime.split(':');
      const end = schedule.endTime.split(':');
      const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
      const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
      totalHours += (endMinutes - startMinutes) / 60;
    });

    // Get count of subscribed members
    const subscribedMembers = await prisma.memberTrainer.count({
      where: { trainerId: id }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...trainerWithoutPassword } = trainer;

    return NextResponse.json({
      ...trainerWithoutPassword,
      stats: {
        todaySchedules: todaySchedules.length,
        totalHoursPerWeek: Math.round(totalHours),
        activeMembers: subscribedMembers,
      }
    });
  } catch (error) {
    console.error('Error fetching trainer data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
