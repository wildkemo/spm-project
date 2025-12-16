import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        plan: true,
        payments: {
          orderBy: { date: 'desc' },
        },
        attendance: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: 'Member not found' },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...memberWithoutPassword } = member;

    return NextResponse.json(memberWithoutPassword);
  } catch (error) {
    console.error('Error fetching member data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
