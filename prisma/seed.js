const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Arabic names in English letters
const arabicFirstNames = {
  male: ['Mohammed', 'Ahmed', 'Ali', 'Hassan', 'Hussein', 'Omar', 'Khaled', 'Youssef', 'Kareem', 'Tariq', 'Sami', 'Majed', 'Fahad', 'Saad', 'Abdullah', 'Ibrahim', 'Abdulrahman', 'Faisal', 'Sultan', 'Nawaf', 'Mishaal', 'Badr', 'Rashid', 'Turki', 'Waleed', 'Yasser', 'Hani', 'Ziad', 'Rami', 'Adel', 'Nasser', 'Saleh', 'Mansour', 'Hamad', 'Saud', 'Talal', 'Mazen', 'Osama', 'Jamal', 'Fares'],
  female: ['Fatima', 'Aisha', 'Maryam', 'Zainab', 'Khadija', 'Sarah', 'Noor', 'Layla', 'Huda', 'Amal', 'Rana', 'Dina', 'Mona', 'Salma', 'Reem', 'Lina', 'Hala', 'Nadia', 'Sumaya', 'Jamila', 'Latifa', 'Abeer', 'Yasmin', 'Rawan', 'Shahad', 'Joud', 'Malak', 'Ghada', 'Noha', 'Sanaa', 'Amira', 'Hanan', 'Najla', 'Wafa', 'Basma', 'Dalal', 'Hessa', 'Maha', 'Nada', 'Samira']
};

const arabicLastNames = ['Al-Otaibi', 'Al-Shammari', 'Al-Qahtani', 'Al-Dosari', 'Al-Harbi', 'Al-Zahrani', 'Al-Ghamdi', 'Al-Anzi', 'Al-Mutairi', 'Al-Omari', 'Al-Sahli', 'Al-Juhani', 'Al-Rashidi', 'Al-Balawi', 'Al-Khalidi', 'Al-Subai', 'Al-Thubaiti', 'Al-Maliki', 'Al-Ahmadi', 'Al-Shahri', 'Al-Fahad', 'Al-Saeed', 'Al-Najjar', 'Al-Haddad', 'Al-Khatib', 'Al-Bakri', 'Al-Tamimi', 'Al-Hashimi', 'Al-Ansari', 'Al-Mahdi', 'Al-Mansour', 'Al-Sayed', 'Al-Turki', 'Al-Faisal', 'Al-Sultan', 'Al-Nasser', 'Al-Saleh', 'Al-Hamad', 'Al-Waleed', 'Al-Majed'];

const trainerSpecializations = [
  'Strength Training',
  'Yoga & Flexibility',
  'Cardio Training',
  'CrossFit',
  'Boxing & MMA',
  'Swimming',
  'Gymnastics',
  'Functional Training',
  'Bodybuilding',
  'General Fitness',
  'Pilates',
  'Zumba',
  'Spinning',
  'Martial Arts',
  'Calisthenics'
];

const cities = ['Riyadh', 'Jeddah', 'Makkah', 'Madinah', 'Dammam', 'Khobar', 'Taif', 'Tabuk', 'Abha', 'Al-Ahsa', 'Buraidah', 'Khamis Mushait', 'Hail', 'Najran', 'Jizan'];
const streets = ['King Fahd Road', 'Olaya Street', 'Tahlia Street', 'Prince Mohammed Street', 'Al-Sitteen Street', 'Prince Sultan Street', 'King Abdullah Road', 'Prince Faisal Street', 'Al-Khazan Street', 'Al-Nakheel Street', 'Al-Urubah Road', 'Makkah Road', 'Madinah Road', 'Al-Amir Street', 'Al-Malaz Street'];

