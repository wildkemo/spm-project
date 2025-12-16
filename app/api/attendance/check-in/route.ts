import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberId } = body;

    if (!memberId) {
      return NextResponse.json(
        { message: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Verify member exists and is active
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return NextResponse.json(
        { message: 'Member not found' },
        { status: 404 }
      );
    }

    if (member.status !== 'Active') {
      return NextResponse.json(
        { message: 'Member is not active' },
        { status: 400 }
      );
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        memberId,
        date: new Date(),
      },
      include: {
        member: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Attendance recorded successfully',
      attendance,
    });
  } catch (error) {
    console.error('Error recording attendance:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
