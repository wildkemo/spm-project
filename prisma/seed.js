const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.schedule.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.trainer.deleteMany({});
  await prisma.membershipPlan.deleteMany({});
  await prisma.admin.deleteMany({});

  console.log('Cleared existing data');

  // Create Admin
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'admin123',
    },
  });

  console.log('Created admin:', admin.username);

  // Create Membership Plans
  const basicPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Basic Plan',
      duration: 1,
      price: 50.0,
      description: 'Access to gym equipment and facilities',
    },
  });

  const standardPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Standard Plan',
      duration: 3,
      price: 130.0,
      description: 'Includes equipment access and 2 group classes per week',
    },
  });

  const premiumPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Premium Plan',
      duration: 6,
      price: 240.0,
      description: 'Full access including personal training sessions',
    },
  });

  const goldPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Gold Plan',
      duration: 12,
      price: 450.0,
      description: 'Annual membership with all benefits',
    },
  });

  console.log('Created 4 membership plans');

  // Create Trainers
  const trainers = await Promise.all([
    prisma.trainer.create({
      data: {
        username: 'john_trainer',
        password: 'trainer123',
        name: 'John Smith',
        email: 'john.smith@gym.com',
        specialization: 'Strength Training',
      },
    }),
    prisma.trainer.create({
      data: {
        username: 'sarah_trainer',
        password: 'trainer123',
        name: 'Sarah Johnson',
        email: 'sarah.j@gym.com',
        specialization: 'Yoga & Flexibility',
      },
    }),
    prisma.trainer.create({
      data: {
        username: 'mike_trainer',
        password: 'trainer123',
        name: 'Mike Williams',
        email: 'mike.w@gym.com',
        specialization: 'HIIT & Cardio',
      },
    }),
    prisma.trainer.create({
      data: {
        username: 'emma_trainer',
        password: 'trainer123',
        name: 'Emma Davis',
        email: 'emma.d@gym.com',
        specialization: 'CrossFit',
      },
    }),
    prisma.trainer.create({
      data: {
        username: 'alex_trainer',
        password: 'trainer123',
        name: 'Alex Martinez',
        email: 'alex.m@gym.com',
        specialization: 'Boxing & MMA',
      },
    }),
  ]);

  console.log('Created 5 trainers');

  // Create Schedules for Trainers
  const scheduleDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const trainer of trainers) {
    const randomDays = scheduleDays.sort(() => 0.5 - Math.random()).slice(0, 4);
    for (const day of randomDays) {
      await prisma.schedule.create({
        data: {
          day,
          startTime: '09:00',
          endTime: '17:00',
          trainerId: trainer.id,
        },
      });
    }
  }

  console.log('Created schedules for trainers');

  // Create Members
  const memberData = [
    { firstName: 'Alice', lastName: 'Brown', email: 'alice.brown@email.com', username: 'alice_member', planId: goldPlan.id },
    { firstName: 'Bob', lastName: 'Wilson', email: 'bob.wilson@email.com', username: 'bob_member', planId: premiumPlan.id },
    { firstName: 'Carol', lastName: 'Taylor', email: 'carol.taylor@email.com', username: 'carol_member', planId: standardPlan.id },
    { firstName: 'David', lastName: 'Anderson', email: 'david.anderson@email.com', username: 'david_member', planId: basicPlan.id },
    { firstName: 'Eve', lastName: 'Thomas', email: 'eve.thomas@email.com', username: 'eve_member', planId: goldPlan.id },
    { firstName: 'Frank', lastName: 'Jackson', email: 'frank.jackson@email.com', username: 'frank_member', planId: standardPlan.id },
    { firstName: 'Grace', lastName: 'White', email: 'grace.white@email.com', username: 'grace_member', planId: premiumPlan.id },
    { firstName: 'Henry', lastName: 'Harris', email: 'henry.harris@email.com', username: 'henry_member', planId: basicPlan.id },
    { firstName: 'Ivy', lastName: 'Martin', email: 'ivy.martin@email.com', username: 'ivy_member', planId: goldPlan.id },
    { firstName: 'Jack', lastName: 'Thompson', email: 'jack.thompson@email.com', username: 'jack_member', planId: standardPlan.id },
  ];

  const members = [];
  for (const data of memberData) {
    const plan = await prisma.membershipPlan.findUnique({ where: { id: data.planId } });
    const joinDate = new Date();
    joinDate.setMonth(joinDate.getMonth() - Math.floor(Math.random() * 6));
    
    const membershipEnd = new Date(joinDate);
    membershipEnd.setMonth(membershipEnd.getMonth() + (plan?.duration || 1));

    const member = await prisma.member.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        password: 'member123',
        phone: `555-${Math.floor(1000 + Math.random() * 9000)}`,
        address: `${Math.floor(100 + Math.random() * 900)} Main St`,
        joinDate,
        membershipEnd,
        status: membershipEnd > new Date() ? 'Active' : 'Inactive',
        planId: data.planId,
      },
    });
    members.push(member);
  }

  console.log('Created 10 members');

  // Create Payments for Members
  for (const member of members) {
    const plan = await prisma.membershipPlan.findUnique({ where: { id: member.planId || '' } });
    const numPayments = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numPayments; i++) {
      const paymentDate = new Date(member.joinDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      
      await prisma.payment.create({
        data: {
          amount: plan?.price || 50,
          date: paymentDate,
          method: Math.random() > 0.5 ? 'Card' : 'Cash',
          memberId: member.id,
        },
      });
    }
  }

  console.log('Created payments for members');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
