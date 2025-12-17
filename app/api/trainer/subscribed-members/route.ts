import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get('trainerId');

    if (!trainerId) {
      return NextResponse.json(
        { message: 'Trainer ID is required' },
        { status: 400 }
      );
    }

    // Fetch members subscribed to this trainer
    const subscriptions = await prisma.memberTrainer.findMany({
      where: {
        trainerId,
      },
      include: {
        member: {
          include: {
            plan: true,
            attendance: {
              orderBy: { date: 'desc' },
            },
          },
        },
      },
    });

    // Extract member data from subscriptions
    const members = subscriptions.map((sub) => sub.member);

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching subscribed members:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
