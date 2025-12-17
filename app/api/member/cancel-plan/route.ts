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

    // Update member to remove plan
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        planId: null,
        status: 'Inactive',
      },
    });

    return NextResponse.json({
      message: 'Successfully cancelled plan',
      member: updatedMember,
    });
  } catch (error) {
    console.error('Error cancelling plan:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
