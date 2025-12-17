import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all trainers with subscription status for the member
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json(
        { message: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Fetch all trainers
    const trainers = await prisma.trainer.findMany({
      include: {
        members: {
          where: {
            memberId,
          },
        },
      },
    });

    // Map trainers with subscription status
    const trainersWithStatus = trainers.map((trainer) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, members, ...trainerData } = trainer;
      return {
        ...trainerData,
        isSubscribed: members.length > 0,
        subscriptionId: members[0]?.id || null,
      };
    });

    return NextResponse.json(trainersWithStatus);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Subscribe or unsubscribe from a trainer
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberId, trainerId, action } = body;

    if (!memberId || !trainerId || !action) {
      return NextResponse.json(
        { message: 'Member ID, Trainer ID, and action are required' },
        { status: 400 }
      );
    }

    if (action === 'subscribe') {
      // Check if already subscribed
      const existing = await prisma.memberTrainer.findUnique({
        where: {
          memberId_trainerId: {
            memberId,
            trainerId,
          },
        },
      });

      if (existing) {
        return NextResponse.json(
          { message: 'Already subscribed to this trainer' },
          { status: 400 }
        );
      }

      // Create subscription
      const subscription = await prisma.memberTrainer.create({
        data: {
          memberId,
          trainerId,
        },
        include: {
          trainer: true,
        },
      });

      return NextResponse.json({
        message: 'Successfully subscribed to trainer',
        subscription,
      });
    } else if (action === 'unsubscribe') {
      // Delete subscription
      await prisma.memberTrainer.delete({
        where: {
          memberId_trainerId: {
            memberId,
            trainerId,
          },
        },
      });

      return NextResponse.json({
        message: 'Successfully unsubscribed from trainer',
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid action. Use "subscribe" or "unsubscribe"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error managing trainer subscription:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
