
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        plan: true, // Include plan details
      },
      orderBy: {
        joinDate: 'desc',
      }
    })
    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.username || !body.password || !body.firstName || !body.lastName || !body.email) {
       return NextResponse.json(
        { message: 'Username, password, first name, last name, and email are required' },
        { status: 400 }
      )
    }

    // Check for duplicate username or email
    const existing = await prisma.member.findFirst({
      where: {
        OR: [
          { username: body.username },
          { email: body.email }
        ]
      }
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Username or email already exists' },
        { status: 400 }
      )
    }

    // Set default membership end date if not provided
    const membershipEnd = body.membershipEnd 
      ? new Date(body.membershipEnd)
      : new Date(new Date().setMonth(new Date().getMonth() + 1)); // Default 1 month

    const member = await prisma.member.create({
      data: {
        username: body.username,
        password: body.password, // Note: In production, this should be hashed
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || null,
        address: body.address || null,
        status: body.status || 'Active',
        joinDate: body.joinDate ? new Date(body.joinDate) : new Date(),
        membershipEnd: membershipEnd,
        planId: body.planId || null,
      },
    })
    
    // Don't return password in response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...memberWithoutPassword } = member
    return NextResponse.json(memberWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
