import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpass', // In production, hash this!
      role: 'ADMIN',
      isApproved: true,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      name: 'Staff User',
      email: 'staff@example.com',
      password: 'staffpass',
      role: 'STAFF',
      isApproved: true,
    },
  });

  const publicUser = await prisma.user.upsert({
    where: { email: 'public@example.com' },
    update: {},
    create: {
      name: 'Public User',
      email: 'public@example.com',
      password: 'publicpass',
      role: 'PUBLIC',
      isApproved: true,
    },
  });

  // Seed projects
  await prisma.project.createMany({
    data: [
      {
        title: 'Water Supply Project',
        description: 'Provision of clean water to the community.',
        status: 'Completed',
        budgetedCost: 1000000,
        sourceOfFunds: 'County Government',
        progress: 100,
        department: 'Water',
        directorate: 'Infrastructure',
        contractName: 'Aqua Ltd',
        lpoNumber: 'LPO123',
        contractNumber: 'CN001',
        contractor: 'Aqua Ltd',
        contractPeriod: '2023-2024',
        contractStartDate: new Date('2023-01-01'),
        contractEndDate: new Date('2023-12-31'),
        contractCost: 1000000,
        implementationStatus: 'Completed',
        amountPaidToDate: 1000000,
        recommendations: 'Project successful',
        pmc: 'PMC1',
        lastUpdated: new Date(),
        subCounty: 'Kandara',
        ward: 'Muruka',
        images: [],
        financialYear: '2023/2024',
        latitude: -0.7831,
        longitude: 37.0400,
        staffId: staff.id,
        createdById: admin.id,
        lastEditedById: admin.id,
      },
      {
        title: 'Road Construction',
        description: 'Tarmacking of main road.',
        status: 'Ongoing',
        budgetedCost: 5000000,
        sourceOfFunds: 'National Government',
        progress: 60,
        department: 'Transport',
        directorate: 'Infrastructure',
        contractName: 'Roads Ltd',
        lpoNumber: 'LPO456',
        contractNumber: 'CN002',
        contractor: 'Roads Ltd',
        contractPeriod: '2023-2025',
        contractStartDate: new Date('2023-06-01'),
        contractEndDate: new Date('2025-06-01'),
        contractCost: 5000000,
        implementationStatus: 'Ongoing',
        amountPaidToDate: 3000000,
        recommendations: 'On track',
        pmc: 'PMC2',
        lastUpdated: new Date(),
        subCounty: 'Kigumo',
        ward: 'Kangari',
        images: [],
        financialYear: '2023/2024',
        latitude: -0.8000,
        longitude: 37.0500,
        staffId: staff.id,
        createdById: admin.id,
        lastEditedById: staff.id,
      },
      {
        title: 'School Renovation',
        description: 'Renovation of classrooms and facilities.',
        status: 'Stalled',
        budgetedCost: 2000000,
        sourceOfFunds: 'Donor',
        progress: 30,
        department: 'Education',
        directorate: 'Social Services',
        contractName: 'Builders Ltd',
        lpoNumber: 'LPO789',
        contractNumber: 'CN003',
        contractor: 'Builders Ltd',
        contractPeriod: '2023-2024',
        contractStartDate: new Date('2023-03-01'),
        contractEndDate: new Date('2024-03-01'),
        contractCost: 2000000,
        implementationStatus: 'Stalled',
        amountPaidToDate: 600000,
        recommendations: 'Needs review',
        pmc: 'PMC3',
        lastUpdated: new Date(),
        subCounty: 'Mathioya',
        ward: 'Kamacharia',
        images: [],
        financialYear: '2023/2024',
        latitude: -0.7900,
        longitude: 37.0600,
        staffId: staff.id,
        createdById: staff.id,
        lastEditedById: staff.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 