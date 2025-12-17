import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberId, planId } = body;

    if (!memberId || !planId) {
      return NextResponse.json(
        { message: 'Member ID and Plan ID are required' },
        { status: 400 }
      );
    }

    // Fetch the plan to get duration
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { message: 'Plan not found' },
        { status: 404 }
      );
    }

    // Calculate membership end date
    const now = new Date();
    const membershipEnd = new Date(now);
    membershipEnd.setMonth(membershipEnd.getMonth() + plan.duration);

    // Update member with new plan
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        planId,
        membershipEnd,
        status: 'Active',
      },
      include: {
        plan: true,
      },
    });

    return NextResponse.json({
      message: 'Successfully enrolled in plan',
      member: updatedMember,
    });
  } catch (error) {
    console.error('Error enrolling in plan:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
