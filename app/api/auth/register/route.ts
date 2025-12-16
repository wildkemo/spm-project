import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { role, username, password, email, firstName, lastName, name, specialization } = body

    if (!username || !password || !email || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (role === 'member') {
        // Check duplicate
        const existing = await prisma.member.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });
        if (existing) {
            return NextResponse.json({ message: 'Username or Email already taken' }, { status: 400 });
        }

        const member = await prisma.member.create({
            data: {
                username,
                password,
                email,
                firstName: firstName || 'Unknown',
                lastName: lastName || 'Unknown',
                membershipEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default 1 month
                planName: 'Basic Plan',
                planDuration: 1,
                planPrice: 50.0,
                paymentsJson: '[]',
                attendanceJson: '[]',
            }
        });
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...memberWithoutPassword } = member;
        return NextResponse.json({ user: memberWithoutPassword });

    } else if (role === 'trainer') {
         // Check duplicate
         const existing = await prisma.trainer.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });
        if (existing) {
            return NextResponse.json({ message: 'Username or Email already taken' }, { status: 400 });
        }

        const trainer = await prisma.trainer.create({
            data: {
                username,
                password,
                email,
                name: name || 'Unknown',
                specialization,
                schedulesJson: '[]',
            }
        });
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...trainerWithoutPassword } = trainer;
        return NextResponse.json({ user: trainerWithoutPassword });
    } else {
        return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
