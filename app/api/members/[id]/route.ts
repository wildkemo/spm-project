
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const member = await prisma.member.findUnique({
      where: { id },
      include: { plan: true, payments: true, attendance: true },
    })

    if (!member) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json(member)
  } catch (error) {
     console.error('Error fetching member:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const body = await request.json()

    const member = await prisma.member.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        status: body.status,
        membershipEnd: body.membershipEnd ? new Date(body.membershipEnd) : undefined,
        planId: body.planId,
      },
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    await prisma.member.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Member deleted' })
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
