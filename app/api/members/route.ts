
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
    // Validate required fields (simple check)
    if (!body.firstName || !body.lastName || !body.email || !body.membershipEnd) {
       return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const member = await prisma.member.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        status: body.status || 'Active',
        membershipEnd: new Date(body.membershipEnd), // Ensure date format
        planId: body.planId,
      },
    })
    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
