import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'adminpassword', // In a real app, hash this!
      role: 'Admin',
    },
  })

  const staff = await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      password: 'staffpassword',
      role: 'Staff',
    },
  })

  const trainer = await prisma.user.upsert({
    where: { username: 'trainer' },
    update: {},
    create: {
      username: 'trainer',
      password: 'trainerpassword',
      role: 'Trainer',
    },
  })

  console.log({ admin, staff, trainer })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
