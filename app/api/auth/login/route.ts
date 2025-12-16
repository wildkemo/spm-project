
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, role } = body

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      )
    }

    let user = null;
    let userRole = role; // Default to requested role for user object return

    // Verify against specific table based on requested role
    if (role === 'admin') {
      // Check Admin table
      user = await prisma.admin.findUnique({ where: { username } });
      if (!user) {
         // Fallback: check if it's a staff member? SRS says Staff registers members/payments.
         // Assuming Staff might be in Admin table or we just treat them as Admin for now for simplicity.
         // Or maybe we should have a 'Staff' model? 
         // Implementation plan didn't specify Staff model, just Admin, Member, Trainer.
         // Let's assume Admin table covers Admin/Staff for now or just Admin.
      }
    } else if (role === 'trainer') {
      user = await prisma.trainer.findUnique({ where: { username } });
    } else if (role === 'member') {
      user = await prisma.member.findUnique({ where: { username } });
    } else {
        return NextResponse.json(
            { message: 'Invalid role specified' },
            { status: 400 }
        )
    }

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ 
        user: { 
            ...userWithoutPassword, 
            role: userRole // helper for frontend to know it was successful
        } 
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
