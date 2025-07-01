import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.utils';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@muranga.gov.ke'; // admin email
  const newPassword = 'admin456';
  const hashed = await hashPassword(newPassword);

  const updated = await prisma.user.update({
    where: { email },
    data: { password: hashed },
  });

  console.log('Admin password updated!', updated.email);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
}); 