// Helper function to generate random date in 2025
function randomDate2025(startMonth = 0, endMonth = 11) {
  const month = Math.floor(Math.random() * (endMonth - startMonth + 1)) + startMonth;
  const day = Math.floor(Math.random() * 28) + 1;
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  return new Date(2025, month, day, hour, minute);
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log('🗑️  Clearing existing data...');
  
  await prisma.memberTrainer.deleteMany({});
  await prisma.schedule.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.trainer.deleteMany({});
  await prisma.membershipPlan.deleteMany({});
  await prisma.admin.deleteMany({});

  console.log('✅ Cleared existing data');

  // Create Admin
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: '0000000000',
    },
  });

  console.log('✅ Created admin');

  // Create Membership Plans
  const plans = await Promise.all([
    prisma.membershipPlan.create({
      data: {
        name: 'Basic Plan',
        duration: 1,
        price: 200.0,
        description: 'Access to gym equipment and facilities',
      },
    }),
    prisma.membershipPlan.create({
      data: {
        name: 'Standard Plan',
        duration: 3,
        price: 550.0,
        description: 'Includes equipment access and 2 group classes per week',
      },
    }),
    prisma.membershipPlan.create({
      data: {
        name: 'Premium Plan',
        duration: 6,
        price: 1000.0,
        description: 'Full access including personal training sessions',
      },
    }),
    prisma.membershipPlan.create({
      data: {
        name: 'Gold Plan',
        duration: 12,
        price: 1800.0,
        description: 'Annual membership with all benefits',
      },
    }),
    prisma.membershipPlan.create({
      data: {
        name: 'Platinum Plan',
        duration: 12,
        price: 2500.0,
        description: 'VIP membership with dedicated personal trainer',
      },
    }),
  ]);

  console.log(`✅ Created ${plans.length} membership plans`);

  // Create 30 Trainers
  const trainers = [];
  for (let i = 0; i < 30; i++) {
    const isMale = Math.random() > 0.3;
    const firstName = randomItem(isMale ? arabicFirstNames.male : arabicFirstNames.female);
    const lastName = randomItem(arabicLastNames);
    const name = `${firstName} ${lastName}`;
    const username = `trainer${i + 1}`;
    const email = `${username}@gym.sa`;
    const specialization = randomItem(trainerSpecializations);

    const trainer = await prisma.trainer.create({
      data: {
        username,
        password: '0000000000',
        name,
        email,
        specialization,
      },
    });
    trainers.push(trainer);
  }

  console.log(`✅ Created ${trainers.length} trainers`);

  // Create Schedules for Trainers
  const scheduleDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    { start: '06:00', end: '10:00' },
    { start: '10:00', end: '14:00' },
    { start: '14:00', end: '18:00' },
    { start: '18:00', end: '22:00' },
  ];

  let scheduleCount = 0;
  for (const trainer of trainers) {
    const numDays = Math.floor(Math.random() * 3) + 4;
    const selectedDays = scheduleDays.sort(() => 0.5 - Math.random()).slice(0, numDays);
    
    for (const day of selectedDays) {
      const slot = randomItem(timeSlots);
      await prisma.schedule.create({
        data: {
          day,
          startTime: slot.start,
          endTime: slot.end,
          trainerId: trainer.id,
        },
      });
      scheduleCount++;
    }
  }

  console.log(`✅ Created ${scheduleCount} schedules`);

  // Create 150 Members
  const members = [];
  for (let i = 0; i < 150; i++) {
    const isMale = Math.random() > 0.4;
    const firstName = randomItem(isMale ? arabicFirstNames.male : arabicFirstNames.female);
    const lastName = randomItem(arabicLastNames);
    const username = `member${i + 1}`;
    const email = `${username}@email.sa`;
    const plan = randomItem(plans);
    
    const joinDate = randomDate2025(0, 10);
    const membershipEnd = new Date(joinDate);
    membershipEnd.setMonth(membershipEnd.getMonth() + plan.duration);
    
    const now = new Date();
    const status = membershipEnd > now ? 'Active' : 'Inactive';
    
    const member = await prisma.member.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: '0000000000',
        phone: `05${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: `${Math.floor(100 + Math.random() * 9900)} ${randomItem(streets)}, ${randomItem(cities)}`,
        joinDate,
        membershipEnd,
        status,
        planId: plan.id,
      },
    });
    members.push(member);
  }

  console.log(`✅ Created ${members.length} members`);

  // Create Member-Trainer Subscriptions
  let subscriptionCount = 0;
  for (const member of members) {
    if (Math.random() < 0.6) {
      const numTrainers = Math.floor(Math.random() * 3) + 1;
      const selectedTrainers = trainers.sort(() => 0.5 - Math.random()).slice(0, numTrainers);
      
      for (const trainer of selectedTrainers) {
        const subscribeDate = new Date(member.joinDate);
        subscribeDate.setDate(subscribeDate.getDate() + Math.floor(Math.random() * 30));
        
        await prisma.memberTrainer.create({
          data: {
            memberId: member.id,
            trainerId: trainer.id,
            subscribedAt: subscribeDate,
          },
        });
        subscriptionCount++;
      }
    }
  }

  console.log(`✅ Created ${subscriptionCount} member-trainer subscriptions`);

  // Create Payments
  let paymentCount = 0;
  for (const member of members) {
    const plan = plans.find(p => p.id === member.planId);
    if (!plan) continue;
    
    const numPayments = Math.min(plan.duration, 12);
    
    for (let i = 0; i < numPayments; i++) {
      const paymentDate = new Date(member.joinDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      
      if (paymentDate.getFullYear() === 2025) {
        await prisma.payment.create({
          data: {
            amount: plan.price / plan.duration,
            date: paymentDate,
            method: Math.random() > 0.6 ? 'Card' : 'Cash',
            memberId: member.id,
          },
        });
        paymentCount++;
      }
    }
  }

  console.log(`✅ Created ${paymentCount} payments`);

  // Create Attendance Records
  let attendanceCount = 0;
  const memberTrainers = await prisma.memberTrainer.findMany({
    include: { member: true }
  });

  for (const mt of memberTrainers) {
    const numAttendances = Math.floor(Math.random() * 61) + 20;
    
    for (let i = 0; i < numAttendances; i++) {
      const minDate = new Date(mt.subscribedAt);
      const maxDate = new Date(2025, 11, 31);
      const attendanceDate = new Date(
        minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime())
      );
      
      if (attendanceDate.getFullYear() === 2025 && attendanceDate >= mt.member.joinDate) {
        await prisma.attendance.create({
          data: {
            date: attendanceDate,
            memberId: mt.memberId,
            trainerId: mt.trainerId,
          },
        });
        attendanceCount++;
      }
    }
  }

  console.log(`✅ Created ${attendanceCount} attendance records`);
  
  console.log('\n🎉 Seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - 1 Admin`);
  console.log(`   - ${plans.length} Membership Plans`);
  console.log(`   - ${trainers.length} Trainers`);
  console.log(`   - ${scheduleCount} Schedules`);
  console.log(`   - ${members.length} Members`);
  console.log(`   - ${subscriptionCount} Subscriptions`);
  console.log(`   - ${paymentCount} Payments`);
  console.log(`   - ${attendanceCount} Attendance Records`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
