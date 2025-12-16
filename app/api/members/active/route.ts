import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      where: { status: 'Active' },
      include: {
        plan: true,
      },
      orderBy: { firstName: 'asc' },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching active members:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
